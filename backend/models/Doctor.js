const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  place: { type: String, required: true },
  timeInterval: {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  maxPatients: { type: Number, required: true }, // New field for max patients
});

const scheduleSchema = new mongoose.Schema({
  day: { type: String, required: true },
  places: [placeSchema],
});

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: {
    type: String,
    required: true,
    index: true // Index for name searches
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true // Index for email lookups
  },
  password: {
    type: String,
    required: true
  },
  contactNumber: { type: String,required: true },
  experienceYears: { type: Number, required: true },
  specialist: {
    type: String,
    required: true,
    index: true // Index for specialist filtering
  },
  education: { type: String, required: true },
  registrationNo: { type: String },
  language: { type: String, required: true },
  fees: {
    type: Number,
    required: true,
    index: true // Index for fee-based sorting/filtering
  },
  about: { type: String,required: true },
  picture: { type: String },
  schedule: [scheduleSchema],
  qualification: { type: String, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  location: { type: String, required: true },
  achievement: { type: String, required: true },
  experienceNumber: {
    type: Number,
    required: true,
    index: true // Index for experience-based queries
  },
}, {
  timestamps: true
});

// Compound index for common query patterns
doctorSchema.index({ specialist: 1, experienceNumber: -1 });
doctorSchema.index({ specialist: 1, fees: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);