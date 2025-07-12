const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Security Headers
app.use(helmet());

// ✅ Updated CORS to allow frontend on Vercel
app.use(cors({
  origin: [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'https://surya-portfolio-frontend.vercel.app/' // ✅ Your Vercel frontend URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many contact form submissions, please try again later.'
});
app.use('/api/contact', limiter);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Contact Schema
const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot be more than 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  date: { type: Date, default: Date.now },
  ip: String,
  userAgent: String
});
const Contact = mongoose.model('Contact', ContactSchema);

// Nodemailer setup
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Email template
const createEmailTemplate = (name, email, subject, message) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px;">New Contact Form Submission</h2>
        <div style="margin-bottom: 20px;">
          <strong style="color: #555;">From:</strong> ${name} (${email})
        </div>
        <div style="margin-bottom: 20px;">
          <strong style="color: #555;">Subject:</strong> ${subject}
        </div>
        <div style="margin-bottom: 20px;">
          <strong style="color: #555;">Message:</strong>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px; line-height: 1.6;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888;">
          <p>This message was sent from your portfolio contact form.</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  `;
};

// Contact Form Route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/;
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
    console.log('✅ Contact saved to database:', contact._id);

    const transporter = createTransporter();
    const emailHtml = createEmailTemplate(name, email, subject, message);

    const mailOptions = {
      from: `Portfolio Contact <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_RECEIVER,
      subject: `New Contact Form Message: ${subject}`,
      html: emailHtml,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully');

    res.status(200).json({ success: true, message: 'Thank you! Your message has been sent successfully.' });

  } catch (error) {
    console.error('❌ Error in contact form:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: 'Please check your input and try again.' });
    }

    if (error.code === 'EAUTH') {
      return res.status(500).json({ success: false, message: 'Email service temporarily unavailable. Please try again later.' });
    }

    res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 fallback
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email notifications will be sent to: ${process.env.MAIL_RECEIVER}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
