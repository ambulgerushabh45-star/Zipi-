import crypto from 'node:crypto';
import { INQUIRY_TYPES, INTEREST_CATEGORIES, SECTORS, INQUIRY_STATUSES } from '../models/Inquiry.js';
import { ORDER_STATUSES } from '../models/Order.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const ALLOWED_TIMELINES = [
  'Immediately',
  'Within 1 month',
  '1–3 months',
  'Just exploring',
];

/**
 * Generates a unique 6-character alphanumeric reference ID prefixed with ZP-.
 */
export function generateRef() {
  const bytes = crypto.randomBytes(6);
  let suffix = '';
  for (let i = 0; i < 6; i += 1) {
    suffix += REF_ALPHABET[bytes[i] % REF_ALPHABET.length];
  }
  return `ZP-${suffix}`;
}

/**
 * Generates a unique 6-character alphanumeric reference ID prefixed with ZO- for orders.
 */
export function generateOrderRef() {
  const bytes = crypto.randomBytes(6);
  let suffix = '';
  for (let i = 0; i < 6; i += 1) {
    suffix += REF_ALPHABET[bytes[i] % REF_ALPHABET.length];
  }
  return `ZO-${suffix}`;
}

/**
 * Escapes special regular-expression characters before passing user search strings to MongoDB $regex.
 */
export function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Constant-time admin key comparison via SHA-256 digests so lengths never leak or throw.
 */
export function isValidAdminKey(providedKey, expectedKey) {
  if (!expectedKey || typeof providedKey !== 'string' || !providedKey) {
    return false;
  }
  const providedDigest = crypto.createHash('sha256').update(providedKey).digest();
  const expectedDigest = crypto.createHash('sha256').update(expectedKey).digest();
  return crypto.timingSafeEqual(providedDigest, expectedDigest);
}

/**
 * Validates and normalizes incoming POST /api/inquiries payload.
 */
