const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// ✅ Required for Render or proxy-based platforms
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// ✅ CORS configuration
app.use(cors({
  origin: ['https://surya-portfolio-frontend.vercel.app'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));
app.options('*', cors());

// ✅ Rate Limiting to prevent spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many contact form submissions, please try again later.'
});
app.use('/api/contact', limiter);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Contact Schema
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  subject: { type: String, required: true, trim: true, maxlength: 200 },
  message: { type: String, required: true, trim: true, maxlength: 1000 },
  date: { type: Date, default: Date.now },
  ip: String,
  userAgent: String
});
const Contact = mongoose.model('Contact', ContactSchema);

// Nodemailer Transporter
const createTransporter = () => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.error('❌ MAIL_USER or MAIL_PASS missing in environment');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    },
    tls: { rejectUnauthorized: false }
  });
};

// Email Template
const createEmailTemplate = (name, email, subject, message) => `
  <div style="font-family: Arial; padding: 20px; background: #f9f9f9;">
    <div style="background: #fff; padding: 30px; border-radius: 10px;">
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <div style="background: #f0f0f0; padding: 10px; border-radius: 5px;">${message.replace(/\n/g, '<br>')}</div>
      <hr>
      <p style="font-size: 12px; color: #666;">Sent on ${new Date().toLocaleString()}</p>
    </div>
  </div>
`;

// Contact Form Handler
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    await contact.save();
    console.log('✅ Contact saved:', contact._id);

    const transporter = createTransporter();
    if (!transporter) {
      return res.status(500).json({ success: false, message: 'Email transporter setup failed. Check server logs.' });
    }

    const emailHtml = createEmailTemplate(name, email, subject, message);

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_RECEIVER,
      subject: `New Contact Form Message: ${subject}`,
      html: emailHtml,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', process.env.MAIL_RECEIVER);

    res.status(200).json({ success: true, message: 'Thank you! Your message has been sent successfully.' });

  } catch (error) {
    console.error('❌ Contact form error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: 'Validation error. Please check your input.' });
    }

    if (error.code === 'EAUTH') {
      return res.status(500).json({ success: false, message: 'Email authentication failed. Please try again later.' });
    }

    res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Uncaught server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Emails will be sent to: ${process.env.MAIL_RECEIVER}`);
});

