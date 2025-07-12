# Surya Teja Portfolio - Backend Email System

This backend server handles contact form submissions from the portfolio website and sends email notifications.

## 🚀 Features

- **Email Notifications**: Receive emails when someone fills out the contact form
- **Database Storage**: All contact submissions are stored in MongoDB
- **Input Validation**: Comprehensive validation for all form fields
- **Rate Limiting**: Prevents spam submissions
- **Security**: Helmet.js for security headers
- **Error Handling**: Robust error handling and user feedback
- **Beautiful Email Templates**: Professional HTML email templates

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Gmail account with App Password

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/portfolio_contacts

# Email Configuration (Gmail)
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
MAIL_RECEIVER=your-email@gmail.com

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Gmail App Password Setup

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → App passwords
   - Select "Mail" and your device
   - Copy the generated password
4. Use this password in your `MAIL_PASS` environment variable

### 4. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/portfolio_contacts`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Use: `mongodb+srv://username:password@cluster.mongodb.net/portfolio_contacts`

### 5. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## 📧 Email Features

### Email Template
- Professional HTML email design
- Includes sender information
- Formatted message display
- Timestamp and source information

### Email Content
- **From**: Portfolio Contact Form
- **Subject**: "New Contact Form Message: [Subject]"
- **Content**: Name, email, subject, and message
- **Format**: Both HTML and plain text versions

## 🔒 Security Features

- **Rate Limiting**: 5 requests per 15 minutes per IP
- **Input Validation**: Email format, length limits, required fields
- **CORS Protection**: Configured for specific domains
- **Security Headers**: Helmet.js implementation
- **Error Handling**: No sensitive information in error messages

## 📊 API Endpoints

