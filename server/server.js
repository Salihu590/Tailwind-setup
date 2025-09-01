const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const nodemailer = require("nodemailer");

dotenv.config();

const paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

const dbPassword = process.env.DB_PASSWORD;
const dbURI = `mongodb+srv://Salihu:${dbPassword}@manwe.4zhbdze.mongodb.net/ecom_orders?retryWrites=true&w=majority&appName=Manwe`;

mongoose
  .connect(dbURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
adminSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
const Admin = mongoose.model("Admin", adminSchema);

const cartItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  size: String,
  color: String,
  image: String,
});

const checkoutDataSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  apartment: String,
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  cartItems: [cartItemSchema],
  checkoutData: checkoutDataSchema,
  shippingCost: Number,
  total: Number,
  createdAt: { type: Date, default: Date.now },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered"],
    default: "pending",
  },
});
const Order = mongoose.model("Order", orderSchema);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateEmailContent = (order) => {
  let itemDetails = "";
  order.cartItems.forEach((item) => {
    itemDetails += `
      <li style="margin-bottom: 10px;">
        <div>
          <strong>${item.name}</strong> (x${item.quantity})<br>
          <small>Size: ${item.size || "N/A"}</small><br>
          <small>Price: ₦${item.price.toFixed(2)}</small>
        </div>
      </li>
    `;
  });

  return `
    <h1>Order Confirmation</h1>
    <p>Hi ${order.checkoutData.firstName},</p>
    <p>Thank you for your order with Manwe! We're excited for you to receive your items. Your order has been confirmed and will be shipped soon.</p>
    <p><strong>Order ID:</strong> ${order.orderId}</p>
    <p><strong>Total Amount:</strong> ₦${order.total.toFixed(2)}</p>

    <h2>Order Details</h2>
    <ul style="list-style: none; padding: 0;">${itemDetails}</ul>

    <h2>Shipping Information</h2>
    <p><strong>Name:</strong> ${order.checkoutData.firstName} ${
    order.checkoutData.lastName
  }</p>
    <p><strong>Address:</strong> ${order.checkoutData.address}, ${
    order.checkoutData.city
  }, ${order.checkoutData.state}, ${order.checkoutData.country}</p>
    <p><strong>Phone:</strong> ${order.checkoutData.phone}</p>

    <p>If you have any questions, please reply to this email.</p>
    <p>Best regards,<br>The Manwe Team</p>
  `;
};

const generateShippedEmailContent = (order) => {
  let itemDetails = "";
  order.cartItems.forEach((item) => {
    itemDetails += `
      <li style="margin-bottom: 10px;">
        <div>
          <strong>${item.name}</strong> (x${item.quantity})<br>
          <small>Size: ${item.size || "N/A"}</small><br>
          <small>Price: ₦${item.price.toFixed(2)}</small>
        </div>
      </li>
    `;
  });

  return `
    <h1>Your Manwe Order Has Shipped!</h1>
    <p>Hi ${order.checkoutData.firstName},</p>
    <p>Great news! Your order <strong>#${
      order.orderId
    }</strong> has been packed and is now on its way to you.</p>
    <p>You can expect to receive it shortly.</p>
    
    <h2>Order Details</h2>
    <p><strong>Order ID:</strong> ${order.orderId}</p>
    <p><strong>Total Amount:</strong> ₦${order.total.toFixed(2)}</p>
    <ul style="list-style: none; padding: 0;">${itemDetails}</ul>

    <h2>Shipping Information</h2>
    <p><strong>Name:</strong> ${order.checkoutData.firstName} ${
    order.checkoutData.lastName
  }</p>
    <p><strong>Address:</strong> ${order.checkoutData.address}, ${
    order.checkoutData.city
  }, ${order.checkoutData.state}, ${order.checkoutData.country}</p>
    <p><strong>Phone:</strong> ${order.checkoutData.phone}</p>

    <p>Thank you for shopping with us!</p>
    <p>Best regards,<br>The Manwe Team</p>
  `;
};

const generateDeliveredEmailContent = (order) => {
  let itemDetails = "";
  order.cartItems.forEach((item) => {
    itemDetails += `
      <li style="margin-bottom: 10px;">
        <div>
          <strong>${item.name}</strong> (x${item.quantity})<br>
          <small>Size: ${item.size || "N/A"}</small><br>
          <small>Price: ₦${item.price.toFixed(2)}</small>
        </div>
      </li>
    `;
  });

  return `
    <h1>Your Manwe Order Has Been Delivered!</h1>
    <p>Hi ${order.checkoutData.firstName},</p>
    <p>Great news! Your order <strong>#${
      order.orderId
    }</strong> has been successfully delivered to the address you provided. We hope you love your new items!</p>
    
    <h2>Order Details</h2>
    <p><strong>Order ID:</strong> ${order.orderId}</p>
    <p><strong>Total Amount:</strong> ₦${order.total.toFixed(2)}</p>
    <ul style="list-style: none; padding: 0;">${itemDetails}</ul>

    <h2>Shipping Information</h2>
    <p><strong>Name:</strong> ${order.checkoutData.firstName} ${
    order.checkoutData.lastName
  }</p>
    <p><strong>Address:</strong> ${order.checkoutData.address}, ${
    order.checkoutData.city
  }, ${order.checkoutData.state}, ${order.checkoutData.country}</p>
    <p><strong>Phone:</strong> ${order.checkoutData.phone}</p>

    <p>Thank you for shopping with us!</p>
    <p>Best regards,<br>The Manwe Team</p>
  `;
};

