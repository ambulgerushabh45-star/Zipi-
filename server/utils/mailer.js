import nodemailer from 'nodemailer';
import Inquiry from '../models/Inquiry.js';
import Order from '../models/Order.js';

const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const TYPE_LABELS = {
  order: 'Place an Order',
  dealer: 'Dealer / Partner',
  rfp: 'Enterprise RFP',
  support: 'Support Query',
};

/**
 * Escapes user-provided strings before inserting them into HTML email templates.
 */
export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch]);
}

let cachedTransporter = null;

/**
 * Builds or returns the shared transporter.
 */
export function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const host = process.env.SMTP_HOST?.trim();
  if (!host) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  });

  return cachedTransporter;
}

/**
 * Allows test scripts or custom setups to set/override the shared transporter.
 */
export function setTransporter(transporter) {
  cachedTransporter = transporter;
}

/**
 * Verifies SMTP connectivity at startup.
 */
export async function verifySmtp() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const supervisor = process.env.SUPERVISOR_EMAIL?.trim();

  if (!host || !supervisor) {
    console.warn(
      '[mail] SMTP not configured. Emails will be skipped. To enable, configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SUPERVISOR_EMAIL in server/.env.'
    );
    return false;
  }

  const transporter = getTransporter();
  if (!transporter) {
    console.warn('[mail] Unable to initialize SMTP transporter.');
    return false;
  }

  try {
    await transporter.verify();
    console.log(`[mail] SMTP ready (${host}:${process.env.SMTP_PORT || 587}, user: ${user || 'anonymous'})`);
    return true;
  } catch (err) {
    const errCode = err?.code || 'UNKNOWN';
    const errMsg = err?.message || String(err);
    console.error(`[mail] SMTP verification error [${errCode}]: ${errMsg}`);
    return false;
  }
}

/**
 * Sends a supervisor notification email for a Contact enquiry.
 * Updates inquiry.emailStatus and inquiry.emailError in MongoDB.
 */
