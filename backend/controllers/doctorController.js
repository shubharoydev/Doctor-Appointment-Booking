const Doctor = require('../models/Doctor');
const User = require('../models/User');
const redisClient = require('../config/redis');

// Create doctor
const createDoctor = async (req, res) => {
  console.log('Create doctor request received:', {
    body: req.body,
    file: req.file,
    user: req.user._id,
  });
  try {
    const doctorData = { ...req.body, user: req.user._id };
    if (req.file) {
      doctorData.picture = req.file.path;
      console.log('Image uploaded to Cloudinary:', req.file.path);
    } else {
      console.log('No file uploaded in createDoctor');
    }
    if (doctorData.schedule) {
      doctorData.schedule = typeof doctorData.schedule === 'string'
        ? JSON.parse(doctorData.schedule)
        : doctorData.schedule;
      console.log('Parsed schedule:', doctorData.schedule);
    }
    const doctor = await Doctor.create(doctorData);
    console.log('Doctor created successfully:', doctor);
    res.status(201).json(doctor);
  } catch (error) {
    console.error('Create doctor error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Failed to create doctor', error: error.message });
  }
};

// Get doctor by ID
const getDoctor = async (req, res) => {
  console.log('Get doctor request received for ID:', req.params.id);
  try {
    const doctor = await Doctor.findById(req.params.id).lean();
    if (!doctor) {
      console.log('Doctor not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Doctor not found' });
    }
    console.log('Doctor retrieved successfully:', doctor);
    res.status(200).json(doctor);
  } catch (error) {
    console.error('Get doctor error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Failed to get doctor', error: error.message });
  }
};

// Update doctor
const updateDoctor = async (req, res) => {
  console.log('Update doctor request received:', {
    id: req.params.id,
    body: req.body,
    file: req.file,
    user: req.user._id,
  });
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      console.log('Doctor not found for update:', req.params.id);
      return res.status(404).json({ message: 'Doctor not found' });
    }
    if (doctor.user.toString() !== req.user._id.toString()) {
      console.log('Unauthorized update attempt by user:', req.user._id);
      return res.status(403).json({ message: 'Not authorized to update this doctor' });
    }
    const updatedData = { ...req.body };
    if (req.file) {
      updatedData.picture = req.file.path;
      console.log('Image updated on Cloudinary:', req.file.path);
    } else if (req.body.existingPictureUrl) {
      updatedData.picture = req.body.existingPictureUrl;
      console.log('Keeping existing picture URL:', req.body.existingPictureUrl);
    }
    if (updatedData.schedule) {
      updatedData.schedule = typeof updatedData.schedule === 'string'
        ? JSON.parse(updatedData.schedule)
        : updatedData.schedule;
      console.log('Parsed schedule for update:', updatedData.schedule);
    }
    delete updatedData.existingPictureUrl;
    Object.assign(doctor, updatedData);
    await doctor.save();
    console.log('Doctor updated successfully:', doctor);
    res.status(200).json(doctor);
  } catch (error) {
    console.error('Update doctor error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Failed to update doctor', error: error.message });
  }
};

// Delete doctor
const deleteDoctor = async (req, res) => {
  console.log('Delete doctor request received:', req.params.id);
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      console.log('Doctor not found for deletion:', req.params.id);
      return res.status(404).json({ message: 'Doctor not found' });
    }
    if (doctor.user.toString() !== req.user._id.toString()) {
      console.log('Unauthorized deletion attempt by user:', req.user._id);
      return res.status(403).json({ message: 'Not authorized to delete this doctor' });
    }
    await Doctor.deleteOne({ _id: req.params.id });
    console.log('Doctor deleted successfully:', req.params.id);
    res.status(200).json({ message: 'Doctor deleted' });
  } catch (error) {
    console.error('Delete doctor error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Failed to delete doctor', error: error.message });
  }
};

// Get doctors by user
const getDoctorsByUser = async (req, res) => {
  console.log('Get doctors by user request received:', {
    params: req.params,
    query: req.query,
    user: req.user?._id,
  });
  try {
    let query = {};
    if (req.params.userId) {
      query.user = req.params.userId;
      console.log('Using userId from params:', req.params.userId);
    } else if (req.query.user) {
      query.user = req.query.user;
      console.log('Using userId from query:', req.query.user);
    } else if (req.user) {
      query.user = req.user._id;
      console.log('Using authenticated userId:', req.user._id);
    }
    const doctors = await Doctor.find(query).lean();
    if (doctors.length === 0) {
      console.log('No doctors found for query:', query);
      if (req.params.userId || req.query.user) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }
    }
    if (req.params.userId && doctors.length > 0) {
      console.log('Returning single doctor for user:', req.params.userId, doctors[0]);
      return res.status(200).json(doctors[0]);
    }
    console.log('Doctors retrieved successfully:', doctors);
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Get doctors by user error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Failed to get doctors', error: error.message });
  }
};

// Get all doctors (public access with caching)
const getAllDoctors = async (req, res) => {
  console.log('Get all doctors request received');
  const cacheKey = 'doctors:all';

  try {
    // Check Redis cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      console.log('Serving doctors from Redis cache:', parsedData);
      return res.status(200).json(parsedData);
    }

    // Fetch from MongoDB
    const doctors = await Doctor.find({}).lean();
    console.log('Fetched doctors from MongoDB:', doctors);

    // Cache in Redis with 1-hour TTL
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(doctors));
    console.log('Cached doctors in Redis:', doctors);

    res.status(200).json(doctors);
  } catch (error) {
    console.error('Get all doctors error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Failed to get doctors', error: error.message });
  }
};

module.exports = {
  createDoctor,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsByUser,
  getAllDoctors,
};