### POST `/api/contact`
Handles contact form submissions

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Job Opportunity",
  "message": "Hello, I would like to discuss..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you! Your message has been sent successfully."
}
```

### GET `/api/health`
Health check endpoint

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Email not sending**
   - Check Gmail App Password
   - Verify email credentials
   - Check spam folder

2. **MongoDB connection error**
   - Verify connection string
   - Check MongoDB service status
   - Ensure network connectivity

3. **CORS errors**
   - Update CORS origins in server.js
   - Check frontend URL configuration

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 🚀 Deployment

### Heroku
1. Create Heroku app
2. Set environment variables
3. Deploy with Git

### Vercel
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Railway
1. Connect repository
2. Set environment variables
3. Deploy with one click

## 📝 Database Schema

```javascript
{
  name: String (required, max 100 chars),
  email: String (required, validated),
  subject: String (required, max 200 chars),
  message: String (required, max 1000 chars),
  date: Date (auto-generated),
  ip: String (visitor IP),
  userAgent: String (browser info)
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - feel free to use this code for your own projects!

## 📞 Support

If you need help setting up the backend:
1. Check the troubleshooting section
2. Review the logs for error messages
3. Verify all environment variables are set correctly

---

**Happy coding! 🎉** 

## 🚀 **Complete Setup Guide - Backend Email System**

### **Step 1: Understanding What We Built**

We created a complete backend system that:
- **Receives** contact form submissions from your portfolio
- **Stores** them in a MongoDB database
- **Sends** you email notifications
- **Provides** security and validation

---

### **Step 2: Project Structure Overview**

```
Surya/
├── index.html          (Your portfolio frontend)
├── style.css           (Portfolio styling)
├── script.js           (Frontend JavaScript - Updated)
├── server.js           (Backend server - New/Enhanced)
├── package.json        (Dependencies - New)
├── env-template.txt    (Environment variables template - New)
├── README.md           (Setup instructions - New)
└── images/             (Your portfolio images)
```

---

### **Step 3: Installing Dependencies**

**What this does:** Installs all the required Node.js packages for the backend.

**Command:**
```bash
npm install
```

**What gets installed:**
- `express` - Web server framework
- `mongoose` - MongoDB database connection
- `nodemailer` - Email sending functionality
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables management
- `express-rate-limit` - Prevents spam submissions
- `helmet` - Security headers
- `nodemon` - Auto-restart server during development

---

### **Step 4: Setting Up Environment Variables**

**What this does:** Stores sensitive information (passwords, database URLs) securely.

**Create a file named `.env` in your project root:**

```env
<code_block_to_apply_changes_from>
```

**Explanation of each variable:**
- `MONGO_URI` - Where your database is located
- `MAIL_USER` - Your Gmail address
- `MAIL_PASS` - Gmail App Password (not your regular password)
- `MAIL_RECEIVER` - Where to send notification emails
- `PORT` - Which port the server runs on
- `NODE_ENV` - Development or production mode

---

### **Step 5: Setting Up Gmail App Password**

**Why needed:** Gmail requires special passwords for applications (not your regular password).

**Step-by-step process:**

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com/
   - Click on "Security"

2. **Enable 2-Factor Authentication**
   - Find "2-Step Verification"
   - Turn it ON if not already enabled

3. **Generate App Password**
   - Go to "App passwords" (under 2-Step Verification)
   - Select "Mail" from dropdown
   - Select your device
   - Click "Generate"
   - **Copy the 16-character password**

4. **Use in .env file**
   - Paste the generated password as `MAIL_PASS`

**Example:**
```env
MAIL_PASS=abcd efgh ijkl mnop
```

---

### **Step 6: Setting Up MongoDB Database**

**Option A: Local MongoDB (Free)**

1. **Download MongoDB Community Server**
   - Go to: https://www.mongodb.com/try/download/community
   - Download for your operating system
   - Install following the wizard

2. **Start MongoDB Service**
   - Windows: MongoDB runs as a service automatically
   - Mac/Linux: `sudo systemctl start mongod`

3. **Use connection string:**
   ```env
   MONGO_URI=mongodb://localhost:27017/portfolio_contacts
   ```

**Option B: MongoDB Atlas (Cloud - Recommended)**

1. **Create MongoDB Atlas Account**
   - Go to: https://www.mongodb.com/atlas
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier
   - Select cloud provider and region
   - Click "Create"

3. **Set Up Database Access**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Remember these credentials

4. **Set Up Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

**Example Atlas connection string:**
```env
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/portfolio_contacts
```

---

### **Step 7: Understanding the Backend Code (server.js)**

**What the server does:**

1. **Security Setup:**
   ```javascript
   app.use(helmet()); // Security headers
   app.use(cors()); // Allow frontend to connect
   ```

2. **Rate Limiting:**
   ```javascript
   // Prevents spam - max 5 submissions per 15 minutes
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 5
   });
   ```

3. **Database Schema:**
   ```javascript
   // Defines what data to store
   const ContactSchema = new mongoose.Schema({
     name: { type: String, required: true, maxlength: 100 },
     email: { type: String, required: true, match: emailRegex },
     subject: { type: String, required: true, maxlength: 200 },
     message: { type: String, required: true, maxlength: 1000 },
     date: { type: Date, default: Date.now },
     ip: String,
     userAgent: String
   });
   ```

4. **Email Template:**
   ```javascript
   // Creates beautiful HTML emails
   const createEmailTemplate = (name, email, subject, message) => {
     return `
       <div style="font-family: Arial, sans-serif;">
         <h2>New Contact Form Submission</h2>
         <p><strong>From:</strong> ${name} (${email})</p>
         <p><strong>Subject:</strong> ${subject}</p>
         <p><strong>Message:</strong> ${message}</p>
       </div>
     `;
   };
   ```

5. **API Endpoint:**
   ```javascript
   app.post('/api/contact', async (req, res) => {
     // 1. Validate input
     // 2. Save to database
     // 3. Send email
     // 4. Return response
   });
   ```

---

### **Step 8: Understanding Frontend Changes (script.js)**

**What changed in the frontend:**

1. **Loading State:**
   ```javascript
   // Shows "Sending..." while processing
   submitBtn.textContent = 'Sending...';
   submitBtn.disabled = true;
   ```

2. **Better Error Handling:**
   ```javascript
   // Handles different types of errors
   if (response.ok && result.success) {
     // Success
     formMessage.className = 'form-message success';
   } else {
     // Error
     formMessage.className = 'form-message error';
   }
   ```

3. **Form Reset:**
   ```javascript
   // Clears form after successful submission
   form.reset();
   ```

---

### **Step 9: Starting the Server**

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**What happens when you start:**
1. Server connects to MongoDB
2. Email service is configured
3. Server starts listening on port 5000
4. You see console messages:
   ```
   🚀 Server running on port 5000
   📧 Email notifications will be sent to: your-email@gmail.com
   🌍 Environment: development
   ```

---

### **Step 10: Testing the System**

**1. Test the server is running:**
   - Open browser to: `http://localhost:5000/api/health`
   - Should see: `{"status":"OK","timestamp":"..."}`

**2. Test the contact form:**
   - Fill out your portfolio contact form
   - Submit the form
   - Check your email for notification
   - Check MongoDB for stored data

**3. Check for errors:**
   - Look at server console for error messages
   - Check browser console for frontend errors

---

### **Step 11: How It All Works Together**

**When someone fills your contact form:**

1. **Frontend (script.js):**
   - Captures form data
   - Shows loading state
   - Sends data to backend

2. **Backend (server.js):**
   - Receives the data
   - Validates input
   - Saves to MongoDB
   - Sends email notification
   - Returns success/error response

3. **Frontend receives response:**
   - Shows success/error message
   - Resets form if successful
   - Hides loading state

4. **You receive:**
   - Email notification with form details
   - Data stored in database for future reference

---

### **Step 12: Deployment Options**

**For production, you can deploy to:**

1. **Heroku:**
   - Connect GitHub repository
   - Set environment variables in Heroku dashboard
   - Deploy automatically

2. **Railway:**
   - Connect repository
   - Set environment variables
   - One-click deployment

3. **Vercel:**
   - Connect GitHub repository
   - Set environment variables
   - Automatic deployments

---

### **Step 13: Troubleshooting Common Issues**

**Email not sending:**
- Check Gmail App Password is correct
- Verify 2FA is enabled
- Check spam folder

**Database connection error:**
- Verify MongoDB is running
- Check connection string
- Ensure network connectivity

**CORS errors:**
- Update CORS origins in server.js
- Add your domain to allowed origins

**Rate limiting:**
- Wait 15 minutes between submissions
- Check if you're testing too frequently

---

### **Step 14: Security Features Explained**

1. **Rate Limiting:** Prevents spam by limiting submissions per IP
2. **Input Validation:** Ensures data quality and prevents injection
3. **CORS Protection:** Only allows your domain to access the API
4. **Security Headers:** Protects against common web vulnerabilities
5. **Error Handling:** Doesn't expose sensitive information in errors

---

This complete system ensures that every time someone contacts you through your portfolio, you'll receive a professional email notification with all their details, and the information will be safely stored in your database! 🚀 

---

**Congratulations!**  
Your backend is now running and accessible on Render. The message:
```json
{"success":false,"message":"Route not found"}
```
means your server is up, but you are visiting a route (`/`) that is not defined in your backend.

---

## What Does This Mean?

- **Your deployment is successful!**
- Your backend is working and responding to requests.
- The root route `/` is not defined, so you get a "Route not found" message (this is normal for many APIs).

---

## What Should You Do Next?

### 1. **Test Your API Route**
- If your contact form sends data to `/contact` or `/api/contact`, try visiting:
  ```
  https://portfolio-main-surya-teja.onrender.com/contact
  ```
  or
  ```
  https://portfolio-main-surya-teja.onrender.com/api/contact
  ```
  (You may get a "Method Not Allowed" or similar if it's a POST route, but you should not get a 502 error.)

### 2. **Update Your Frontend**
- In your frontend JavaScript, make sure the API URL matches your Render backend:
  ```js
  fetch('https://portfolio-main-surya-teja.onrender.com/contact', { ... })
  ```
  or
  ```js
  fetch('https://portfolio-main-surya-teja.onrender.com/api/contact', { ... })
  ```
- Remove any references to `localhost` or `127.0.0.1`.

### 3. **(Optional) Add a Friendly Root Route**
If you want a friendly message at `/`, add this to your `server.js`:
```js
app.get('/', (req, res) => {
  res.send('Backend is running!');
});
```

---

## **Summary Table**

| What you see now                | What it means                | What to do next                |
|----------------------------------|------------------------------|-------------------------------|
| `{"success":false,"message":"Route not found"}` | Backend is running, but no route for `/` | Test your actual API route, update frontend if needed |

---

**If your contact form is still not working, let me know:**
- The exact URL your frontend is POSTing to
- The route(s) defined in your backend (`server.js`)

I can help you debug further! 