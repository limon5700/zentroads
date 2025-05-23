const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Assuming you named the file db.js in a config folder
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // We'll create this model
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const auth = require('./middleware/auth');
const Company = require('./models/Company');
const Order = require('./models/Order'); // Import the Order model
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

dotenv.config(); // Load environment variables

connectDB(); // Connect to the database

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '3cdm3hr6r0034JvLhAP3ZEWv6EbMpWsrQe1fAqLjyi62VX4HpgKGELUmWn4EkVPL');
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Basic route to check if server is running
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create new user
    user = new User({
      name,
      email,
      password,
      verificationToken
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();

    // Send verification email
    const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;
    await transporter.sendMail({
      to: email,
      subject: 'Verify your email',
      html: `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      `
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification.',
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // User authenticated (You might want to send a token here in a real app)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d'
    });

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
app.get('/api/user/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -verificationToken');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
app.put('/api/user/profile', auth, async (req, res) => {
  try {
    const { name, phone, address, bio } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.bio = bio || user.bio;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        bio: user.bio,
        isEmailVerified: user.isEmailVerified,
        subscription: user.subscription,
        paymentHistory: user.paymentHistory
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update subscription
app.put('/api/user/subscription', auth, async (req, res) => {
  try {
    const { plan, autoRenew } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set subscription details
    user.subscription = {
      plan,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      autoRenew: autoRenew || false
    };

    // Add payment record
    const payment = {
      amount: getPlanPrice(plan),
      currency: 'USD',
      date: new Date(),
      status: 'success',
      plan,
      transactionId: generateTransactionId()
    };

    user.paymentHistory.push(payment);
    await user.save();

    res.json({
      message: 'Subscription updated successfully',
      subscription: user.subscription,
      payment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel subscription
app.post('/api/user/subscription/cancel', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.subscription.status = 'inactive';
    user.subscription.autoRenew = false;
    await user.save();

    res.json({
      message: 'Subscription cancelled successfully',
      subscription: user.subscription
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to get plan price
function getPlanPrice(plan) {
  const prices = {
    'Starter': 499,
    'Professional': 999,
    'Enterprise': 1999
  };
  return prices[plan] || 0;
}

// Helper function to generate transaction ID
function generateTransactionId() {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Verify email
app.get('/api/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to get order details by ID
app.get('/api/order/:orderId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.orderId;

    // Find the order by ID and ensure it belongs to the authenticated user
    const order = await Order.findOne({ _id: orderId, user: userId }).populate('company'); // Optionally populate company details

    if (!order) {
      return res.status(404).json({ message: 'Order not found or does not belong to the user' });
    }

    res.json(order);

  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Server error while fetching order details' });
  }
});

// Endpoint to save checkout details (User and Company Info)
app.post('/api/checkout/details', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { companyName, companyAddress, companyPhone, companyEmail, gstNumber, packageName, packagePrice, packageDurationValue, packageDurationUnit, totalAmount } = req.body;

    // Basic validation
    if (!companyName || !companyAddress || !packageName || !packagePrice || !packageDurationValue || !packageDurationUnit || !totalAmount) {
      return res.status(400).json({ message: 'Company name, address, package details, and duration are required' });
    }

    // Save or update company details
    let company = await Company.findOneAndUpdate(
      { user: userId },
      { companyName, companyAddress, companyPhone, companyEmail, gstNumber },
      { upsert: true, new: true }
    );

    // Create or update an Order for this user
    let order = await Order.findOneAndUpdate(
      { user: userId, status: 'pending' }, // Find a pending order for this user
      { // Update with new package, company, and duration info
        packageName,
        packagePrice,
        packageDurationValue,
        packageDurationUnit,
        company: company._id, // Link to the saved company details
        // You might want to save the totalAmount here as well, if needed for records
        // totalAmount: totalAmount, 
      },
      { upsert: true, new: true } // Create if no pending order exists, return new doc
    );

    res.json({
      message: 'Details saved and order created/updated',
      companyId: company._id,
      orderId: order._id, // Send back the order ID
    });

  } catch (error) {
    console.error('Error saving checkout details:', error);
    res.status(500).json({ message: 'Server error while saving details' });
  }
});

// Endpoint to verify bKash payment
app.post('/api/verify-bkash-payment', auth, async (req, res) => {
  try {
    const { orderId, bkashNumber, transactionId } = req.body;
    const userId = req.user.id;

    // Find the order and ensure it belongs to the authenticated user
    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or does not belong to the user' });
    }

    // Here you would typically:
    // 1. Call bKash API to verify the transaction
    // 2. Check if the amount matches
    // 3. Verify the transaction status

    // For now, we'll simulate a successful verification
    // In production, replace this with actual bKash API calls
    const isPaymentValid = true; // This should come from bKash API verification

    if (isPaymentValid) {
      // Update order status
      order.status = 'paid';
      order.paymentDetails = {
        method: 'bkash',
        bkashNumber,
        transactionId,
        verifiedAt: new Date()
      };
      await order.save();

      // Update user's subscription if needed
      const user = await User.findById(userId);
      if (user) {
        user.subscription = {
          plan: order.packageName,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + (order.packageDurationUnit === 'year' ? order.packageDurationValue * 365 : order.packageDurationValue * 30) * 24 * 60 * 60 * 1000),
          autoRenew: false
        };
        await user.save();
      }

      res.json({ message: 'Payment verified successfully', order });
    } else {
      res.status(400).json({ message: 'Payment verification failed' });
    }

  } catch (error) {
    console.error('Error verifying bKash payment:', error);
    res.status(500).json({ message: 'Server error while verifying payment' });
  }
});

// Endpoint to update order status (optional - can also use webhooks for robustness)
app.post('/api/update-order-status', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId, status } = req.body;

    // Find the order and ensure it belongs to the authenticated user
    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or does not belong to the user' });
    }

    // Update the order status
    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated successfully', order });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error while updating order status' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
