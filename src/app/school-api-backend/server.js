require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
 const auth = require('./middleware/auth');
const app = express();
const PORT = process.env.PORT || 3000; // API will run on this port

// --- MONGODB CONNECTION URI ---
// IMPORTANT: Replace with your actual Atlas connection string or local connection.
// For MongoDB Atlas:
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER_URL/school_renovation_db?retryWrites=true&w=majority';
//
// For Local MongoDB:
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school_renovation_db';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Middleware Setup ---
// Enable CORS for all origins (for development). In production, specify allowed origins.
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// --- Define Mongoose Schema and Model for SCHOOLS ---
// This defines the structure of documents in your 'schools' collection.
// Adjust fields based on your Angular form's data structure.
const schoolSchema = new mongoose.Schema({
  schoolNameEn: { type: String, required: true },
  schoolNameTa: { type: String, required: true },
  udiseCode: { type: String, required: true, unique: true, minlength: 11, maxlength: 11 },
  schoolType: { type: String, required: true },
  district: { type: String, required: true },
  block: { type: String, required: true },
  address: { type: String, required: true },
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
  // File fields will store just the filename/path if not using a separate file storage service
  recognitionCert: { type: String },
  assessmentReport: { type: String },
  conditionPhotos: { type: String },
  budgetEstimates: { type: String },
  submittedAt: { type: Date, default: Date.now } // Automatically adds submission timestamp
});

const School = mongoose.model('School', schoolSchema); // 'School' model will create 'schools' collection in MongoDB

// --- Define Mongoose Schema and Model for VOLUNTEERS ---
// This defines the structure of documents for your 'volunteers' collection.
const volunteerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Email should be unique
  phone: { type: String, required: true, minlength: 10, maxlength: 10 },
  district: { type: String, required: true },
  areasOfInterest: { type: [String], default: [] }, // Array of strings for checkboxes
  availability: { type: String, required: true },
  message: { type: String, default: '' },
  registrationDate: { type: Date, default: Date.now }
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema); // 'Volunteer' model will create 'volunteers' collection in MongoDB
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/ },
  password: { type: String, required: true }, // This will store the HASHED password
  phoneNumber: { type: String, minlength: 10, maxlength: 10, default: '' }, // Optional field
  registrationDate: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
// --- Define API Routes ---

// POST route to submit new school data
app.post('/api/schools', async (req, res) => {
  try {
    // Create a new School document using the request body
    const newSchool = new School(req.body);
    // Save the document to MongoDB
    await newSchool.save();
    console.log('School saved successfully with ID:', newSchool._id);
    res.status(201).json({ message: 'School data submitted successfully!', schoolId: newSchool._id });
  } catch (error) {
    console.error('Error saving school data:', error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      return res.status(400).json({ message: 'Validation failed', errors: errors });
    }
    // Handle duplicate key error (e.g., if udiseCode is set as unique and a duplicate is submitted)
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A school with this UDISE Code already exists.' });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET route to fetch all school data
app.get('/api/schools', async (req, res) => {
  try {
    const schools = await School.find({}); 
    res.status(200).json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// NEW: POST route to submit new volunteer registration data
app.post('/api/volunteer', async (req, res) => {
  try {
    const newVolunteer = new Volunteer(req.body);
    await newVolunteer.save();
    console.log('Volunteer registered successfully with ID:', newVolunteer._id);
    res.status(201).json({ message: 'Volunteer registered successfully!', volunteerId: newVolunteer._id });
  } catch (error) {
    console.error('Error saving volunteer:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      return res.status(400).json({ message: 'Validation failed', errors: errors });
    }
    // Handle duplicate key error for email
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(409).json({ message: 'Registration failed: This email is already registered.' });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Optional: GET route to fetch all volunteer data (for admin purposes)
app.get('/api/volunteer', async (req, res) => {
  try {
    const volunteers = await Volunteer.find({});
    res.status(200).json(volunteers);
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// ... (your existing /api/volunteer POST route)

// --- NEW: User Registration Route ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;

    // Basic validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: 'Please enter all required fields.',
        messageTa: 'தேவையான அனைத்து புலங்களையும் உள்ளிடவும்.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'Registration failed: This email is already registered.',
        messageTa: 'பதிவு தோல்வியடைந்தது: இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது.'
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user document
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword, // Store the hashed password
      phoneNumber: phoneNumber || '' // Store phoneNumber if provided
    });

    // Save the user to MongoDB
    await newUser.save();

    // Generate JWT (optional, but good for auto-login after registration)
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('User registered successfully with ID:', newUser._id);
    res.status(201).json({
      message: 'User registered successfully!',
      messageTa: 'பயனர் வெற்றிகரமாக பதிவு செய்யப்பட்டார்!',
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber
      }
    });

  } catch (error) {
    console.error('Error during user registration:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors,
        messageTa: 'சரிபார்ப்பு தோல்வியடைந்தது'
      });
    }
    res.status(500).json({
      message: 'Internal Server Error',
      messageTa: 'உள் சேவையக பிழை'
    });
  }
});
// --- NEW: User Login Route ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please enter both email and password.',
        messageTa: 'மின்னஞ்சல் மற்றும் கடவுச்சொல் இரண்டையும் உள்ளிடவும்.'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials. Please try again.',
        messageTa: 'தவறான உள்நுழைவு விவரங்கள். மீண்டும் முயற்சிக்கவும்.'
      });
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials. Please try again.',
        messageTa: 'தவறான உள்நுழைவு விவரங்கள். மீண்டும் முயற்சிக்கவும்.'
      });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('User logged in successfully:', user.email);
    res.status(200).json({
      message: 'Logged in successfully!',
      messageTa: 'வெற்றிகரமாக உள்நுழைந்தீர்கள்!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });

  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      messageTa: 'உள் சேவையக பிழை'
    });
  }
});
// app.get('/api/auth/me', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user).select('-password'); // Don't return password
//     res.json(user);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });
app.listen(PORT, () => {
  console.log(`Node.js API listening on http://localhost:${PORT}`);
  console.log(`Connected to MongoDB: ${MONGODB_URI.split('@')[0]}@... (Masked for security)`);
});