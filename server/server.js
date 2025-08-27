const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config(); // This must be the first line after imports

const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);

const app = express();
const PORT = 3001;

const dbPassword = process.env.DB_PASSWORD;

const dbURI = `mongodb+srv://Salihu:${dbPassword}@manwe.4zhbdze.mongodb.net/ecom_orders?retryWrites=true&w=majority&appName=Manwe`;

mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Define the schema for a single item in the cart
const cartItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  size: { type: String },
  color: { type: String },
  image: { type: String }
});

// Define the schema for the customer's checkout data
const checkoutDataSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  apartment: { type: String }
});

// Update the main Order Schema to include payment status
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  cartItems: [cartItemSchema],
  checkoutData: checkoutDataSchema,
  shippingCost: Number,
  total: Number,
  createdAt: { type: Date, default: Date.now },
  paymentStatus: { type: String, default: 'pending' }, // Add a payment status field
});

const Order = mongoose.model('Order', orderSchema);

// Middleware
app.use(express.json({
  // Paystack Webhook body parser
  verify: (req, res, buf) => {
    if (req.originalUrl === '/api/paystack/webhook') {
      req.rawBody = buf;
    }
  },
}));
app.use(cors());

// API Endpoint to create a new order
app.post('/api/orders', async (req, res) => {
  try {
    const { cartItems, checkoutData, shippingCost, total } = req.body;
    const newOrderId = `CLGO-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
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
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order.' });
  }
});

// New API Endpoint for Paystack
app.post('/api/paystack/initialize', async (req, res) => {
  try {
    const { email, amount, orderId } = req.body;
    const amountInKobo = amount * 100;
    const transaction = await paystack.transaction.initialize({
      email,
      amount: amountInKobo,
      metadata: {
        orderId: orderId,
      },
    });
    res.status(200).json({
      authorization_url: transaction.data.authorization_url,
    });
  } catch (error) {
    console.error('Paystack initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize payment.' });
  }
});

// New API Endpoint for Paystack Webhook
app.post('/api/paystack/webhook', async (req, res) => {
  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(req.rawBody)
    .digest('hex');

  if (hash === req.headers['x-paystack-signature']) {
    const event = req.body;
    if (event.event === 'charge.success') {
      const orderId = event.data.metadata.orderId;
      if (orderId) {
        try {
          // Find the order and update its status
          const order = await Order.findOneAndUpdate(
            { orderId: orderId },
            { paymentStatus: 'paid' },
            { new: true }
          );
          if (order) {
            console.log(`Payment for Order ID ${orderId} successful. Status updated.`);
          }
        } catch (error) {
          console.error('Error updating order payment status:', error);
        }
      }
    }
  }

  res.sendStatus(200);
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
