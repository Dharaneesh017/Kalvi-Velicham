require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
 const auth = require('./middleware/auth');
const app = express();
const PORT = process.env.PORT || 3000; // API will run on this port
const multer = require('multer'); // <-- 1. Require multer
const path = require('path');    
const nodemailer = require('nodemailer'); 
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'kalvi-velicham', 
    allowed_formats: ['jpeg', 'png', 'jpg', 'pdf']
  },
});
const upload = multer({ storage: storage });
// --- MONGODB CONNECTION URI ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school_renovation_db';
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Add these lines right after the transporter is created
transporter.verify(function(error, success) {
  if (error) {
    console.log("Transporter verification failed:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Middleware Setup ---
app.use(cors());
app.use(express.json());


function convertBudgetToGoal(budgetRange) {
  if (!budgetRange) return 500000; // Default goal if not specified
  switch (budgetRange) {
    case 'below_1lakh': return 100000;
    case '1-5lakhs': return 500000;
    case '5-10lakhs': return 1000000;
    case 'above_10lakhs': return 2000000; // Or a higher number
    default: return 500000;
  }
}

const schoolSchema = new mongoose.Schema({
  schoolNameEn: { type: String, required: true },
  schoolNameTa: { type: String, required: true },
  udiseCode: { type: String, required: true, unique: true, minlength: 11, maxlength: 11 },
  schoolType: { type: String, required: true },
  district: { type: String, required: true },
  block: { type: String, required: true },
  address: { type: String, required: true },
  addressTa: { type: String },
  pincode: { type: String, required: true, minlength: 6, maxlength: 6 },
  establishedYear: { type: Number, required: true, min: 1900, max: new Date().getFullYear() + 5 },
  studentCount: { type: Number, required: true, min: 1 },
  teacherCount: { type: Number, required: true, min: 1 },
  principalName: { type: String, required: true },
  principalContact: { type: String, required: true, minlength: 10, maxlength: 10 },
  principalEmail: { type: String, required: true, match: /^\S+@\S+\.\S+$/ },
  renovationAreas: { type: [String], required: true, validate: v => Array.isArray(v) && v.length > 0 },
  priority: { type: String, required: true },
  budgetRange: { type: String },
  currentCondition: { type: String, required: true },
  expectedOutcome: { type: String },
  recognitionCert: { type: String },
  assessmentReport: { type: String },
  conditionPhotos: { type: [String] },
  budgetEstimates: { type: String },
  submittedAt: { type: Date, default: Date.now },
  renovationAreas: { type: [String], required: true, validate: v => Array.isArray(v) && v.length > 0 },
  priority: { type: String, required: true },
  budgetRange: { type: String },
  
  // --- NEW FIELDS TO ADD ---
  fundingGoal: { type: Number, default: 0 },
  amountRaised: { type: Number, default: 0 },
  fundingStatus: { type: String, default: 'Funding' }, // e.g., 'Funding', 'Completed'
  // --- END OF NEW FIELDS ---
fundingStatus: { type: String, default: 'Funding' },
  currentCondition: { type: String, required: true },
  expectedOutcome: { type: String },
});
const School = mongoose.model('School', schoolSchema);


const volunteerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, minlength: 10, maxlength: 10 },
  district: { type: String, required: true },
  areasOfInterest: { type: [String], default: [] },
  availability: { type: String, required: true },
  message: { type: String, default: '' },
  registrationDate: { type: Date, default: Date.now }
});
const Volunteer = mongoose.model('Volunteer', volunteerSchema);

// --- Define Mongoose Schema and Model for USERS ---
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/ },
  password: { type: String, required: true },
  phoneNumber: { type: String, minlength: 10, maxlength: 10, default: '' },
  registrationDate: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);


// --- *** NEW: Define Mongoose Schema and Model for DONATIONS *** ---
const donationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    amount: { type: Number, required: true },
    finalAmount: { type: Number, required: true },
    dedication: { type: String },
    // This field stores the method selected by the user (e.g., 'credit_card', 'upi')
    paymentMethod: { type: String, required: true }, 
    coverFees: { type: Boolean, default: false },
    selectedSchoolId: { type: String, required: true },
    selectedSchoolName: { type: String, required: true },
    // A fake transaction ID to show the concept of storing a payment reference
    transactionId: { type: String },
    paymentStatus: { type: String, default: 'Succeeded' },
    donationDate: { type: Date, default: Date.now }
});
const Donation = mongoose.model('Donation', donationSchema);


