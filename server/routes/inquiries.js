import express from 'express';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import Inquiry, { INQUIRY_STATUSES, INQUIRY_TYPES } from '../models/Inquiry.js';
import { sendCustomerConfirmation, sendSupervisorNotification } from '../utils/mailer.js';
import {
  escapeRegex,
  generateRef,
  isValidAdminKey,
  validateAdminPatch,
  validateInquiryPayload,
} from '../utils/validation.js';

const router = express.Router();

const publicInquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === 'test' ? 1000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many enquiries submitted from this IP. Please wait 15 minutes before trying again.',
  },
});

function requireDbConnected(_req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database is currently unavailable. Please ensure MongoDB is running and try again.',
    });
  }
  return next();
}

function requireAdminKey(req, res, next) {
  const providedKey = req.get('x-admin-key') || '';
  const expectedKey = process.env.ADMIN_KEY || '';

  if (!isValidAdminKey(providedKey, expectedKey)) {
    return res.status(401).json({ error: 'Unauthorized: invalid or missing admin key.' });
  }

  return next();
}

// POST /api/inquiries — Public submission endpoint
router.post('/inquiries', publicInquiryLimiter, requireDbConnected, async (req, res) => {
  try {
    // Honeypot check: silently return fake success without persisting or emailing
    if (typeof req.body?.website === 'string' && req.body.website.trim().length > 0) {
      return res.status(201).json({ ref: generateRef() });
    }

    const validation = validateInquiryPayload(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        error: validation.error,
        fields: validation.errors,
      });
    }

    const clientIp = (req.ip || '').slice(0, 64);

    // Retry on rare reference collision
    let savedInquiry = null;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        savedInquiry = await Inquiry.create({
          ...validation.data,
          ref: generateRef(),
          status: 'pending_supervisor',
          ip: clientIp,
        });
        break;
      } catch (err) {
        if (err?.code === 11000 && err?.keyPattern?.ref && attempt < 4) {
          continue;
        }
        throw err;
      }
    }

    // Non-blocking supervisor notification & optional customer confirmation
    sendSupervisorNotification(savedInquiry).catch((mailErr) => {
      console.error(
        `[mail] Supervisor notification failed for ${savedInquiry.ref}:`,
        mailErr?.message || mailErr
      );
    });

    sendCustomerConfirmation(savedInquiry).catch((mailErr) => {
      console.error(
        `[mail] Customer confirmation failed for ${savedInquiry.ref}:`,
        mailErr?.message || mailErr
      );
    });

    return res.status(201).json({ ref: savedInquiry.ref });
  } catch (err) {
    if (err?.name === 'ValidationError') {
      const firstErr = Object.values(err.errors || {})[0]?.message || 'Invalid enquiry fields.';
      return res.status(400).json({ error: firstErr });
    }
    console.error('Error creating inquiry:', err);
    return res.status(500).json({ error: 'Unable to submit enquiry right now. Please try again.' });
  }
});

// GET /api/admin/inquiries — Protected supervisor list with filters & pagination
router.get('/admin/inquiries', requireAdminKey, requireDbConnected, async (req, res) => {
  try {
    const query = {};
    const { status, type, q } = req.query;

    if (typeof status === 'string' && INQUIRY_STATUSES.includes(status)) {
      query.status = status;
    }

    if (typeof type === 'string' && INQUIRY_TYPES.includes(type)) {
      query.type = type;
    }

    if (typeof q === 'string' && q.trim()) {
      const safePattern = new RegExp(escapeRegex(q.trim()), 'i');
      query.$or = [
        { name: safePattern },
        { email: safePattern },
        { company: safePattern },
        { ref: safePattern },
      ];
    }

    const page = Math.max(1, Number.parseInt(String(req.query.page || '1'), 10) || 1);
    const requestedLimit = Number.parseInt(String(req.query.limit || '25'), 10) || 25;
    const limit = Math.min(100, Math.max(1, requestedLimit));
    const skip = (page - 1) * limit;

    const [inquiries, total] = await Promise.all([
      Inquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Inquiry.countDocuments(query),
    ]);

    return res.json({
      inquiries,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    console.error('Error listing admin inquiries:', err);
    return res.status(500).json({ error: 'Failed to load enquiries.' });
  }
});

// PATCH /api/admin/inquiries/:ref — Protected status and notes update
router.patch('/admin/inquiries/:ref', requireAdminKey, requireDbConnected, async (req, res) => {
  try {
    const ref = String(req.params.ref || '').trim().toUpperCase();
    if (!ref) {
      return res.status(400).json({ error: 'Enquiry reference is required.' });
    }

    const patch = validateAdminPatch(req.body);
    if (patch.error) {
      return res.status(400).json({ error: patch.error });
    }

    const inquiry = await Inquiry.findOneAndUpdate(
      { ref },
      { $set: patch.update },
      { new: true, runValidators: true }
    ).lean();

    if (!inquiry) {
      return res.status(404).json({ error: `Enquiry ${ref} not found.` });
    }

    return res.json({ inquiry });
  } catch (err) {
    console.error('Error updating inquiry:', err);
    return res.status(500).json({ error: 'Failed to update enquiry.' });
  }
});

export default router;
