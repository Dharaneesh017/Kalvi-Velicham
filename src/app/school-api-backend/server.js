require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

// --- Define Mongoose Schema and Model ---
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


app.get('/api/schools', async (req, res) => {
  try {
    const schools = await School.find({}); 
    res.status(200).json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Node.js API listening on http://localhost:${PORT}`);
  console.log(`Connected to MongoDB: ${MONGODB_URI.split('@')[0]}@... (Masked for security)`);
});