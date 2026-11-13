import express from 'express';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import Order, { ORDER_STATUSES } from '../models/Order.js';
import { sendOrderSupervisorNotification } from '../utils/mailer.js';
import {
  escapeRegex,
  generateOrderRef,
  isValidAdminKey,
  validateOrderAdminPatch,
  validateOrderPayload,
} from '../utils/validation.js';

const router = express.Router();

const publicOrderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === 'test' ? 1000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many orders submitted from this IP. Please wait 15 minutes before trying again.',
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

// POST /api/orders — Public checkout order submission endpoint
router.post(
  '/orders',
  publicOrderLimiter,
  requireDbConnected,
  express.json({ limit: '50kb' }),
  async (req, res) => {
    try {
      // Honeypot check: silently return fake success without persisting or emailing
      if (typeof req.body?.website === 'string' && req.body.website.trim().length > 0) {
        return res.status(201).json({ ref: generateOrderRef() });
      }

      const validation = validateOrderPayload(req.body);
      if (!validation.valid) {
        return res.status(400).json({
          error: validation.error,
          fields: validation.errors,
        });
      }

      const clientIp = (req.ip || '').slice(0, 64);

      // Retry on rare reference collision
      let savedOrder = null;
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          savedOrder = await Order.create({
            ...validation.data,
            ref: generateOrderRef(),
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

      // Non-blocking supervisor notification
      sendOrderSupervisorNotification(savedOrder).catch((mailErr) => {
        console.error(
          `[mail] Supervisor order notification failed for ${savedOrder.ref}:`,
          mailErr?.message || mailErr
        );
      });

      return res.status(201).json({ ref: savedOrder.ref });
    } catch (err) {
      if (err?.name === 'ValidationError') {
        const firstErr = Object.values(err.errors || {})[0]?.message || 'Invalid order fields.';
        return res.status(400).json({ error: firstErr });
      }
      console.error('Error creating order:', err);
      return res.status(500).json({ error: 'Unable to submit order right now. Please try again.' });
    }
  }
);

// GET /api/admin/orders — Protected supervisor order list with filters & pagination
router.get('/admin/orders', requireAdminKey, requireDbConnected, async (req, res) => {
  try {
    const query = {};
    const { status, q } = req.query;

    if (typeof status === 'string' && ORDER_STATUSES.includes(status)) {
      query.status = status;
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

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(query),
    ]);

    return res.json({
      orders,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    console.error('Error listing orders:', err);
    return res.status(500).json({ error: 'Unable to fetch orders right now.' });
  }
});

// PATCH /api/admin/orders/:ref — Protected supervisor status & notes update
router.patch('/admin/orders/:ref', requireAdminKey, requireDbConnected, async (req, res) => {
  try {
    const ref = typeof req.params.ref === 'string' ? req.params.ref.trim().toUpperCase() : '';
    if (!ref) {
      return res.status(400).json({ error: 'Order reference is required.' });
    }

    const validation = validateOrderAdminPatch(req.body);
    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const order = await Order.findOneAndUpdate(
      { ref },
      { $set: validation.update },
      { new: true, runValidators: true }
    ).lean();

    if (!order) {
      return res.status(404).json({ error: `Order with reference ${ref} not found.` });
    }

    return res.json({ order });
  } catch (err) {
    console.error('Error updating order:', err);
    return res.status(500).json({ error: 'Unable to update order right now.' });
  }
});

export default router;