export function validateInquiryPayload(body) {
  const errors = {};
  const payload = body && typeof body === 'object' ? body : {};

  const type = typeof payload.type === 'string' ? payload.type.trim() : '';
  if (!INQUIRY_TYPES.includes(type)) {
    errors.type = 'Please select a valid request type.';
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  if (name.length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  } else if (name.length > 120) {
    errors.name = 'Full name cannot exceed 120 characters.';
  }

  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  if (!EMAIL_REGEX.test(email) || email.length > 160) {
    errors.email = 'Please enter a valid email address.';
  }

  const phone = typeof payload.phone === 'string' ? payload.phone.trim() : '';
  const digitCount = (phone.match(/\d/g) || []).length;
  if (digitCount < 8 || phone.length > 40) {
    errors.phone = 'Phone or WhatsApp number must contain at least 8 digits.';
  }

  const company = typeof payload.company === 'string' ? payload.company.trim() : '';
  if ((type === 'dealer' || type === 'rfp') && company.length < 2) {
    errors.company = 'Company or organization name is required for Dealer and Enterprise RFP enquiries.';
  } else if (company.length > 140) {
    errors.company = 'Company name cannot exceed 140 characters.';
  }

  const region = typeof payload.region === 'string' ? payload.region.trim().slice(0, 140) : '';

  const rawInterests = Array.isArray(payload.interests) ? payload.interests : [];
  const interests = [...new Set(rawInterests.filter((item) => INTEREST_CATEGORIES.includes(item)))];
  if (type !== 'support' && interests.length === 0) {
    errors.interests = 'Please select at least one hardware category.';
  }

  let quantity = 1;
  if (type !== 'support') {
    const parsedQty = Number(payload.quantity ?? 1);
    if (!Number.isInteger(parsedQty) || parsedQty < 1 || parsedQty > 999) {
      errors.quantity = 'Quantity must be a whole number between 1 and 999.';
    } else {
      quantity = parsedQty;
    }
  }

  let sector = 'defence';
  if (type !== 'support' && payload.sector !== undefined) {
    if (!SECTORS.includes(payload.sector)) {
      errors.sector = 'Sector must be either defence or agriculture.';
    } else {
      sector = payload.sector;
    }
  }

  const timeline =
    type === 'support'
      ? ''
      : typeof payload.timeline === 'string'
        ? payload.timeline.trim().slice(0, 60)
        : '';

  const product =
    type === 'support'
      ? ''
      : typeof payload.product === 'string'
        ? payload.product.trim().slice(0, 120)
        : '';

  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  if (message.length < 10) {
    errors.message = 'Please provide at least 10 characters describing your enquiry.';
  } else if (message.length > 600) {
    errors.message = 'Message cannot exceed 600 characters.';
  }

  if (payload.consent !== true) {
    errors.consent = 'Consent is required before sending your enquiry to a supervisor.';
  }

  const firstError = Object.values(errors)[0] || null;

  return {
    valid: Object.keys(errors).length === 0,
    error: firstError,
    errors,
    data: {
      type,
      name,
      email,
      phone,
      company,
      region,
      interests: type === 'support' ? [] : interests,
      quantity,
      sector,
      timeline,
      product,
      message,
    },
  };
}

/**
 * Validates admin PATCH payload for status and supervisorNotes updates.
 */
export function validateAdminPatch(body) {
  const payload = body && typeof body === 'object' ? body : {};
  const update = {};

  if (payload.status !== undefined) {
    if (!INQUIRY_STATUSES.includes(payload.status)) {
      return { error: 'Invalid status value.' };
    }
    update.status = payload.status;
  }

  if (payload.supervisorNotes !== undefined) {
    if (typeof payload.supervisorNotes !== 'string') {
      return { error: 'Supervisor notes must be text.' };
    }
    update.supervisorNotes = payload.supervisorNotes.trim().slice(0, 2000);
  }

  if (Object.keys(update).length === 0) {
    return { error: 'Provide status or supervisorNotes to update.' };
  }

  return { update };
}

/**
 * Validates and normalizes incoming POST /api/orders payload.
 */
export function validateOrderPayload(body) {
  const errors = {};
  const payload = body && typeof body === 'object' ? body : {};

  let name = typeof payload.name === 'string' ? payload.name.trim() : '';
  if (!name && (payload.firstName || payload.lastName)) {
    name = `${payload.firstName || ''} ${payload.lastName || ''}`.trim();
  }
  if (name.length < 2) {
    errors.name = 'Full customer name must be at least 2 characters.';
  } else if (name.length > 120) {
    errors.name = 'Name cannot exceed 120 characters.';
  }

  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  if (!EMAIL_REGEX.test(email) || email.length > 160) {
    errors.email = 'Please enter a valid email address.';
  }

  const phone = typeof payload.phone === 'string' ? payload.phone.trim() : '';
  const digitCount = (phone.match(/\d/g) || []).length;
  if (digitCount < 8 || phone.length > 40) {
    errors.phone = 'Phone number must contain at least 8 digits.';
  }

  const company = typeof payload.company === 'string' ? payload.company.trim().slice(0, 140) : '';

  const address = typeof payload.address === 'string' ? payload.address.trim() : '';
  if (address.length < 3) {
    errors.address = 'Street address must be at least 3 characters.';
  } else if (address.length > 200) {
    errors.address = 'Address cannot exceed 200 characters.';
  }

  const city = typeof payload.city === 'string' ? payload.city.trim() : '';
  if (city.length < 2) {
    errors.city = 'City must be at least 2 characters.';
  } else if (city.length > 100) {
    errors.city = 'City cannot exceed 100 characters.';
  }

  const state = typeof payload.state === 'string' ? payload.state.trim() : '';
  if (state.length < 2) {
    errors.state = 'State or province must be at least 2 characters.';
  } else if (state.length > 100) {
    errors.state = 'State cannot exceed 100 characters.';
  }

  const postalCode = typeof payload.postalCode === 'string' ? payload.postalCode.trim() : '';
  if (postalCode.length < 2) {
    errors.postalCode = 'Postal / ZIP code must be at least 2 characters.';
  } else if (postalCode.length > 40) {
    errors.postalCode = 'Postal code cannot exceed 40 characters.';
  }

  const country =
    typeof payload.country === 'string' && payload.country.trim()
      ? payload.country.trim().slice(0, 100)
      : 'United States';

  const notes = typeof payload.notes === 'string' ? payload.notes.trim().slice(0, 1000) : '';

  const rawItems = Array.isArray(payload.items) ? payload.items : [];
  if (rawItems.length === 0 || rawItems.length > 50) {
    errors.items = 'Order must contain between 1 and 50 items.';
  }

  const items = [];
  for (let i = 0; i < rawItems.length; i += 1) {
    const raw = rawItems[i];
    if (!raw || typeof raw !== 'object') {
      errors[`items.${i}`] = `Item #${i + 1} is invalid.`;
      continue;
    }
    const productId = typeof raw.productId === 'string' ? raw.productId.trim() : '';
    const itemName = typeof raw.name === 'string' ? raw.name.trim() : productId;
    const unitPrice = Number(raw.unitPrice);
    const quantity = Number(raw.quantity);
    const color = typeof raw.color === 'string' ? raw.color.trim().slice(0, 60) : '';

    if (!productId || !itemName) {
      errors[`items.${i}.product`] = `Item #${i + 1} must have a valid product name and ID.`;
    }
    if (Number.isNaN(unitPrice) || unitPrice < 0) {
      errors[`items.${i}.unitPrice`] = `Item #${i + 1} must have a valid non-negative unit price.`;
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
      errors[`items.${i}.quantity`] = `Item #${i + 1} quantity must be a whole number between 1 and 999.`;
    }

    items.push({
      productId,
      name: itemName,
      unitPrice: Number.isNaN(unitPrice) ? 0 : unitPrice,
      quantity: Number.isInteger(quantity) ? quantity : 1,
      color,
    });
  }

  const claimedTotal = Number(payload.claimedTotal);
  if (Number.isNaN(claimedTotal) || claimedTotal < 0) {
    errors.claimedTotal = 'Claimed total must be a valid non-negative number.';
  }

  if (payload.consent !== true) {
    errors.consent = 'Consent is required before transmitting your order to a supervisor.';
  }

  const firstError = Object.values(errors)[0] || null;

  return {
    valid: Object.keys(errors).length === 0,
    error: firstError,
    errors,
    data: {
      name,
      email,
      phone,
      company,
      address,
      city,
      state,
      postalCode,
      country,
      notes,
      items,
      claimedTotal: Number.isNaN(claimedTotal) ? 0 : claimedTotal,
    },
  };
}

/**
 * Validates admin PATCH payload for order status and supervisorNotes updates.
 */
export function validateOrderAdminPatch(body) {
  const payload = body && typeof body === 'object' ? body : {};
  const update = {};

  if (payload.status !== undefined) {
    if (!ORDER_STATUSES.includes(payload.status)) {
      return { error: 'Invalid order status value.' };
    }
    update.status = payload.status;
  }

  if (payload.supervisorNotes !== undefined) {
    if (typeof payload.supervisorNotes !== 'string') {
      return { error: 'Supervisor notes must be text.' };
    }
    update.supervisorNotes = payload.supervisorNotes.trim().slice(0, 2000);
  }

  if (Object.keys(update).length === 0) {
    return { error: 'Provide status or supervisorNotes to update.' };
  }

  return { update };
}

