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
// --- MONGODB CONNECTION URI ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school_renovation_db';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Middleware Setup ---
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // --- START: MODIFICATION TO SANITIZE FILENAME ---
    // Sanitize the original filename to remove invalid characters
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '');
    // Create a unique filename
    cb(null, Date.now() + '-' + sanitizedOriginalName);
    // --- END: MODIFICATION ---
  }
});
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
const upload = multer({ storage: storage });
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

      if (req.files.recognitionCert) {
        schoolData.recognitionCert = req.files.recognitionCert[0].filename;
      }
      if (req.files.assessmentReport) {
        schoolData.assessmentReport = req.files.assessmentReport[0].filename;
      }
      if (req.files.budgetEstimates) {
        schoolData.budgetEstimates = req.files.budgetEstimates[0].filename;
      }
      if (req.files.conditionPhotos) {
        schoolData.conditionPhotos = req.files.conditionPhotos.map(file => file.filename);
      }

      const newSchool = new School(schoolData);
      await newSchool.save();
      res.status(201).json({ message: 'School data submitted successfully!', schoolId: newSchool._id });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.keys(error.errors).map(key => ({ field: key, message: error.errors[key].message }));
        return res.status(400).json({ message: 'Validation failed', errors: errors });
      }
      if (error.code === 11000) {
        return res.status(409).json({ message: 'A school with this UDISE Code already exists.' });
      }
      console.error(error); // Log other errors
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
    const newVolunteer = new Volunteer(req.body);
    await newVolunteer.save();
    res.status(201).json({ message: 'Volunteer registered successfully!', volunteerId: newVolunteer._id });
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


// --- *** NEW: MOCK DONATION SUBMISSION ROUTE *** ---
app.post('/api/donations/submit-mock-payment',
  upload.single('image'), // <-- 1. ADD THIS MULTER MIDDLEWARE
  async (req, res) => {
    try {
      // Multer has now parsed the form, so req.body will have the text fields
      const donationData = req.body;

      // 2. CHECK FOR THE UPLOADED FILE and add its name to the data
      if (req.file) {
        donationData.image = req.file.filename;
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
      setTimeout(() => {
        res.status(201).json({
          message: `Mock ${donationData.paymentMethod} donation successful!`,
          donationId: newDonation._id,
          transactionId: mockTransactionId
        });
      }, 1500);

    } catch (error) {
      console.error('Error saving mock donation:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);



app.listen(PORT, () => {
  console.log(`Node.js API listening on http://localhost:${PORT}`);
});