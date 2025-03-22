const Doctor = require('../models/Doctor');
const User = require('../models/User');

const createDoctor = async (req, res) => {
  console.log('Create doctor request received:', req.body, 'File:', req.file); // Debug
  const user = req.user;

  try {
    const doctorData = { ...req.body, user: user._id };
    
    // Handle file upload
    if (req.file) {
      // If using Cloudinary, the file path will be in req.file.path
      doctorData.picture = req.file.path; // Cloudinary URL
      console.log('Image uploaded to Cloudinary:', req.file.path); // Debug
    } else {
      console.log('No file uploaded in createDoctor'); // Debug
    }
    
    // Handle schedule data
    if (doctorData.schedule) {
      doctorData.schedule = typeof doctorData.schedule === 'string'
        ? JSON.parse(doctorData.schedule)
        : doctorData.schedule;
    }
    
    const doctor = await Doctor.create(doctorData);
    console.log('Doctor created:', doctor); // Debug full doctor object
    res.status(201).json(doctor);
  } catch (error) {
    console.error('Create doctor error:', error.message, error.stack); // Debug
    res.status(500).json({ message: 'Failed to create doctor', error: error.message });
  }
};

const getDoctor = async (req, res) => {
  console.log('Get doctor request received for ID:', req.params.id); // Debug
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      console.log('Doctor not found for ID:', req.params.id); // Debug
      return res.status(404).json({ message: 'Doctor not found' });
    }
    console.log('Doctor retrieved:', doctor._id); // Debug
    res.json(doctor);
  } catch (error) {
    console.error('Get doctor error:', error.message, error.stack); // Debug
    res.status(500).json({ message: 'Failed to get doctor', error: error.message });
  }
};

const updateDoctor = async (req, res) => {
  console.log('Update doctor request received:', req.params.id, req.body, 'File:', req.file); // Debug
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      console.log('Doctor not found for update:', req.params.id); // Debug
      return res.status(404).json({ message: 'Doctor not found' });
    }
    if (doctor.user.toString() !== req.user._id.toString()) {
      console.log('Unauthorized update attempt by user:', req.user._id); // Debug
      return res.status(403).json({ message: 'Not authorized to update this doctor' });
    }
    const updatedData = { ...req.body };
    
    // Handle file upload
    if (req.file) {
      // If using Cloudinary, the file path will be in req.file.path
      updatedData.picture = req.file.path; // Cloudinary URL
      console.log('Image updated on Cloudinary:', req.file.path); // Debug
    } else if (req.body.existingPictureUrl) {
      // If no new picture is uploaded but there's an existing one, keep it
      updatedData.picture = req.body.existingPictureUrl;
      console.log('Keeping existing picture URL:', req.body.existingPictureUrl); // Debug
    }
    
    // Handle schedule data
    if (updatedData.schedule) {
      updatedData.schedule = typeof updatedData.schedule === 'string'
        ? JSON.parse(updatedData.schedule)
        : updatedData.schedule;
    }
    
    // Remove the existingPictureUrl field as it's not part of the model
    delete updatedData.existingPictureUrl;
    
    // Update the doctor document
    Object.assign(doctor, updatedData);
    await doctor.save();
    
    console.log('Doctor updated:', doctor); // Debug full doctor object
    res.json(doctor);
  } catch (error) {
    console.error('Update doctor error:', error.message, error.stack); // Debug
    res.status(500).json({ message: 'Failed to update doctor', error: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  console.log('Delete doctor request received:', req.params.id); // Debug
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      console.log('Doctor not found for deletion:', req.params.id); // Debug
      return res.status(404).json({ message: 'Doctor not found' });
    }
    if (doctor.user.toString() !== req.user._id.toString()) {
      console.log('Unauthorized deletion attempt by user:', req.user._id); // Debug
      return res.status(403).json({ message: 'Not authorized to delete this doctor' });
    }
    await Doctor.deleteOne({ _id: req.params.id });
    console.log('Doctor deleted:', req.params.id); // Debug
    res.json({ message: 'Doctor deleted' });
  } catch (error) {
    console.error('Delete doctor error:', error.message, error.stack); // Debug
    res.status(500).json({ message: 'Failed to delete doctor', error: error.message });
  }
};

const getDoctorsByUser = async (req, res) => {
  console.log('Get doctors by user request received', req.params, req.query); // Debug
  try {
    let query = {};
    
    // Check for userId in route params (for /by-user/:userId)
    if (req.params.userId) {
      query.user = req.params.userId;
      console.log('Using userId from params:', req.params.userId); // Debug
    }
    // Check for user query param (for /?user=xyz)
    else if (req.query.user) {
      query.user = req.query.user;
      console.log('Using userId from query:', req.query.user); // Debug
    }
    // Use authenticated user (for protected routes)
    else if (req.user) {
      query.user = req.user._id;
      console.log('Using authenticated userId:', req.user._id); // Debug
    }
    
    console.log('Final query:', query); // Debug
    const doctors = await Doctor.find(query);
    
    if (doctors.length === 0) {
      console.log('No doctors found for query:', query); // Debug
      
      // If we're looking for a specific user's doctor profile, return the first one
      if (req.params.userId || req.query.user) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }
    }
    
    // If we're looking for a specific user's doctor profile via /by-user/:userId, return the first one
    if (req.params.userId && doctors.length > 0) {
      console.log('Returning single doctor for user:', req.params.userId); // Debug
      return res.json(doctors[0]);
    }
    
    console.log('Doctors retrieved:', doctors.length); // Debug
    res.json(doctors);
  } catch (error) {
    console.error('Get doctors by user error:', error.message, error.stack); // Debug
    res.status(500).json({ message: 'Failed to get doctors', error: error.message });
  }
};

// New function to get all doctors (public access)
const getAllDoctors = async (req, res) => {
  console.log('Get all doctors request received'); // Debug
  try {
    const doctors = await Doctor.find({}).populate('user', 'name email');
    console.log('All doctors retrieved:', doctors.length); // Debug
    res.json(doctors);
  } catch (error) {
    console.error('Get all doctors error:', error.message, error.stack); // Debug
    res.status(500).json({ message: 'Failed to get doctors', error: error.message });
  }
};

module.exports = {
  createDoctor,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsByUser,
  getAllDoctors, // Export new function
};