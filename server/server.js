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

const dbURI = process.env.DB_URI;

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

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
});
const Newsletter = mongoose.model("Newsletter", newsletterSchema);

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
    enum: ["pending", "paid"],
    default: "pending",
  },
  orderStatus: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered"],
    default: "pending",
  },
  specialInstructions: String,
  notes: [{ type: String }],
});
const Order = mongoose.model("Order", orderSchema);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateConfirmationEmailContent = (order) => {
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

const generateAdminNotificationContent = (order) => {
  let itemDetails = "";
  order.cartItems.forEach((item) => {
    itemDetails += `
      <li>
        <strong>${item.name}</strong> (x${item.quantity}) - ₦${(
      item.price * item.quantity
    ).toFixed(2)}
      </li>
    `;
  });

  const instructionsHtml = order.specialInstructions
    ? `
    <h2>Special Instructions</h2>
    <p>${order.specialInstructions}</p>
  `
    : "";

  const dashboardUrl =
    process.env.DASHBOARD_URL ||
    `https://manwe.netlify.app/admindashboard.html`;

  return `
    <h1>New Order Received! 🛍️</h1>
    <p>A new order has been placed on your store. Here are the details:</p>
    
    <h2>Order Information</h2>
    <p><strong>Order ID:</strong> ${order.orderId}</p>
    <p><strong>Total Amount:</strong> ₦${order.total.toFixed(2)}</p>
    <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
    
    <h2>Customer Details</h2>
    <p><strong>Name:</strong> ${order.checkoutData.firstName} ${
    order.checkoutData.lastName
  }</p>
    <p><strong>Email:</strong> ${order.checkoutData.email}</p>
    <p><strong>Phone:</strong> ${order.checkoutData.phone}</p>
    <p><strong>Address:</strong> ${order.checkoutData.address}, ${
    order.checkoutData.city
  }, ${order.checkoutData.state}</p>

    <h2>Order Items</h2>
    <ul style="list-style: none; padding: 0;">${itemDetails}</ul>

    ${instructionsHtml}

    <div style="margin-top: 20px;">
      <a href="${dashboardUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        View New Order in Dashboard
      </a>
    </div>

    <p>This is an automated notification. Do not reply to this email.</p>
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
    html: generateConfirmationEmailContent(order),
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent successfully to ${customerEmail}`);
  } catch (error) {
    console.error(`Error sending email to ${customerEmail}:`, error);
  }
};

const sendNewOrderNotification = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: `Manwe: New Order Received - #${order.orderId}`,
    html: generateAdminNotificationContent(order),
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `New order notification email sent successfully to ${adminEmail}`
    );
  } catch (error) {
    console.error(`Error sending new order notification email:`, error);
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

app.use(cors());

app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl === "/api/paystack/webhook") {
        req.rawBody = buf;
      }
    },
  })
);

app.use(express.static(path.join(__dirname, "..", "client", "dist")));

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

app.post("/api/newsletter/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return res
        .status(409)
        .json({ message: "This email is already subscribed." });
    }

    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();
    res.status(201).json({ message: "Subscription successful!" });
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({ message: "Failed to subscribe." });
  }
});

app.get("/api/admin/subscribers", auth, async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: 1 });
    res.status(200).json(subscribers);
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    res.status(500).json({ error: "Failed to fetch subscriber list." });
  }
});

