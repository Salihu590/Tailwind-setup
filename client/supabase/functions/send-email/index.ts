import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const ALLOWED_ORIGINS = [
  'https://manweofficial.com.ng',
  'https://www.manweofficial.com.ng',
  'http://localhost:5173',
  'http://localhost:5174',
]

function getCorsHeaders(origin: string | null) {
  const allowed =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   ADMIN VERIFICATION — Supabase Auth based
   Verifies the caller has a valid Supabase session and role: 'admin'
   ═══════════════════════════════════════════════════════════════════════════ */

async function verifyAdminToken(req: Request): Promise<boolean> {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return false

    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) return false

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
      return false
    }

    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: supabaseAnonKey,
      },
    })

    if (!res.ok) return false

    const user = await res.json()
    return user?.user_metadata?.role === 'admin'
  } catch (err) {
    console.error('verifyAdminToken error:', err)
    return false
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   MANWE EMAIL DESIGN SYSTEM
   Warm bone bg + charcoal text + Nigerian green + Ivorian orange
   ═══════════════════════════════════════════════════════════════════════════ */

const COLORS = {
  bone: '#F4EFE6',
  cream: '#FDFAF3',
  charcoal: '#1A1A18',
  textSoft: '#6B6558',
  textMuted: '#8B8577',
  border: '#D9D2C4',
  green: '#2D5A2E',
  orange: '#D4651F',
}

const emailStyles = `
  <style>
    body {
      margin: 0;
      padding: 0;
      background: ${COLORS.bone};
      font-family: Georgia, 'Times New Roman', serif;
      color: ${COLORS.charcoal};
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      background: ${COLORS.bone};
      padding: 32px 16px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: ${COLORS.cream};
      border: 1px solid ${COLORS.border};
      position: relative;
    }
    .flag-strip {
      height: 3px;
      display: flex;
      width: 100%;
    }
    .flag-strip .side { flex: 1; display: flex; }
    .flag-strip .cell { flex: 1; }

    .header {
      text-align: center;
      padding: 40px 24px 24px;
      border-bottom: 1px solid ${COLORS.border};
    }
    .header .brand {
      font-family: 'Arial Black', 'Helvetica', sans-serif;
      font-size: 34px;
      font-weight: 900;
      letter-spacing: 6px;
      background: linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.charcoal} 50%, ${COLORS.orange} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      color: ${COLORS.charcoal};
      margin: 12px 0 6px;
    }
    .header .tagline {
      font-family: 'Arial', sans-serif;
      font-size: 10px;
      letter-spacing: 4px;
      color: ${COLORS.green};
      text-transform: uppercase;
      margin: 0;
    }
    .header .label {
      font-family: 'Arial', sans-serif;
      font-size: 9px;
      letter-spacing: 4px;
      color: ${COLORS.textMuted};
      text-transform: uppercase;
      margin-top: 20px;
    }

    .content { padding: 32px 28px; }
    .content h1 {
      font-family: 'Arial Black', 'Helvetica', sans-serif;
      font-size: 28px;
      letter-spacing: 2px;
      color: ${COLORS.charcoal};
      text-transform: uppercase;
      margin: 0 0 20px;
      line-height: 1.1;
    }
    .content h2 {
      font-family: 'Arial', sans-serif;
      font-size: 11px;
      letter-spacing: 4px;
      color: ${COLORS.green};
      text-transform: uppercase;
      margin: 24px 0 12px;
    }
    .content p {
      font-family: Georgia, serif;
      font-size: 15px;
      color: ${COLORS.textSoft};
      margin: 0 0 14px;
    }
    .content strong {
      color: ${COLORS.charcoal};
      font-family: 'Arial', sans-serif;
      font-size: 12px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .divider {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 20px 0;
    }
    .divider .line {
      flex: 1;
      height: 1px;
      background: ${COLORS.border};
    }
    .divider .diamond {
      width: 6px;
      height: 6px;
      background: ${COLORS.orange};
      transform: rotate(45deg);
    }

    .info-block {
      background: ${COLORS.bone};
      border-left: 3px solid ${COLORS.green};
      padding: 14px 16px;
      margin: 16px 0;
    }
    .info-block strong { display: block; margin-bottom: 4px; }

    .items-list {
      list-style: none;
      padding: 0;
      margin: 16px 0;
    }
    .items-list li {
      padding: 14px 0;
      border-bottom: 1px solid ${COLORS.border};
      font-family: Georgia, serif;
      font-size: 14px;
      color: ${COLORS.charcoal};
    }
    .items-list li:last-child { border-bottom: none; }
    .items-list li strong {
      display: block;
      margin-bottom: 4px;
      color: ${COLORS.charcoal};
    }
    .items-list li .meta {
      font-family: 'Arial', sans-serif;
      font-size: 10px;
      letter-spacing: 2px;
      color: ${COLORS.textMuted};
      text-transform: uppercase;
    }

    .total-box {
      background: ${COLORS.charcoal};
      color: ${COLORS.cream};
      padding: 20px;
      margin: 24px 0;
      text-align: center;
    }
    .total-box .label {
      font-family: 'Arial', sans-serif;
      font-size: 10px;
      letter-spacing: 4px;
      color: ${COLORS.orange};
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .total-box .amount {
      font-family: 'Arial Black', sans-serif;
      font-size: 26px;
      letter-spacing: 2px;
      color: ${COLORS.cream};
    }

    .cta-button {
      display: inline-block;
      padding: 14px 32px;
      background: ${COLORS.charcoal};
      color: ${COLORS.cream} !important;
      text-decoration: none;
      font-family: 'Arial Black', sans-serif;
      font-size: 12px;
      letter-spacing: 4px;
      text-transform: uppercase;
      margin-top: 16px;
    }

    .footer {
      padding: 28px 24px;
      text-align: center;
      border-top: 1px solid ${COLORS.border};
      background: ${COLORS.bone};
    }
    .footer .brand-mini {
      font-family: 'Arial Black', sans-serif;
      font-size: 16px;
      letter-spacing: 4px;
      color: ${COLORS.charcoal};
      margin-bottom: 4px;
    }
    .footer p {
      font-family: 'Arial', sans-serif;
      font-size: 10px;
      letter-spacing: 3px;
      color: ${COLORS.textMuted};
      text-transform: uppercase;
      margin: 4px 0;
    }
    .footer a {
      color: ${COLORS.green};
      text-decoration: none;
    }

    .diamonds-row {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin: 12px 0;
    }
    .diamonds-row span {
      width: 8px;
      height: 8px;
      transform: rotate(45deg);
      display: inline-block;
    }
  </style>
`

/* ── MANWE Beast Emblem SVG (inline for email) ────────────────────────────── */

const beastEmblemSvg = `
<svg width="56" height="56" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:0 auto;">
  <path d="M10 45 L5 25 L15 10 L25 5 L30 15 L25 30 L30 40" stroke="${COLORS.green}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M70 45 L75 25 L65 10 L55 5 L50 15 L55 30 L50 40" stroke="${COLORS.orange}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M30 40 L35 55 L40 35 L45 55 L50 40" stroke="${COLORS.charcoal}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M40 18 L48 30 L40 42 L32 30 Z" stroke="${COLORS.charcoal}" stroke-width="1.5" fill="none"/>
  <circle cx="36" cy="28" r="1.5" fill="${COLORS.green}"/>
  <circle cx="44" cy="28" r="1.5" fill="${COLORS.orange}"/>
  <path d="M37 18 L40 8 L43 18" stroke="${COLORS.charcoal}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <line x1="40" y1="55" x2="40" y2="70" stroke="${COLORS.charcoal}" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M40 70 L43 74 L40 78 L37 74 Z" fill="${COLORS.charcoal}" opacity="0.7"/>
</svg>
`

const flagStripHtml = `
<div class="flag-strip">
  <div class="side">
    <div class="cell" style="background:${COLORS.green};"></div>
    <div class="cell" style="background:${COLORS.cream};"></div>
    <div class="cell" style="background:${COLORS.green};"></div>
  </div>
  <div style="width:2px;background:${COLORS.cream};"></div>
  <div class="side">
    <div class="cell" style="background:${COLORS.orange};"></div>
    <div class="cell" style="background:${COLORS.cream};"></div>
    <div class="cell" style="background:${COLORS.green};"></div>
  </div>
</div>
`

const diamondsRowHtml = `
<div class="diamonds-row">
  <span style="background:${COLORS.green};"></span>
  <span style="background:${COLORS.cream};border:1px solid ${COLORS.charcoal};"></span>
  <span style="background:${COLORS.orange};"></span>
</div>
`

const dividerHtml = `
<div class="divider">
  <div class="line"></div>
  <div class="diamond"></div>
  <div class="line"></div>
</div>
`

/* ── Shared shell wrapping all emails ─────────────────────────────────────── */

const emailShell = (label: string, contentHtml: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  ${emailStyles}
</head>
<body>
  <div class="wrapper">
    <div class="container">
      ${flagStripHtml}

      <div class="header">
        ${beastEmblemSvg}
        <div class="brand">MANWE</div>
        <p class="tagline">— West African Futurism —</p>
        <p class="label">◆ ${label} ◆</p>
      </div>

      <div class="content">
        ${contentHtml}
      </div>

      <div class="footer">
        ${diamondsRowHtml}
        <div class="brand-mini">MANWE</div>
        <p>Abuja — Lagos — Abidjan</p>
        <p>NGR × CIV</p>
        <p><a href="https://manweofficial.com.ng">manweofficial.com.ng</a></p>
      </div>

      ${flagStripHtml}
    </div>
  </div>
</body>
</html>
`

/* ═══════════════════════════════════════════════════════════════════════════
   EMAIL TEMPLATES
   ═══════════════════════════════════════════════════════════════════════════ */

const generateConfirmationEmail = (order: any) => {
  const itemDetails = order.cart_items
    .map(
      (item: any) => `
      <li>
        <strong>${item.name.toUpperCase()}</strong>
        <div class="meta">
          Size ${item.size || 'N/A'} · Qty ${item.quantity} · ₦${(item.price * item.quantity).toLocaleString()}
        </div>
      </li>`
    )
    .join('')

  const content = `
    <h1>Welcome to the tribe</h1>
    <p>Hi ${order.checkout_data.firstName},</p>
    <p>Your MANWE order has been confirmed. Every piece is now being prepared for you with the same care that built the collection.</p>

    ${dividerHtml}

    <h2>Order Details</h2>
    <div class="info-block">
      <strong>Order ID</strong>
      ${order.order_id}
    </div>

    <h2>Your Pieces</h2>
    <ul class="items-list">${itemDetails}</ul>

    <div class="total-box">
      <div class="label">Total Paid</div>
      <div class="amount">₦${order.total.toLocaleString()}</div>
    </div>

    <h2>Shipping To</h2>
    <div class="info-block" style="border-left-color:${COLORS.orange};">
      <strong>${order.checkout_data.firstName} ${order.checkout_data.lastName}</strong>
      ${order.checkout_data.address}, ${order.checkout_data.city}, ${order.checkout_data.state}<br/>
      ${order.checkout_data.phone}
    </div>

    <p style="margin-top:24px;">You'll get another email the moment your pieces are on the way.</p>

    <div style="text-align:center;">
      <a href="https://manweofficial.com.ng/shop" class="cta-button">Continue Shopping →</a>
    </div>
  `
  return emailShell('ORDER CONFIRMED', content)
}

const generateShippedEmail = (order: any) => {
  const content = `
    <h1>Your pieces are moving</h1>
    <p>Hi ${order.checkout_data.firstName},</p>
    <p>Order <strong>#${order.order_id}</strong> has left the studio and is now on its way to you.</p>

    ${dividerHtml}

    <h2>Estimated Arrival</h2>
    <div class="info-block">
      <strong>3 — 7 Business Days</strong>
      Delivery windows may vary based on location.
    </div>

    <h2>Shipping To</h2>
    <div class="info-block" style="border-left-color:${COLORS.orange};">
      <strong>${order.checkout_data.firstName} ${order.checkout_data.lastName}</strong>
      ${order.checkout_data.address}, ${order.checkout_data.city}, ${order.checkout_data.state}
    </div>

    <p style="margin-top:24px;">We'll let you know the moment your pieces arrive.</p>
  `
  return emailShell('ORDER SHIPPED', content)
}

const generateDeliveredEmail = (order: any) => {
  const content = `
    <h1>Your pieces have arrived</h1>
    <p>Hi ${order.checkout_data.firstName},</p>
    <p>Order <strong>#${order.order_id}</strong> has been delivered. Welcome to the tribe — we hope you feel the roots in every stitch.</p>

    ${dividerHtml}

    <p>Tag us <strong>@${Deno.env.get('INSTAGRAM_USERNAME') || 'mw.civ'}</strong> when you wear your pieces — we'd love to see them out in the world.</p>

    <div style="text-align:center;">
      <a href="https://manweofficial.com.ng/shop" class="cta-button">Shop Again →</a>
    </div>
  `
  return emailShell('ORDER DELIVERED', content)
}

const generateAdminNotification = (order: any) => {
  const itemDetails = order.cart_items
    .map(
      (item: any) => `
      <li>
        <strong>${item.name.toUpperCase()}</strong>
        <div class="meta">Qty ${item.quantity} — ₦${(item.price * item.quantity).toLocaleString()}</div>
      </li>`
    )
    .join('')

  const content = `
    <h1>New order received</h1>

    <div class="info-block">
      <strong>Order ID</strong>
      ${order.order_id}
    </div>

    ${dividerHtml}

    <h2>Customer</h2>
    <p>
      <strong style="display:block;font-size:14px;letter-spacing:1px;">${order.checkout_data.firstName} ${order.checkout_data.lastName}</strong>
      ${order.checkout_data.email}<br/>
      ${order.checkout_data.phone}
    </p>

    <h2>Delivery Address</h2>
    <div class="info-block" style="border-left-color:${COLORS.orange};">
      ${order.checkout_data.address}, ${order.checkout_data.city}, ${order.checkout_data.state}
    </div>

    <h2>Pieces Ordered</h2>
    <ul class="items-list">${itemDetails}</ul>

    <div class="total-box">
      <div class="label">Total</div>
      <div class="amount">₦${order.total.toLocaleString()}</div>
    </div>

    ${
      order.special_instructions
        ? `
      <h2>Special Instructions</h2>
      <div class="info-block" style="border-left-color:${COLORS.orange};font-style:italic;">
        ${order.special_instructions}
      </div>
    `
        : ''
    }
  `
  return emailShell('NEW ORDER — ADMIN', content)
}

const generateNewsletterEmail = (subject: string, content: string) => {
  const body = `
    <h1>${subject}</h1>
    ${dividerHtml}
    <div style="font-family:Georgia,serif;font-size:15px;color:${COLORS.textSoft};line-height:1.7;">
      ${content}
    </div>

    <div style="text-align:center;margin-top:32px;">
      <a href="https://manweofficial.com.ng/shop" class="cta-button">Explore the Collection →</a>
    </div>
  `
  return emailShell('FROM THE TRIBE', body)
}

const generateContactEmail = (contact: any) => {
  const content = `
    <h1>New message from the tribe</h1>

    <h2>From</h2>
    <div class="info-block">
      <strong style="display:block;font-size:14px;letter-spacing:1px;">${contact.name}</strong>
      <a href="mailto:${contact.email}" style="color:${COLORS.green};text-decoration:none;">${contact.email}</a>
    </div>

    <h2>Subject</h2>
    <div class="info-block" style="border-left-color:${COLORS.orange};">
      ${contact.subject}
    </div>

    ${dividerHtml}

    <h2>Message</h2>
    <div style="font-family:Georgia,serif;font-size:15px;color:${COLORS.charcoal};line-height:1.7;background:${COLORS.bone};padding:16px;border-left:3px solid ${COLORS.charcoal};white-space:pre-wrap;">
${contact.message}
    </div>

    <div style="text-align:center;margin-top:24px;">
      <a href="mailto:${contact.email}?subject=Re: ${contact.subject}" class="cta-button">Reply →</a>
    </div>
  `
  return emailShell('CONTACT MESSAGE', content)
}

/* ═══════════════════════════════════════════════════════════════════════════
   HANDLER
   ═══════════════════════════════════════════════════════════════════════════ */

const ADMIN_ONLY_TYPES = ['newsletter', 'shipped', 'delivered']

serve(async (req) => {
  const origin = req.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, order, subject, content, recipients, contact } =
      await req.json()

    if (ADMIN_ONLY_TYPES.includes(type)) {
      const isAdmin = await verifyAdminToken(req)
      if (!isAdmin) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
    const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL')!
    const FROM_EMAIL =
      Deno.env.get('FROM_EMAIL') || 'MANWE <onboarding@resend.dev>'

    let emailPayload: any = null

    switch (type) {
      case 'confirmation':
        emailPayload = {
          from: FROM_EMAIL,
          to: [order.checkout_data.email],
          subject: `MANWE — Order Confirmed · #${order.order_id}`,
          html: generateConfirmationEmail(order),
        }
        break

      case 'admin-notification':
        emailPayload = {
          from: FROM_EMAIL,
          to: [ADMIN_EMAIL],
          subject: `New Order · #${order.order_id}`,
          html: generateAdminNotification(order),
        }
        break

      case 'shipped':
        emailPayload = {
          from: FROM_EMAIL,
          to: [order.checkout_data.email],
          subject: `MANWE — Your Order #${order.order_id} Has Shipped`,
          html: generateShippedEmail(order),
        }
        break

      case 'delivered':
        emailPayload = {
          from: FROM_EMAIL,
          to: [order.checkout_data.email],
          subject: `MANWE — Your Order #${order.order_id} Has Arrived`,
          html: generateDeliveredEmail(order),
        }
        break

      case 'newsletter':
        emailPayload = {
          from: FROM_EMAIL,
          to: recipients,
          subject: subject,
          html: generateNewsletterEmail(subject, content),
        }
        break

      case 'contact':
        if (!contact || !contact.email || !contact.name || !contact.message) {
          return new Response(
            JSON.stringify({ error: 'Missing contact info' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          )
        }
        emailPayload = {
          from: FROM_EMAIL,
          to: [ADMIN_EMAIL],
          reply_to: contact.email,
          subject: `Contact · ${contact.subject || 'New message'}`,
          html: generateContactEmail(contact),
        }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown email type' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Resend error:', data)
      throw new Error(data.message || 'Failed to send email')
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Email function error:', err)
    return new Response(
      JSON.stringify({
        error: 'Failed to send email',
        details: String(err?.message || err),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})