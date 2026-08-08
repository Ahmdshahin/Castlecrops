import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '../../../services/supabaseAdmin';
import nodemailer from 'nodemailer';

// Simple memory-based rate limiter: map of IP -> { count, timestamp }
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // 5 requests per hour

function escapeHtml(unsafe: string) {
  return (unsafe || '')
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const now = Date.now();
  const rateData = rateLimitMap.get(ip) || { count: 0, timestamp: now };

  if (now - rateData.timestamp > RATE_LIMIT_WINDOW) {
    rateData.count = 1;
    rateData.timestamp = now;
  } else {
    rateData.count++;
  }
  rateLimitMap.set(ip, rateData);

  if (rateData.count > RATE_LIMIT_MAX) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.phone || !data.product) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Verify Turnstile Token if secret key is present
    if (process.env.TURNSTILE_SECRET_KEY) {
      if (!data.turnstileToken) {
        return NextResponse.json(
          { error: 'Security check missing. Please complete the CAPTCHA.' },
          { status: 400 }
        );
      }

      const verifyEndpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
      const verifyResponse = await fetch(verifyEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${encodeURIComponent(process.env.TURNSTILE_SECRET_KEY)}&response=${encodeURIComponent(data.turnstileToken)}&remoteip=${encodeURIComponent(ip)}`,
      });

      const verifyData = await verifyResponse.json();
      if (!verifyData.success) {
        console.error('Turnstile verification failed:', verifyData);
        return NextResponse.json(
          { error: 'Security check failed. Please try again.' },
          { status: 400 }
        );
      }
    }
    
    // Insert into Supabase rfq_submissions table
    const { error: dbError } = await supabase
      .from('rfq_submissions')
      .insert([
        {
          name: data.name,
          company: data.company || null,
          phone: data.phone,
          email: data.email || null,
          product: data.product,
          quantity: data.quantity || null,
          message: data.message || null,
          locale: 'en', // We could pass the actual locale from the client
        }
      ]);

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      return NextResponse.json(
        { error: 'Failed to submit request' },
        { status: 500 }
      );
    }
    
    const { data: settingsData } = await supabase.from('site_settings').select('*');
    const settings = settingsData?.reduce((acc: Record<string, string>, curr: { id: string, value: string }) => {
      acc[curr.id] = curr.value;
      return acc;
    }, {}) || {};

    const contactEmailStr = settings['rfq_receive_email'] || settings['contact_email'] || 'sales@castlecrops.com';
    // Split by newline or comma
    const toEmails = contactEmailStr.split(/[\n,]+/).map((e: string) => e.trim()).filter(Boolean);
    const primaryTo = toEmails.length > 0 ? toEmails.join(', ') : 'sales@castlecrops.com';

    const smtpHost = settings['smtp_host'] || process.env.SMTP_HOST;
    const smtpPort = settings['smtp_port'] || process.env.SMTP_PORT || '587';
    const smtpUser = settings['smtp_user'] || process.env.SMTP_USER;
    const smtpPass = settings['smtp_pass'] || process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort, 10),
        secure: smtpPort === '465',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New RFQ Request</title>
          <style>
            /* Reset and Base */
            body {
              margin: 0; padding: 0;
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              background-color: #f9f8f6;
              color: #1a1a1a;
              -webkit-font-smoothing: antialiased;
            }
            table { border-spacing: 0; border-collapse: collapse; width: 100%; }
            td { padding: 0; }
            
            /* Layout */
            .wrapper { width: 100%; background-color: #f9f8f6; padding: 40px 0; }
            .main { width: 100%; max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; border: 1px solid #e2ddd3; box-shadow: 0 10px 30px rgba(0,0,0,0.05); overflow: hidden; }
            
            /* Header */
            .header { background-color: #ffffff; padding: 35px 40px; text-align: center; border-bottom: 2px solid #C4A47C; }
            .header-logo { font-size: 26px; font-weight: 300; color: #1a1a1a; letter-spacing: 4px; text-transform: uppercase; margin: 0; }
            .header-logo span { color: #C4A47C; font-weight: 600; }
            
            /* Body */
            .content { padding: 40px; }
            .title { font-size: 20px; color: #1a1a1a; margin: 0 0 30px 0; font-weight: 400; border-bottom: 1px solid #f0ebe1; padding-bottom: 15px; }
            
            .data-table { width: 100%; }
            .data-row { border-bottom: 1px solid #f9f8f6; }
            .data-row:last-child { border-bottom: none; }
            .data-label { padding: 16px 0; width: 35%; color: #666666; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; vertical-align: top; font-weight: 600; }
            .data-value { padding: 16px 0; width: 65%; color: #1a1a1a; font-size: 15px; vertical-align: top; font-weight: 500; }
            
            .highlight { color: #C4A47C; font-size: 17px; font-weight: 600; }
            .message-box { background-color: #f9f8f6; border-left: 3px solid #C4A47C; padding: 20px; font-size: 14px; color: #444444; line-height: 1.6; margin-top: 10px; font-style: italic; border-radius: 2px; }
            
            /* Footer */
            .footer { background-color: #f9f8f6; padding: 25px 40px; text-align: center; border-top: 1px solid #e2ddd3; }
            .footer p { margin: 0; color: #888888; font-size: 12px; letter-spacing: 0.5px; }
            
            /* Responsive */
            @media only screen and (max-width: 600px) {
              .wrapper { padding: 15px 10px; }
              .content { padding: 25px; }
              .header { padding: 25px 20px; }
              .data-label, .data-value { display: block; width: 100%; }
              .data-label { padding: 15px 0 5px 0; border-bottom: none; }
              .data-value { padding: 0 0 15px 0; }
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <table class="main" align="center">
              <!-- Header -->
              <tr>
                <td class="header">
                  <h1 class="header-logo">CASTLE <span>CROPS</span></h1>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td class="content">
                  <h2 class="title">New Quote Request</h2>
                  
                  <table class="data-table">
                    <tr class="data-row">
                      <td class="data-label">Product of Interest</td>
                      <td class="data-value highlight">${escapeHtml(data.product)}</td>
                    </tr>
                    <tr class="data-row">
                      <td class="data-label">Client Name</td>
                      <td class="data-value">${escapeHtml(data.name)}</td>
                    </tr>
                    <tr class="data-row">
                      <td class="data-label">Company</td>
                      <td class="data-value">${escapeHtml(data.company || 'Not Provided')}</td>
                    </tr>
                    <tr class="data-row">
                      <td class="data-label">Contact Phone</td>
                      <td class="data-value"><a href="tel:${escapeHtml(data.phone)}" style="color:#C4A47C; text-decoration:none;">${escapeHtml(data.phone)}</a></td>
                    </tr>
                    <tr class="data-row">
                      <td class="data-label">Email Address</td>
                      <td class="data-value"><a href="mailto:${escapeHtml(data.email || '')}" style="color:#C4A47C; text-decoration:none;">${escapeHtml(data.email || 'Not Provided')}</a></td>
                    </tr>
                    <tr class="data-row">
                      <td class="data-label">Target Quantity</td>
                      <td class="data-value">${escapeHtml(data.quantity || 'Not Provided')}</td>
                    </tr>
                    ${data.message ? `
                    <tr class="data-row">
                      <td class="data-label">Client Message</td>
                      <td class="data-value">
                        <div class="message-box">
                          ${escapeHtml(data.message).replace(/\n/g, '<br/>')}
                        </div>
                      </td>
                    </tr>
                    ` : ''}
                  </table>
                  
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td class="footer">
                  <p>&copy; ${new Date().getFullYear()} Castle Crops. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: `"Castle Crops Website" <${smtpUser}>`,
        replyTo: data.email || undefined,
        to: primaryTo,
        subject: `New Request For Quote: ${data.product}`,
        html: htmlTemplate,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Error sending RFQ email:', emailError);
      }
    } else {
      console.log('Skipping email notification: SMTP credentials not set.');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('RFQ API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