const sendConfirmationEmail = async (order) => {
  const customerEmail = order.checkoutData.email;
  if (!customerEmail || !customerEmail.includes("@")) {
    console.error(
      "Error: Customer email is invalid or missing. Email:",
      customerEmail
    );
    return;
  }
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: `Manwe: Order Confirmed #${order.orderId}`,
    html: generateEmailContent(order),
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent successfully to ${customerEmail}`);
  } catch (error) {
    console.error(`Error sending email to ${customerEmail}:`, error);
  }
};

const sendShippedEmail = async (order) => {
  const customerEmail = order.checkoutData.email;
  if (!customerEmail || !customerEmail.includes("@")) {
    console.error(
      "Error: Customer email is invalid or missing. Email:",
      customerEmail
    );
    return;
  }
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: `Manwe: Your Order #${order.orderId} Has Shipped`,
    html: generateShippedEmailContent(order),
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Shipped email sent successfully for order ${order.orderId}`);
  } catch (error) {
    console.error(
      `Error sending shipped email for order ${order.orderId}:`,
      error
    );
  }
};

const sendDeliveredEmail = async (order) => {
  const customerEmail = order.checkoutData.email;
  if (!customerEmail || !customerEmail.includes("@")) {
    console.error(
      "Error: Customer email is invalid or missing. Email:",
      customerEmail
    );
    return;
  }
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: `Manwe: Your Order #${order.orderId} Has Been Delivered`,
    html: generateDeliveredEmailContent(order),
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Delivered email sent successfully for order ${order.orderId}`);
  } catch (error) {
    console.error(
      `Error sending delivered email for order ${order.orderId}:`,
      error
    );
  }
};

app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl === "/api/paystack/webhook") {
        req.rawBody = buf;
      }
    },
  })
);
app.use(cors());
app.use(express.static(path.join(__dirname, "..", "client", "public")));

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({ error: "No token, authorization denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ error: "Invalid credentials" });
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const { cartItems, checkoutData, shippingCost, total } = req.body;
    const newOrderId = `CLGO-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;
    const newOrder = new Order({
      orderId: newOrderId,
      cartItems,
      checkoutData,
      shippingCost,
      total,
    });
    await newOrder.save();
    console.log(`New order created and saved to DB: ${newOrderId}`);
    res.status(201).json({ orderId: newOrderId });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

app.get("/api/admin/orders", auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

app.put("/api/admin/orders/:orderId", auth, async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const normalizedStatus = status.toLowerCase().trim();

  try {
    const order = await Order.findOneAndUpdate(
      { orderId: orderId },
      { paymentStatus: normalizedStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found." });

    if (normalizedStatus === "shipped") {
      await sendShippedEmail(order);
    } else if (normalizedStatus === "delivered") {
      await sendDeliveredEmail(order);
    }

    console.log(`Order ID ${orderId} status updated to: ${normalizedStatus}`);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status." });
  }
});

app.post("/api/paystack/initialize", async (req, res) => {
  try {
    const { email, amount, orderId } = req.body;
    const amountInKobo = amount * 100;
    const transaction = await paystack.transaction.initialize({
      email,
      amount: amountInKobo,
      metadata: { orderId },
    });
    res
      .status(200)
      .json({ authorization_url: transaction.data.authorization_url });
  } catch (error) {
    console.error("Paystack initialization error:", error);
    res.status(500).json({ error: "Failed to initialize payment." });
  }
});

app.post("/api/paystack/webhook", async (req, res) => {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(req.rawBody)
    .digest("hex");
  if (hash === req.headers["x-paystack-signature"]) {
    const event = req.body;
    if (event.event === "charge.success") {
      const orderId = event.data.metadata.orderId;
      if (orderId) {
        try {
          const order = await Order.findOneAndUpdate(
            { orderId },
            { paymentStatus: "paid" },
            { new: true }
          );
          if (order) {
            console.log(
              `Payment for Order ID ${orderId} successful. Status updated.`
            );
            sendConfirmationEmail(order);
          }
        } catch (error) {
          console.error("Error updating order payment status:", error);
        }
      }
    }
  }
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