app.post("/api/admin/newsletter/send", auth, async (req, res) => {
  const { subject, content } = req.body;
  if (!subject || !content) {
    return res.status(400).json({ error: "Subject and content are required." });
  }

  try {
    const subscribers = await Newsletter.find({}, "email");
    if (subscribers.length === 0) {
      return res.status(404).json({ message: "No subscribers found." });
    }

    const recipientEmails = subscribers.map((sub) => sub.email);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmails.join(","),
      subject: subject,
      html: content,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Newsletter sent to ${subscribers.length} subscribers.`);

    res
      .status(200)
      .json({
        message: `Newsletter sent successfully to ${subscribers.length} subscribers!`,
      });
  } catch (error) {
    console.error("Error sending newsletter:", error);
    res.status(500).json({ error: "Failed to send newsletter." });
  }
});

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
    const {
      cartItems,
      checkoutData,
      shippingCost,
      total,
      specialInstructions,
    } = req.body;
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
      specialInstructions,
      orderStatus: "pending",
      paymentStatus: "pending",
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
    const { startDate, endDate } = req.query;
    let filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      filter.createdAt = {
        $lte: new Date(endDate),
      };
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

app.get("/api/admin/orders/:orderId", auth, async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findOne({ orderId: orderId });
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching single order:", error);
    res.status(500).json({ error: "Failed to fetch order details." });
  }
});

app.put("/api/admin/orders/:orderId", auth, async (req, res) => {
  const { orderId } = req.params;
  const { newStatus } = req.body;
  const normalizedStatus = newStatus.toLowerCase().trim();

  try {
    const order = await Order.findOneAndUpdate(
      { orderId: orderId },
      { orderStatus: normalizedStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found." });

    if (normalizedStatus === "confirmed") {
    } else if (normalizedStatus === "shipped") {
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

app.put("/api/admin/orders/:orderId/status", auth, async (req, res) => {
  const { orderId } = req.params;
  const { newPaymentStatus, newOrderStatus } = req.body;

  try {
    const order = await Order.findOneAndUpdate(
      { orderId: orderId },
      { paymentStatus: newPaymentStatus, orderStatus: newOrderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    if (newPaymentStatus === "paid" && newOrderStatus === "confirmed") {
      await sendConfirmationEmail(order);
      await sendNewOrderNotification(order);
    }

    console.log(
      `Order ID ${orderId} status updated to: Payment: ${newPaymentStatus}, Order: ${newOrderStatus}`
    );
    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status." });
  }
});

app.put("/api/admin/orders/:orderId/notes", auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({ message: "Note content is required" });
    }

    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.notes.push(note);
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/admin/customers", auth, async (req, res) => {
  try {
    const customers = await Order.aggregate([
      {
        $group: {
          _id: "$checkoutData.email",
          firstName: { $first: "$checkoutData.firstName" },
          lastName: { $first: "$checkoutData.lastName" },
          phone: { $first: "$checkoutData.phone" },
          orderCount: { $sum: 1 },
          totalSpent: { $sum: "$total" },
        },
      },
      {
        $project: {
          _id: 0,
          email: "$_id",
          firstName: 1,
          lastName: 1,
          phone: 1,
          orderCount: 1,
          totalSpent: 1,
        },
      },
      { $sort: { firstName: 1 } },
    ]);
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Failed to fetch customer list." });
  }
});

app.get("/api/admin/customers/:email", auth, async (req, res) => {
  const { email } = req.params;
  try {
    const customerOrders = await Order.find({
      "checkoutData.email": email,
    }).sort({ createdAt: -1 });

    if (customerOrders.length === 0) {
      return res.status(404).json({ error: "Customer not found." });
    }

    const totalSpent = customerOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    const customerData = {
      firstName: customerOrders[0].checkoutData.firstName,
      lastName: customerOrders[0].checkoutData.lastName,
      email: customerOrders[0].checkoutData.email,
      phone: customerOrders[0].checkoutData.phone,
      orderCount: customerOrders.length,
      totalSpent: totalSpent,
      orders: customerOrders.map((order) => ({
        orderId: order.orderId,
        createdAt: order.createdAt,
        total: order.total,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
      })),
    };

    res.status(200).json(customerData);
  } catch (error) {
    console.error("Error fetching customer details:", error);
    res.status(500).json({ error: "Failed to fetch customer details." });
  }
});

app.get("/api/admin/revenue-by-date", auth, async (req, res) => {
  try {
    const revenueData = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$total" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    res.status(200).json(revenueData);
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res.status(500).json({ error: "Failed to fetch revenue data." });
  }
});

app.get("/api/admin/top-selling-products", auth, async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      {
        $unwind: "$cartItems",
      },
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: "$cartItems.id",
          name: { $first: "$cartItems.name" },
          image: { $first: "$cartItems.image" },
          totalQuantity: { $sum: "$cartItems.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$cartItems.price", "$cartItems.quantity"] },
          },
        },
      },
      {
        $sort: {
          totalQuantity: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    res.status(200).json(topProducts);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ error: "Failed to fetch top products." });
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
            { paymentStatus: "paid", orderStatus: "confirmed" },
            { new: true }
          );
          if (order) {
            console.log(
              `Payment for Order ID ${orderId} successful. Status updated.`
            );
            sendConfirmationEmail(order);
            sendNewOrderNotification(order);
          }
        } catch (error) {
          console.error("Error updating order status:", error);
        }
      }
    }
  }
  res.sendStatus(200);
});

app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
