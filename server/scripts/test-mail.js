import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function runTestMail() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const supervisor = process.env.SUPERVISOR_EMAIL?.trim();

  console.log('--- ZIPI Drones & Controls SMTP Configuration Test ---');
  console.log(`Target SMTP Host : ${host || '(not set)'}`);
  console.log(`Target SMTP Port : ${port}`);
  console.log(`SMTP User        : ${user || '(not set)'}`);
  console.log(`Supervisor Email : ${supervisor || '(not set)'}`);

  if (!host || !user || !pass || !supervisor) {
    console.error('\n[error] Incomplete SMTP configuration in server/.env.');
    console.error('Please configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SUPERVISOR_EMAIL.');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  console.log('\nVerifying SMTP connection credentials...');
  try {
    await transporter.verify();
    console.log('[success] SMTP connection and authentication verified successfully.');
  } catch (err) {
    console.error('\n[error] SMTP verification failed:');
    console.error(`Code   : ${err?.code || 'UNKNOWN'}`);
    console.error(`Message: ${err?.message || err}`);
    process.exit(1);
  }

  console.log(`\nDispatching test email to ${supervisor}...`);
  try {
    const timestamp = new Date().toISOString();
    const info = await transporter.sendMail({
      from: `"ZIPI Drones & Controls" <${user}>`,
      to: supervisor,
      subject: `[ZIPI Test] SMTP Configuration Test - ${timestamp}`,
      text: [
        `ZIPI DRONES & CONTROLS // SMTP VERIFICATION TEST`,
        `This is an automated test verifying the Nodemailer SMTP connection on localhost.`,
        ``,
        `Timestamp   : ${timestamp}`,
        `SMTP Host   : ${host}`,
        `SMTP Port   : ${port}`,
        `User        : ${user}`,
        `Supervisor  : ${supervisor}`,
        ``,
        `If you received this message, supervisor notifications for enquiries and checkout orders are properly configured.`,
      ].join('\n'),
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#050b14; color:#f1f5f9; padding:28px; border-radius:12px; max-width:600px; margin:0 auto;">
          <p style="color:#22d3ee; font-size:11px; letter-spacing:2px; text-transform:uppercase; margin:0 0 8px; font-family:monospace;">
            ZIPI DRONES &amp; CONTROLS // SMTP VERIFICATION TEST
          </p>
          <h2 style="margin:0 0 12px; font-size:20px; color:#f1f5f9;">SMTP Test Dispatch Succeeded</h2>
          <p style="margin:0 0 16px; color:#cbd5e1; font-size:14px; line-height:1.6;">
            This email confirms that your Gmail or custom SMTP transporter is authenticated and ready to receive sales enquiries and customer orders.
          </p>
          <table style="width:100%; border-collapse:collapse; font-size:13px; color:#cbd5e1; background:#0b1a2c; border:1px solid #1e293b; border-radius:8px; padding:12px;">
            <tbody>
              <tr><td style="padding:6px 12px; color:#94a3b8;">Timestamp</td><td style="padding:6px 12px; font-family:monospace; color:#22d3ee;">${timestamp}</td></tr>
              <tr><td style="padding:6px 12px; color:#94a3b8;">Host</td><td style="padding:6px 12px;">${host}:${port}</td></tr>
              <tr><td style="padding:6px 12px; color:#94a3b8;">Authenticated As</td><td style="padding:6px 12px;">${user}</td></tr>
              <tr><td style="padding:6px 12px; color:#94a3b8;">Supervisor Recipient</td><td style="padding:6px 12px;">${supervisor}</td></tr>
            </tbody>
          </table>
        </div>
      `,
    });

    console.log(`[success] Test email delivered. Message ID: ${info.messageId}`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[preview] Preview URL: ${previewUrl}`);
    }
    process.exit(0);
  } catch (err) {
    console.error('\n[error] Failed to send test email:');
    console.error(`Code   : ${err?.code || 'UNKNOWN'}`);
    console.error(`Message: ${err?.message || err}`);
    process.exit(1);
  }
}

runTestMail();

