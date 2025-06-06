const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { graphql } = require('graphql');
const { schema, root } = require('../graphql/doctorSchema');
const redisClientPromise = require('../config/redis');

const CACHE_TTL = 3600; // 1 hour in seconds

// Create doctor
const createDoctor = async (req, res) => {
  try {
    const doctorData = { ...req.body, user: req.user._id };
    if (req.file) {
      doctorData.picture = req.file.path;
      console.log(`Image uploaded to Cloudinary: ${req.file.path}`);
    }
    if (doctorData.schedule) {
      doctorData.schedule = typeof doctorData.schedule === 'string'
        ? JSON.parse(doctorData.schedule)
        : doctorData.schedule;
      console.log(`Parsed schedule: ${JSON.stringify(doctorData.schedule)}`);
    }
    const doctor = await Doctor.create(doctorData);
    console.log('Doctor created successfully:', doctor._id);
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
  try {
    const redis = await redisClientPromise; // Await the Redis client
    const doctorId = req.params.id;
    const partialKey = `all_doctors:${doctorId}:partial`;

    // Try to get partial data from Redis
    const partialDoctor = await redis.get(partialKey).catch(err => {
      console.error('Redis error in getDoctor:', err);
      return null;
    });

    let doctor;
    if (partialDoctor) {
      const partialData = JSON.parse(partialDoctor);
      console.log(`Partial data found in Redis for doctor ${doctorId}`);

      const partialFields = ['_id', 'name', 'experienceYears', 'specialist', 'fees', 'picture'];
      const remainingFields = [
        'user', 'email', 'contactNumber', 'education', 'registrationNo', 'language',
        'about', 'schedule', 'qualification', 'gender', 'location', 'achievement'
      ].join(' ');

      doctor = await Doctor.findById(doctorId)
        .select(remainingFields)
        .lean();

      if (!doctor) {
        console.log(`Doctor not found in DB for ID: ${doctorId}`);
        return res.status(404).json({ message: 'Doctor not found' });
      }

      doctor = { ...partialData, ...doctor };
    } else {
      console.log(`No partial data in Redis for doctor ${doctorId}, fetching all from DB`);
      doctor = await Doctor.findById(doctorId).lean();
      if (!doctor) {
        console.log(`Doctor not found for ID: ${doctorId}`);
        return res.status(404).json({ message: 'Doctor not found' });
      }
    }

    console.log(`Doctor retrieved: ${doctor._id}`);
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
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      console.log(`Doctor not found for update: ${req.params.id}`);
      return res.status(404).json({ message: 'Doctor not found' });
    }
    if (doctor.user.toString() !== req.user._id.toString()) {
      console.log(`Unauthorized update attempt by user: ${req.user._id}`);
      return res.status(403).json({ message: 'Not authorized to update this doctor' });
    }
    const updatedData = { ...req.body };
    if (req.file) {
      updatedData.picture = req.file.path;
      console.log(`Image updated on Cloudinary: ${req.file.path}`);
    } else if (req.body.existingPictureUrl) {
      updatedData.picture = req.body.existingPictureUrl;
      console.log(`Keeping existing picture URL: ${req.body.existingPictureUrl}`);
    }
    if (updatedData.schedule) {
      updatedData.schedule = typeof updatedData.schedule === 'string'
        ? JSON.parse(updatedData.schedule)
        : updatedData.schedule;
      console.log(`Parsed schedule for update: ${JSON.stringify(updatedData.schedule)}`);
    }
    delete updatedData.existingPictureUrl;
    Object.assign(doctor, updatedData);
    await doctor.save();
    console.log(`Doctor updated: ${doctor._id}`);
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
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      console.log(`Doctor not found for deletion: ${req.params.id}`);
      return res.status(404).json({ message: 'Doctor not found' });
    }
    if (doctor.user.toString() !== req.user._id.toString()) {
      console.log(`Unauthorized deletion attempt by user: ${req.user._id}`);
      return res.status(403).json({ message: 'Not authorized to delete this doctor' });
    }
    await Doctor.deleteOne({ _id: req.params.id });
    console.log(`Doctor deleted: ${req.params.id}`);
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
  try {
    let query = {};
    if (req.params.userId) {
      query.user = req.params.userId;
      console.log(`Using userId from params: ${req.params.userId}`);
    } else if (req.query.user) {
      query.user = req.query.user;
      console.log(`Using userId from query: ${req.query.user}`);
    } else if (req.user) {
      query.user = req.user._id;
      console.log(`Using authenticated userId: ${req.user._id}`);
    }

    const doctors = await Doctor.find(query)
      .select('name experienceNumber specialist fees picture')
      .lean();
    if (doctors.length === 0) {
      console.log(`No doctors found for query: ${JSON.stringify(query)}`);
      if (req.params.userId || req.query.user) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }
    }

    if (req.params.userId && doctors.length > 0) {
      console.log(`Returning single doctor for user: ${req.params.userId}`);
      return res.status(200).json(doctors[0]);
    }
    console.log(`Doctors retrieved: ${doctors.length} found`);
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Get doctors by user error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Failed to get doctors', error: error.message });
  }
};

// Get all doctors (using GraphQL)

// Get all doctors (using GraphQL)
const getAllDoctors = async (req, res) => {
  try {
    const redis = await redisClientPromise; // Await the Redis client
    const query = `
      query {
        doctors {
          _id
          name
          experienceYears
          specialist
          fees
          picture
        }
      }
    `;
    const result = await graphql({
      schema,
      source: query,
      rootValue: root,
    });
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return res.status(500).json({ message: 'GraphQL query failed', errors: result.errors });
    }
    const doctors = result.data.doctors;

    // Cache each doctor's partial data under all_doctors:<doctorId>:partial
    for (const doctor of doctors) {
      const partialKey = `all_doctors:${doctor._id}:partial`;
      try {
        await redis.set(partialKey, JSON.stringify(doctor), {
          EX: CACHE_TTL, // Set expiration time (e.g., 3600 seconds)
        });
        console.log(`Cached partial data for doctor ${doctor._id} with key ${partialKey}`);
      } catch (err) {
        console.error(`Redis cache set error for ${partialKey}:`, err.message);
      }
    }

    console.log(`Fetched ${doctors.length} doctors via GraphQL`);
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Get all doctors error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Failed to get doctors', error: error.message });
  }
};
// Get doctor appointments
const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.params.id;
    
    // Verify if the doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Get all appointments for this doctor
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate('user', 'name email')
      .sort({ date: 1, 'timeInterval.start': 1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Get doctor appointments error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Failed to get doctor appointments', error: error.message });
  }
};

module.exports = {
  createDoctor,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsByUser,
  getAllDoctors,
  getDoctorAppointments,
};