export async function sendSupervisorNotification(inquiry) {
  const transporter = getTransporter();
  const supervisorEmail = process.env.SUPERVISOR_EMAIL?.trim();

  if (!transporter || !supervisorEmail) {
    if (inquiry?._id) {
      await Inquiry.findByIdAndUpdate(inquiry._id, {
        emailStatus: 'skipped',
        emailError: '',
      }).catch(() => {});
    }
    console.log(`[mail] Supervisor enquiry notification skipped for ${inquiry?.ref} (SMTP not configured)`);
    return { sent: false, reason: 'smtp_unconfigured' };
  }

  const fromAddress = process.env.SMTP_USER?.trim() || 'noreply@zipi.aero';
  const typeLabel = TYPE_LABELS[inquiry.type] || inquiry.type;

  const safeRef = escapeHtml(inquiry.ref);
  const safeType = escapeHtml(typeLabel);
  const safeName = escapeHtml(inquiry.name);
  const safeEmail = escapeHtml(inquiry.email);
  const safePhone = escapeHtml(inquiry.phone);
  const safeCompany = escapeHtml(inquiry.company || 'Not provided');
  const safeRegion = escapeHtml(inquiry.region || 'Not provided');
  const safeCategories = escapeHtml((inquiry.interests || []).join(', ') || 'None');
  const safeProduct = escapeHtml(inquiry.product || 'Not provided');
  const safeSector = escapeHtml(inquiry.sector || 'Not provided');
  const safeQuantity = escapeHtml(inquiry.quantity ?? 1);
  const safeTimeline = escapeHtml(inquiry.timeline || 'Not provided');
  const safeMessage = escapeHtml(inquiry.message).replace(/\n/g, '<br />');

  const textBody = [
    `ZIPI DRONES & CONTROLS // MISSION CONTROL DESK`,
    `New ${typeLabel} Enquiry [${inquiry.ref}]`,
    ``,
    `Reference: ${inquiry.ref}`,
    `Request Type: ${typeLabel}`,
    `Full Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Phone / WhatsApp: ${inquiry.phone}`,
    `Company: ${inquiry.company || 'Not provided'}`,
    `Region / Territory: ${inquiry.region || 'Not provided'}`,
    `Hardware Categories: ${(inquiry.interests || []).join(', ') || 'None'}`,
    `Selected Product: ${inquiry.product || 'Not provided'}`,
    `Sector: ${inquiry.sector || 'Not provided'}`,
    `Quantity: ${inquiry.quantity ?? 1}`,
    `Timeline: ${inquiry.timeline || 'Not provided'}`,
    ``,
    `Message:`,
    `${inquiry.message}`,
  ].join('\n');

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#050b14; color:#f1f5f9; padding:28px; border-radius:12px; max-width:640px; margin:0 auto;">
      <p style="color:#22d3ee; font-size:11px; letter-spacing:2px; text-transform:uppercase; margin:0 0 8px; font-family:monospace;">
        ZIPI DRONES &amp; CONTROLS // MISSION CONTROL DESK
      </p>
      <h2 style="margin:0 0 16px; font-size:22px; color:#f1f5f9;">New Enquiry ${safeRef} (${safeType})</h2>
      <table style="width:100%; border-collapse:collapse; font-size:13px; color:#cbd5e1; margin-bottom:16px;">
        <tbody>
          <tr style="border-bottom:1px solid #1e293b;"><td style="padding:8px 0; color:#94a3b8; width:160px;">Reference</td><td style="padding:8px 0; font-family:monospace; color:#22d3ee; font-weight:bold;">${safeRef}</td></tr>
          <tr style="border-bottom:1px solid #1e293b;"><td style="padding:8px 0; color:#94a3b8;">Request Type</td><td style="padding:8px 0; font-weight:bold; color:#f1f5f9;">${safeType}</td></tr>
          <tr style="border-bottom:1px solid #1e293b;"><td style="padding:8px 0; color:#94a3b8;">Full Name</td><td style="padding:8px 0;">${safeName}</td></tr>
          <tr style="border-bottom:1px solid #1e293b;"><td style="padding:8px 0; color:#94a3b8;">Email</td><td style="padding:8px 0;"><a href="mailto:${safeEmail}" style="color:#22d3ee; text-decoration:none;">${safeEmail}</a></td></tr>
          <tr style="border-bottom:1px solid #1e293b;"><td style="padding:8px 0; color:#94a3b8;">Phone / WhatsApp</td><td style="padding:8px 0;">${safePhone}</td></tr>
          <tr style="border-bottom:1px solid #1e293b;"><td style="padding:8px 0; color:#94a3b8;">Company</td><td style="padding:8px 0;">${safeCompany}</td></tr>
          <tr style="border-bottom:1px solid #1e293b;"><td style="padding:8px 0; color:#94a3b8;">Region / Territory</td><td style="padding:8px 0;">${safeRegion}</td></tr>
          <tr style="border-bottom:1px solid #1e293b;"><td style="padding:8px 0; color:#94a3b8;">Hardware Categories</td><td style="padding:8px 0;">${safeCategories}</td></tr>
          <tr style="border-bottom:1px solid #1e293b;"><td style="padding:8px 0; color:#94a3b8;">Selected Product</td><td style="padding:8px 0;">${safeProduct}</td></tr>
          <tr style="border-bottom:1px solid #1e293b;"><td style="padding:8px 0; color:#94a3b8;">Sector</td><td style="padding:8px 0;">${safeSector}</td></tr>
          <tr style="border-bottom:1px solid #1e293b;"><td style="padding:8px 0; color:#94a3b8;">Quantity</td><td style="padding:8px 0;">${safeQuantity}</td></tr>
          <tr style="border-bottom:1px solid #1e293b;"><td style="padding:8px 0; color:#94a3b8;">Timeline</td><td style="padding:8px 0;">${safeTimeline}</td></tr>
        </tbody>
      </table>
      <div style="margin-top:16px; padding:16px; border:1px solid #1e293b; border-radius:8px; background:#0b1a2c;">
        <p style="margin:0 0 8px; font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#22d3ee; font-family:monospace;">Message Details</p>
        <p style="margin:0; line-height:1.6; color:#f1f5f9; white-space:pre-wrap;">${safeMessage}</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"ZIPI Drones & Controls" <${fromAddress}>`,
      to: supervisorEmail,
      replyTo: inquiry.email,
      subject: `[ZIPI ${inquiry.ref}] New ${typeLabel} enquiry from ${inquiry.name}`,
      text: textBody,
      html: htmlBody,
    });

    if (inquiry?._id) {
      await Inquiry.findByIdAndUpdate(inquiry._id, {
        emailStatus: 'sent',
        emailError: '',
      }).catch(() => {});
    }

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(
      `[mail] Supervisor enquiry email sent for ${inquiry.ref} (messageId: ${info.messageId})${
        previewUrl ? ` | preview: ${previewUrl}` : ''
      }`
    );

    return { sent: true, messageId: info.messageId, previewUrl: previewUrl || null };
  } catch (err) {
    const errCode = err?.code || 'ERROR';
    const errMsg = err?.message || String(err);

    if (inquiry?._id) {
      await Inquiry.findByIdAndUpdate(inquiry._id, {
        emailStatus: 'failed',
        emailError: `[${errCode}] ${errMsg}`.slice(0, 1000),
      }).catch(() => {});
    }

    console.error(`[mail] Supervisor notification failed for ${inquiry.ref}: [${errCode}] ${errMsg}`);
    return { sent: false, error: errMsg, code: errCode };
  }
}

/**
 * Sends a supervisor notification email for a Checkout order.
 * Updates order.emailStatus and order.emailError in MongoDB.
 */
export async function sendOrderSupervisorNotification(order) {
  const transporter = getTransporter();
  const supervisorEmail = process.env.SUPERVISOR_EMAIL?.trim();

  if (!transporter || !supervisorEmail) {
    if (order?._id) {
      await Order.findByIdAndUpdate(order._id, {
        emailStatus: 'skipped',
        emailError: '',
      }).catch(() => {});
    }
    console.log(`[mail] Supervisor order notification skipped for ${order?.ref} (SMTP not configured)`);
    return { sent: false, reason: 'smtp_unconfigured' };
  }

  const fromAddress = process.env.SMTP_USER?.trim() || 'noreply@zipi.aero';

  const safeRef = escapeHtml(order.ref);
  const safeName = escapeHtml(order.name);
  const safeEmail = escapeHtml(order.email);
  const safePhone = escapeHtml(order.phone);
  const safeCompany = escapeHtml(order.company || 'Not provided');
  const safeAddress = escapeHtml(
    `${order.address}, ${order.city}, ${order.state} ${order.postalCode}, ${order.country}`
  );
  const safeNotes = escapeHtml(order.notes || 'None');
  const safeClaimedTotal = escapeHtml(
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.claimedTotal || 0)
  );

  const itemsRowsHtml = (order.items || [])
    .map((item) => {
      const lineTotal = (item.unitPrice || 0) * (item.quantity || 1);
      const formattedUnit = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(item.unitPrice || 0);
      const formattedTotal = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(lineTotal);

      return `
        <tr style="border-bottom:1px solid #1e293b;">
          <td style="padding:8px 6px; font-weight:600; color:#f1f5f9;">
            ${escapeHtml(item.name)}
            ${item.color ? `<br/><span style="font-size:11px; color:#94a3b8;">Finish: ${escapeHtml(item.color)}</span>` : ''}
          </td>
          <td style="padding:8px 6px; text-align:center;">${escapeHtml(item.quantity)}</td>
          <td style="padding:8px 6px; text-align:right;">${escapeHtml(formattedUnit)}</td>
          <td style="padding:8px 6px; text-align:right; font-weight:bold; color:#22d3ee;">${escapeHtml(formattedTotal)}</td>
        </tr>
      `;
    })
    .join('');

  const itemsText = (order.items || [])
    .map(
      (item) =>
        `- ${item.name} (${item.productId}${item.color ? `, ${item.color}` : ''}): Qty ${item.quantity} x $${item.unitPrice} = $${
          item.quantity * item.unitPrice
        }`
    )
    .join('\n');

  const textBody = [
    `ZIPI DRONES & CONTROLS // FLEET ORDER DISPATCH`,
    `New Order [${order.ref}] from ${order.name}`,
    ``,
    `Order Reference: ${order.ref}`,
    `Customer Name: ${order.name}`,
    `Email: ${order.email}`,
    `Phone: ${order.phone}`,
    `Company: ${order.company || 'Not provided'}`,
    `Shipping Address: ${order.address}, ${order.city}, ${order.state} ${order.postalCode}, ${order.country}`,
    `Notes: ${order.notes || 'None'}`,
    ``,
    `Ordered Items:`,
    itemsText,
    ``,
    `Claimed Total: ${safeClaimedTotal}`,
    ``,
    `Notice: Prices come from the customer's browser and are unverified. Supervisor to confirm the final amount.`,
  ].join('\n');

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#050b14; color:#f1f5f9; padding:28px; border-radius:12px; max-width:660px; margin:0 auto;">
      <p style="color:#22d3ee; font-size:11px; letter-spacing:2px; text-transform:uppercase; margin:0 0 8px; font-family:monospace;">
        ZIPI DRONES &amp; CONTROLS // FLEET ORDER DISPATCH
      </p>
      <h2 style="margin:0 0 16px; font-size:22px; color:#f1f5f9;">New Order ${safeRef}</h2>

      <div style="background:#08121f; border:1px solid #1e293b; border-radius:8px; padding:16px; margin-bottom:20px;">
        <h3 style="margin:0 0 10px; font-size:13px; text-transform:uppercase; letter-spacing:1px; color:#22d3ee; font-family:monospace;">Customer &amp; Shipping Depot</h3>
        <table style="width:100%; border-collapse:collapse; font-size:13px; color:#cbd5e1;">
          <tbody>
            <tr><td style="padding:4px 0; color:#94a3b8; width:140px;">Name</td><td style="padding:4px 0; font-weight:bold; color:#f1f5f9;">${safeName}</td></tr>
            <tr><td style="padding:4px 0; color:#94a3b8;">Email</td><td style="padding:4px 0;"><a href="mailto:${safeEmail}" style="color:#22d3ee; text-decoration:none;">${safeEmail}</a></td></tr>
            <tr><td style="padding:4px 0; color:#94a3b8;">Phone</td><td style="padding:4px 0;">${safePhone}</td></tr>
            <tr><td style="padding:4px 0; color:#94a3b8;">Company</td><td style="padding:4px 0;">${safeCompany}</td></tr>
            <tr><td style="padding:4px 0; color:#94a3b8;">Shipping Address</td><td style="padding:4px 0;">${safeAddress}</td></tr>
            <tr><td style="padding:4px 0; color:#94a3b8;">Notes</td><td style="padding:4px 0;">${safeNotes}</td></tr>
          </tbody>
        </table>
      </div>

      <div style="background:#0b1a2c; border:1px solid #1e293b; border-radius:8px; padding:16px; margin-bottom:20px;">
        <h3 style="margin:0 0 12px; font-size:13px; text-transform:uppercase; letter-spacing:1px; color:#22d3ee; font-family:monospace;">Order Manifest</h3>
        <table style="width:100%; border-collapse:collapse; font-size:13px; color:#cbd5e1;">
          <thead>
            <tr style="border-bottom:1px solid #334155; text-align:left; font-size:11px; text-transform:uppercase; color:#94a3b8;">
              <th style="padding:6px;">Product</th>
              <th style="padding:6px; text-align:center;">Qty</th>
              <th style="padding:6px; text-align:right;">Unit Price</th>
              <th style="padding:6px; text-align:right;">Line Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRowsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding:12px 6px 4px; text-align:right; font-weight:bold; color:#f1f5f9;">Claimed Total:</td>
              <td style="padding:12px 6px 4px; text-align:right; font-size:16px; font-weight:bold; color:#22d3ee; font-family:monospace;">${safeClaimedTotal}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="padding:12px 16px; border:1px dashed #fbbf24; border-radius:8px; background:rgba(251,191,36,0.08); color:#fde68a; font-size:12px; line-height:1.5;">
        <strong>Notice:</strong> Prices come from the customer&#39;s browser and are unverified. Supervisor to confirm the final amount.
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"ZIPI Drones & Controls" <${fromAddress}>`,
      to: supervisorEmail,
      replyTo: order.email,
      subject: `[ZIPI ${order.ref}] New order from ${order.name}`,
      text: textBody,
      html: htmlBody,
    });

    if (order?._id) {
      await Order.findByIdAndUpdate(order._id, {
        emailStatus: 'sent',
        emailError: '',
      }).catch(() => {});
    }

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(
      `[mail] Supervisor order email sent for ${order.ref} (messageId: ${info.messageId})${
        previewUrl ? ` | preview: ${previewUrl}` : ''
      }`
    );

    return { sent: true, messageId: info.messageId, previewUrl: previewUrl || null };
  } catch (err) {
    const errCode = err?.code || 'ERROR';
    const errMsg = err?.message || String(err);

    if (order?._id) {
      await Order.findByIdAndUpdate(order._id, {
        emailStatus: 'failed',
        emailError: `[${errCode}] ${errMsg}`.slice(0, 1000),
      }).catch(() => {});
    }

    console.error(`[mail] Supervisor order notification failed for ${order.ref}: [${errCode}] ${errMsg}`);
    return { sent: false, error: errMsg, code: errCode };
  }
}

/**
 * Optionally sends a receipt email to the customer when SEND_CUSTOMER_CONFIRMATION=true.
 */
export async function sendCustomerConfirmation(inquiry) {
  const enabled = String(process.env.SEND_CUSTOMER_CONFIRMATION || '').toLowerCase() === 'true';
  if (!enabled) {
    return { sent: false, reason: 'disabled' };
  }

  const transporter = getTransporter();
  if (!transporter || !inquiry?.email) {
    return { sent: false, reason: 'smtp_unconfigured' };
  }

  const safeRef = escapeHtml(inquiry.ref);
  const safeName = escapeHtml(inquiry.name);
  const safeType = escapeHtml(TYPE_LABELS[inquiry.type] || inquiry.type);
  const fromAddress = process.env.SMTP_USER?.trim() || 'noreply@zipi.aero';

  try {
    const info = await transporter.sendMail({
      from: `"ZIPI Drones & Controls" <${fromAddress}>`,
      to: inquiry.email,
      subject: `We received your enquiry, reference ${inquiry.ref}`,
      text: `Hello ${inquiry.name},\n\nWe received your enquiry (${TYPE_LABELS[inquiry.type] || inquiry.type}), reference ${inquiry.ref}.\n\nA ZIPI Drones & Controls supervisor has been assigned and will respond shortly.`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#050b14; color:#f1f5f9; padding:24px; border-radius:12px;">
          <p style="color:#22d3ee; font-size:11px; letter-spacing:2px; text-transform:uppercase; margin:0 0 8px; font-family:monospace;">
            ZIPI DRONES &amp; CONTROLS // RECEIPT CONFIRMATION
          </p>
          <h2 style="margin:0 0 12px; font-size:18px;">Hello ${safeName},</h2>
          <p style="margin:0 0 12px; color:#cbd5e1; line-height:1.6;">
            We received your enquiry (${safeType}), reference <strong style="color:#22d3ee; font-family:monospace;">${safeRef}</strong>.
          </p>
          <p style="margin:0; color:#94a3b8; font-size:13px;">
            A ZIPI Drones &amp; Controls supervisor has been assigned and our team will respond shortly.
          </p>
        </div>
      `,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(
      `[mail] Customer confirmation sent for ${inquiry.ref} (messageId: ${info.messageId})${
        previewUrl ? ` | preview: ${previewUrl}` : ''
      }`
    );

    return { sent: true, messageId: info.messageId, previewUrl: previewUrl || null };
  } catch (err) {
    console.error(`[mail] Customer confirmation failed for ${inquiry.ref}: ${err?.message || err}`);
    return { sent: false, error: err?.message || String(err) };
  }
}