// --- API Routes ---
// ... (Your existing routes for schools, volunteers, auth remain the same) ...
app.post('/api/schools',
  upload.fields([
    { name: 'recognitionCert', maxCount: 1 },
    { name: 'assessmentReport', maxCount: 1 },
    { name: 'conditionPhotos', maxCount: 5 }, 
    { name: 'budgetEstimates', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const schoolData = req.body;
      schoolData.fundingGoal = convertBudgetToGoal(schoolData.budgetRange);

      // IMPORTANT: Get the permanent URL from Cloudinary's response
      if (req.files.recognitionCert) {
        schoolData.recognitionCert = req.files.recognitionCert[0].path; 
      }
      if (req.files.assessmentReport) {
        schoolData.assessmentReport = req.files.assessmentReport[0].path;
      }
      if (req.files.budgetEstimates) {
        schoolData.budgetEstimates = req.files.budgetEstimates[0].path;
      }
      if (req.files.conditionPhotos) {
        schoolData.conditionPhotos = req.files.conditionPhotos.map(file => file.path); // Use .path
      }

      const newSchool = new School(schoolData);
      await newSchool.save();
      res.status(201).json({ message: 'School data submitted successfully!', schoolId: newSchool._id });
    } catch (error) {
      // (Your existing error handling is perfect and remains the same)
      if (error.code === 11000) return res.status(409).json({ message: 'A school with this UDISE Code already exists.' });
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

app.get('/api/schools', async (req, res) => {
  try {
    const schools = await School.find({ fundingStatus: 'Funding' }); 
    res.status(200).json(schools);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.get('/api/schools/completed', async (req, res) => {
  try {
    const schools = await School.find({ fundingStatus: 'Completed' });
    res.status(200).json(schools);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/volunteer', async (req, res) => {
  try {
    const { fullName, email, phone, district, areasOfInterest, availability, message } = req.body;
    
    // Create a new volunteer instance
    const newVolunteer = new Volunteer({
        fullName,
        email,
        phone,
        district,
        areasOfInterest,
        availability,
        message,
    });
    
    // Save the volunteer to the database
    await newVolunteer.save();

    // Nodemailer Logic - Sending two emails in a single try/catch block
    // This is more efficient and ensures better error handling
    try {
        // Email 1: Send thank you email to the volunteer
        const volunteerMailOptions = {
          from: process.env.EMAIL_USER,
          to: email, // This is the volunteer's email from the form
          subject: 'Thank You for Volunteering!',
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #0a2651;">Thank you for your interest!</h2>
                <p>Dear ${fullName},</p>
                <p>Thank you for your application to volunteer with the Tamil Nadu School Renovation Initiative. We have received your details and will get back to you soon with more information.</p>
                <p>We appreciate your willingness to contribute to our mission of building a brighter future for students.</p>
                <p>Sincerely,</p>
                <p>The Tamil Nadu School Renovation Initiative Team</p>
            </div>
          `
        };

        await transporter.sendMail(volunteerMailOptions);
        console.log('Volunteer thank you email sent successfully!');

        // Email 2: Send notification email to you (the admin)
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // This is your email from the .env file
            replyTo: email, // The volunteer's email, so you can reply directly
            subject: `New Volunteer Application from ${fullName}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #0a2651;">New Volunteer Application</h2>
                    <p><strong>Name:</strong> ${fullName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>District:</strong> ${district}</p>
                    <p><strong>Areas of Interest:</strong> ${areasOfInterest.join(', ')}</p>
                    <p><strong>Availability:</strong> ${availability}</p>
                    <p><strong>Message:</strong> ${message}</p>
                </div>
            `
        };

        await transporter.sendMail(adminMailOptions);
        console.log('Admin notification email sent successfully!');

    } catch (emailError) {
        console.error('Error during email sending:', emailError);
    }
    
    res.status(201).json({ message: 'Volunteer registered successfully!' });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({ field: key, message: error.errors[key].message }));
      return res.status(400).json({ message: 'Validation failed', errors: errors });
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Registration failed: This email is already registered.' });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/volunteer', async (req, res) => {
  try {
    const volunteers = await Volunteer.find({});
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Please enter all required fields.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Registration failed: This email is already registered.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber: phoneNumber || ''
    });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: { id: newUser._id, fullName: newUser.fullName, email: newUser.email, phoneNumber: newUser.phoneNumber }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. Please try again.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Please try again.' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      message: 'Logged in successfully!',
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, phoneNumber: user.phoneNumber }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.post('/api/contact-message', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Simple validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const mailOptions = {
            from: email, // The sender's email
            to: process.env.EMAIL_USER, // Your email address
            subject: `New Contact Message: ${subject}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #0a2651;">New Message from Contact Form</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr style="border: 1px solid #ddd; margin: 20px 0;">
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Contact message sent successfully!');
        res.status(200).json({ message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Error sending contact message:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// --- *** NEW: MOCK DONATION SUBMISSION ROUTE *** ---
app.post('/api/donations/submit-mock-payment',
  upload.single('image'), // <-- 1. ADD THIS MULTER MIDDLEWARE
  async (req, res) => {
    try {
      // Multer has now parsed the form, so req.body will have the text fields
      const donationData = req.body;

   
      if (req.file) {
        donationData.image = req.file.path;
      }

      const mockTransactionId = `MOCK_${donationData.paymentMethod.toUpperCase()}_${Date.now()}`;

      const newDonation = new Donation({
        ...donationData,
        transactionId: mockTransactionId,
        paymentStatus: 'Succeeded'
      });

      await newDonation.save();
      if (newDonation.selectedSchoolId && newDonation.finalAmount > 0) {
        const school = await School.findById(newDonation.selectedSchoolId);
        if (school) {
          school.amountRaised += newDonation.finalAmount;
          
          // Check if the funding goal has been met or exceeded
          if (school.amountRaised >= school.fundingGoal) {
            school.fundingStatus = 'Completed';
          }
          await school.save();
        }
      }

      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: donationData.email,
        subject: `Thank you for your donation to ${donationData.selectedSchoolName}!`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #0a2651;">Donation Successful</h2>
              <p>Dear ${donationData.name},</p>
              <p>Thank you for your generous donation of <strong>₹${donationData.finalAmount}</strong> to the <strong>${donationData.selectedSchoolName}</strong> renovation initiative.</p>
              <p>Your contribution will make a significant impact on the students and staff.</p>
              <p>Transaction ID: <strong>${mockTransactionId}</strong></p>
              <p>Sincerely,</p>
              <p>The Tamil Nadu School Renovation Initiative Team</p>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log('Donation confirmation email sent successfully!');
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }
      
      res.status(201).json({
        message: `Mock ${donationData.paymentMethod} donation successful!`,
        donationId: newDonation._id,
        transactionId: mockTransactionId
      });

    } catch (error) {
      console.error('Error saving mock donation:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);




app.listen(PORT, () => {
  console.log(`Node.js API listening on http://localhost:${PORT}`);
});