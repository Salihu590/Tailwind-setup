const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const emailStyles = `
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .item { margin-bottom: 15px; display: flex; align-items: center; }
    .item img { width: 60px; height: 60px; object-fit: cover; margin-right: 15px; border-radius: 5px; }
    .button { background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
    .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #666; }
    h1 { color: #007bff; }
    h2 { color: #333; margin-top: 20px; }
    ul { list-style: none; padding: 0; }
    li { margin-bottom: 10px; }
  </style>
`;

const generateConfirmationEmailContent = (order) => {
  const itemDetails = order.cartItems
    .map(
      (item) => `
      <li class="item">
        ${item.image ? `<img src="${item.image}" alt="${item.name || "Item"}" />` : ""}
        <div>
          <strong>${item.name || "Unknown Item"}</strong> (x${item.quantity || 1})<br>
          <small>Size: ${item.size || "N/A"}</small><br>
          <small>Price: ₦${(item.price || 0).toFixed(2)}</small>
        </div>
      </li>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      ${emailStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Your Order!</h1>
        </div>
        <div class="content">
          <p>Hi ${order.checkoutData?.firstName || "Customer"},</p>
          <p>We're thrilled to confirm your order with Manwe! Your items are being prepared and will be shipped soon. You'll receive another email once your order is on its way.</p>
          
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> ${order.orderId || "N/A"}</p>
          <p><strong>Total Amount:</strong> ₦${(order.total || 0).toFixed(2)}</p>
          <ul>${itemDetails}</ul>

          <h2>Shipping Information</h2>
          <p><strong>Name:</strong> ${order.checkoutData?.firstName || ""} ${order.checkoutData?.lastName || ""}</p>
          <p><strong>Address:</strong> ${order.checkoutData?.address || ""}, ${order.checkoutData?.city || ""}, ${order.checkoutData?.state || ""}, ${order.checkoutData?.country || ""}</p>
          <p><strong>Phone:</strong> ${order.checkoutData?.phone || "N/A"}</p>

          <p>Have questions or need assistance? Feel free to <a href="mailto:support@manwe.com">contact our support team</a>.</p>
          <p>Thank you for choosing Manwe! We can't wait for you to enjoy your purchase.</p>
        </div>
        <div class="footer">
          <p>Manwe | 123 Fashion Street, Lagos, Nigeria</p>
          <p><a href="https://manwe.com">Visit Our Website</a> | <a href="mailto:support@manwe.com">Contact Us</a></p>
          <p>Follow us on <a href="https://x.com/manwe_jr?t=F7pDcNfp5cdJDEXJd7Y9Lw&s=09">X</a> | <a href="https://www.instagram.com/mw.civ?igsh=MXZlM3JhZXllZXZpcQ==">Instagram</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateShippedEmailContent = (order) => {
  const itemDetails = order.cartItems
    .map(
      (item) => `
      <li class="item">
        ${item.image ? `<img src="${item.image}" alt="${item.name || "Item"}" />` : ""}
        <div>
          <strong>${item.name || "Unknown Item"}</strong> (x${item.quantity || 1})<br>
          <small>Size: ${item.size || "N/A"}</small><br>
          <small>Price: ₦${(item.price || 0).toFixed(2)}</small>
        </div>
      </li>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      ${emailStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Order is On Its Way!</h1>
        </div>
        <div class="content">
          <p>Hi ${order.checkoutData?.firstName || "Customer"},</p>
          <p>Great news! Your order <strong>#${order.orderId || "N/A"}</strong> has been shipped and is heading to you. Expect delivery within 3-7 business days, depending on your location.</p>
          
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> ${order.orderId || "N/A"}</p>
          <p><strong>Total Amount:</strong> ₦${(order.total || 0).toFixed(2)}</p>
          <ul>${itemDetails}</ul>

          <h2>Shipping Information</h2>
          <p><strong>Name:</strong> ${order.checkoutData?.firstName || ""} ${order.checkoutData?.lastName || ""}</p>
          <p><strong>Address:</strong> ${order.checkoutData?.address || ""}, ${order.checkoutData?.city || ""}, ${order.checkoutData?.state || ""}, ${order.checkoutData?.country || ""}</p>
          <p><strong>Phone:</strong> ${order.checkoutData?.phone || "N/A"}</p>

          <p>Need help? <a href="mailto:support@manwe.com">Contact our support team</a> or reply to this email.</p>
          <p>Thank you for shopping with Manwe!</p>
        </div>
        <div class="footer">
          <p>Manwe | 123 Fashion Street, Lagos, Nigeria</p>
          <p><a href="https://manwe.com">Visit Our Website</a> | <a href="mailto:support@manwe.com">Contact Us</a></p>
          <p>Follow us on <a href="https://x.com/manwe_jr?t=F7pDcNfp5cdJDEXJd7Y9Lw&s=09">X</a> | <a href="https://www.instagram.com/mw.civ?igsh=MXZlM3JhZXllZXZpcQ==">Instagram</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateDeliveredEmailContent = (order) => {
  const itemDetails = order.cartItems
    .map(
      (item) => `
      <li class="item">
        ${item.image ? `<img src="${item.image}" alt="${item.name || "Item"}" />` : ""}
        <div>
          <strong>${item.name || "Unknown Item"}</strong> (x${item.quantity || 1})<br>
          <small>Size: ${item.size || "N/A"}</small><br>
          <small>Price: ₦${(item.price || 0).toFixed(2)}</small>
        </div>
      </li>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      ${emailStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Order Has Arrived!</h1>
        </div>
        <div class="content">
          <p>Hi ${order.checkoutData?.firstName || "Customer"},</p>
          <p>We're excited to let you know that your order <strong>#${order.orderId || "N/A"}</strong> has been successfully delivered! We hope you love your new items.</p>
          
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> ${order.orderId || "N/A"}</p>
          <p><strong>Total Amount:</strong> ₦${(order.total || 0).toFixed(2)}</p>
          <ul>${itemDetails}</ul>

          <h2>Shipping Information</h2>
          <p><strong>Name:</strong> ${order.checkoutData?.firstName || ""} ${order.checkoutData?.lastName || ""}</p>
          <p><strong>Address:</strong> ${order.checkoutData?.address || ""}, ${order.checkoutData?.city || ""}, ${order.checkoutData?.state || ""}, ${order.checkoutData?.country || ""}</p>
          <p><strong>Phone:</strong> ${order.checkoutData?.phone || "N/A"}</p>

          <p>We’d love to hear your feedback! Reply to this email or <a href="mailto:support@manwe.com">contact us</a> with any questions or comments.</p>
          <p>Thank you for choosing Manwe. Happy shopping!</p>
        </div>
        <div class="footer">
          <p>Manwe | 123 Fashion Street, Lagos, Nigeria</p>
          <p><a href="https://manwe.com">Visit Our Website</a> | <a href="mailto:support@manwe.com">Contact Us</a></p>
          <p>Follow us on <a href="https://x.com/manwe_jr?t=F7pDcNfp5cdJDEXJd7Y9Lw&s=09">X</a> | <a href="https://www.instagram.com/mw.civ?igsh=MXZlM3JhZXllZXZpcQ==">Instagram</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateAdminNotificationContent = (order) => {
  const itemDetails = order.cartItems
    .map(
      (item) => `
      <li class="item">
        <strong>${item.name || "Unknown Item"}</strong> (x${item.quantity || 1}) - ₦${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
      </li>
    `
    )
    .join("");

  const instructionsHtml = order.specialInstructions
    ? `
      <h2>Special Instructions</h2>
      <p>${order.specialInstructions}</p>
    `
    : "";

  const dashboardUrl = process.env.DASHBOARD_URL || "https://manwe.netlify.app/admindashboard.html";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      ${emailStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Order Alert! 🛍️</h1>
        </div>
        <div class="content">
          <p>Hello Admin,</p>
          <p>A new order <strong>#${order.orderId || "N/A"}</strong> has been placed on Manwe. Please review the details below and take necessary actions.</p>
          
          <h2>Order Information</h2>
          <p><strong>Order ID:</strong> ${order.orderId || "N/A"}</p>
          <p><strong>Total Amount:</strong> ₦${(order.total || 0).toFixed(2)}</p>
          <p><strong>Payment Status:</strong> ${order.paymentStatus || "N/A"}</p>
          
          <h2>Customer Details</h2>
          <p><strong>Name:</strong> ${order.checkoutData?.firstName || ""} ${order.checkoutData?.lastName || ""}</p>
          <p><strong>Email:</strong> ${order.checkoutData?.email || "N/A"}</p>
          <p><strong>Phone:</strong> ${order.checkoutData?.phone || "N/A"}</p>
          <p><strong>Address:</strong> ${order.checkoutData?.address || ""}, ${order.checkoutData?.city || ""}, ${order.checkoutData?.state || ""}, ${order.checkoutData?.country || ""}</p>

          <h2>Order Items</h2>
          <ul>${itemDetails}</ul>

          ${instructionsHtml}

          <div style="margin-top: 20px;">
            <a href="${dashboardUrl}" class="button">View Order in Dashboard</a>
          </div>
        </div>
        <div class="footer">
          <p>Manwe | 123 Fashion Street, Lagos, Nigeria</p>
          <p><a href="https://manwe.com">Visit Our Website</a> | <a href="mailto:support@manwe.com">Contact Us</a></p>
          <p>This is an automated notification. Please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const sendConfirmationEmail = async (order) => {
  const customerEmail = order.checkoutData?.email;
  if (!customerEmail || !customerEmail.includes("@")) {
    console.error("Error: Customer email is invalid or missing. Email:", customerEmail);
    return;
  }
  const mailOptions = {
    from: `"Manwe" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Manwe: Order Confirmation #${order.orderId || "N/A"}`,
    html: generateConfirmationEmailContent(order),
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent successfully to ${customerEmail}`);
  } catch (error) {
    console.error(`Error sending confirmation email to ${customerEmail}:`, error);
    throw error;
  }
};

const sendNewOrderNotification = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !adminEmail.includes("@")) {
    console.error("Error: Admin email is invalid or missing. Email:", adminEmail);
    return;
  }
  const mailOptions = {
    from: `"Manwe" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `Manwe: New Order Notification #${order.orderId || "N/A"}`,
    html: generateAdminNotificationContent(order),
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`New order notification email sent successfully to ${adminEmail}`);
  } catch (error) {
    console.error(`Error sending new order notification email:`, error);
    throw error;
  }
};

const sendShippedEmail = async (order) => {
  const customerEmail = order.checkoutData?.email;
  if (!customerEmail || !customerEmail.includes("@")) {
    console.error("Error: Customer email is invalid or missing. Email:", customerEmail);
    return;
  }
  const mailOptions = {
    from: `"Manwe" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Manwe: Your Order #${order.orderId || "N/A"} Has Shipped`,
    html: generateShippedEmailContent(order),
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Shipped email sent successfully for order ${order.orderId || "N/A"}`);
  } catch (error) {
    console.error(`Error sending shipped email for order ${order.orderId || "N/A"}:`, error);
    throw error;
  }
};

const sendDeliveredEmail = async (order) => {
  const customerEmail = order.checkoutData?.email;
  if (!customerEmail || !customerEmail.includes("@")) {
    console.error("Error: Customer email is invalid or missing. Email:", customerEmail);
    return;
  }
  const mailOptions = {
    from: `"Manwe" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Manwe: Your Order #${order.orderId || "N/A"} Has Been Delivered`,
    html: generateDeliveredEmailContent(order),
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Delivered email sent successfully for order ${order.orderId || "N/A"}`);
  } catch (error) {
    console.error(`Error sending delivered email for order ${order.orderId || "N/A"}:`, error);
    throw error;
  }
};

module.exports = {
  sendConfirmationEmail,
  sendNewOrderNotification,
  sendShippedEmail,
  sendDeliveredEmail,
};