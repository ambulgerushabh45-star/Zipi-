import { Crosshair, Radio, Monitor, Cpu, Wrench } from 'lucide-react';

export const REQUEST_TYPES = [
  {
    id: 'order',
    label: 'Place an Order',
    shortLabel: 'Place an Order',
    badge: 'DIRECT PROCUREMENT',
    companyRequired: false,
    description: 'Hardware purchase, configuration options, and dispatch scheduling.',
  },
  {
    id: 'dealer',
    label: 'Dealer-Partner',
    shortLabel: 'Dealer-Partner',
    badge: 'AUTHORIZED NETWORK',
    companyRequired: true,
    description: 'Regional distribution partnerships, fleet reselling, and local service hubs.',
  },
  {
    id: 'rfp',
    label: 'Enterprise RFP',
    shortLabel: 'Enterprise RFP',
    badge: 'TENDER / FLEET',
    companyRequired: true,
    description: 'Government, municipal rescue, or large-scale commercial tenders.',
  },
  {
    id: 'support',
    label: 'Support Query',
    shortLabel: 'Support Query',
    badge: '24/7 OPS DESK',
    companyRequired: false,
    description: 'Telemetry diagnostics, flight maintenance, firmware, and warranty support.',
  },
];

export const INTEREST_CATEGORIES = [
  { id: 'uav', label: 'UAV Drones', icon: Crosshair },
  { id: 'controller', label: 'Remote Controllers', icon: Radio },
  { id: 'gcs', label: 'Ground Control', icon: Monitor },
  { id: 'avionics', label: 'Avionics & Datalink', icon: Cpu },
  { id: 'accessory', label: 'Accessories', icon: Wrench },
];

export const TIMELINE_OPTIONS = [
  'Immediately',
  'Within 1 month',
  '1–3 months',
  'Just exploring',
];

export const STEP_LABELS = [
  { step: 1, label: 'About you' },
  { step: 2, label: 'Your need' },
  { step: 3, label: 'Review' },
];

const HARDWARE_TO_INTEREST = {
  drone: 'uav',
  controller: 'controller',
  gcs: 'gcs',
  avionics: 'avionics',
  accessory: 'accessory',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function getProductDefaults(product, requestType = 'order') {
  if (!product) return null;

  const interest = HARDWARE_TO_INTEREST[product.hardwareType] || 'uav';
  const sector =
    product.category === 'agriculture' || product.missionTag === 'agriculture'
      ? 'agriculture'
      : 'defence';

  const sku = product.id.toUpperCase();
  let starterMessage = `Enquiry regarding ${product.name} (${sku}): `;
  if (requestType === 'dealer') {
    starterMessage = `Interested in authorized dealer/partner distribution for ${product.name} (${sku}) in our region. `;
  } else if (requestType === 'order') {
    starterMessage = `I would like to place an order enquiry for ${product.name} (${sku}). Please confirm lead time and delivery details. `;
  } else if (requestType === 'rfp') {
    starterMessage = `Requesting an Enterprise RFP proposal covering ${product.name} (${sku}) fleet deployment. `;
  } else if (requestType === 'support') {
    starterMessage = `Technical support query regarding ${product.name} (${sku}): `;
  }

  return {
    interest,
    sector,
    starterMessage,
  };
}

export function isValidEmail(email) {
  return EMAIL_REGEX.test(String(email || '').trim());
}

export function countDigits(phone) {
  return (String(phone || '').match(/\d/g) || []).length;
}

export function validateStep1(data) {
  const errors = {};
  const requiresCompany = data.type === 'dealer' || data.type === 'rfp';

  if (data.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  }
  if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (countDigits(data.phone) < 8) {
    errors.phone = 'Enter a phone or WhatsApp number with at least 8 digits.';
  }
  if (requiresCompany && data.company.trim().length < 2) {
    errors.company = 'Company or organization is required for Dealer and Enterprise RFP enquiries.';
  }

  return errors;
}

export function validateStep2(data) {
  const errors = {};

  if (data.type !== 'support') {
    if (!Array.isArray(data.interests) || data.interests.length === 0) {
      errors.interests = 'Select at least one product category.';
    }
    const qty = Number(data.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 999) {
      errors.quantity = 'Quantity must be between 1 and 999.';
    }
  }

  const trimmedMsg = data.message.trim();
  if (trimmedMsg.length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  } else if (trimmedMsg.length > 600) {
    errors.message = 'Message cannot exceed 600 characters.';
  }

  return errors;
}

