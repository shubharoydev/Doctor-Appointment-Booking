const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { graphql } = require('graphql');
const { schema, root } = require('../graphql/doctorSchema');
const redisClientPromise = require('../config/redis');
const { Types: { ObjectId } } = require('mongoose'); // Import ObjectId

const CACHE_TTL = 3600; // 1 hour in seconds
const CACHE_CHANNEL = 'doctor_cache_updates'; // Redis Pub/Sub channel

// Helper function to publish cache invalidation events
const publishCacheInvalidation = async (redisClient, key) => {
  try {
    await redisClient.publish(CACHE_CHANNEL, JSON.stringify({ key }));
    //console.log(`Published cache invalidation for key: ${key}`);
  } catch (error) {
    console.error('Error publishing cache invalidation:', error.message);
  }
};



// Create doctor
const createDoctor = async (req, res) => {
  try {
    const redis = await redisClientPromise;
    const doctorData = { ...req.body, user: req.user._id };
    
    if (req.file) {
      doctorData.picture = req.file.path;
      //console.log(`Image uploaded to Cloudinary: ${req.file.path}`);
    }
    
    if (doctorData.schedule) {
      doctorData.schedule = typeof doctorData.schedule === 'string' 
        ? JSON.parse(doctorData.schedule) 
        : doctorData.schedule;
      //console.log(`Parsed schedule: ${JSON.stringify(doctorData.schedule)}`);
    }

    const doctor = await Doctor.create(doctorData);
    //console.log('Doctor created successfully:', doctor._id);

    // Cache the new doctor's data
    const cacheKey = `doctor:${doctor._id}`;
    const partialKey = `all_doctors:${doctor._id}:partial`;
    
    try {
      // Cache full doctor data
      await redis.set(cacheKey, JSON.stringify(doctor), { EX: CACHE_TTL });
      //console.log(`Cached full data for key: ${cacheKey}`);
      
      // Cache partial data for getAllDoctors
      const partialData = {
        _id: doctor._id,
        name: doctor.name,
        experienceYears: doctor.experienceYears,
        specialist: doctor.specialist,
        fees: doctor.fees,
        picture: doctor.picture
      };
      await redis.set(partialKey, JSON.stringify(partialData), { EX: CACHE_TTL });
      //console.log(`Cached partial data for key: ${partialKey}`);
      
      // Invalidate all doctors list caches
      const keysToClear = ['doctors', 'all_doctors'];
      await redis.del(keysToClear);
      for (const key of keysToClear) {
        await publishCacheInvalidation(redis, key);
      }
      //console.log('Invalidated all doctors list caches');
    } catch (cacheError) {
      console.error('Cache operation error:', cacheError.message);
      // Continue despite cache errors
    }
    
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
    const redis = await redisClientPromise;
    const doctorId = req.params.id;
    
    // Try to get full doctor data from cache first
    const cacheKey = `doctors:${doctorId}`;
    const cachedDoctor = await redis.get(cacheKey).catch(err => {
      console.error('Redis error in getDoctor:', err);
      return null;
    });

    if (cachedDoctor) {
      //console.log(`Cache hit for doctor ${doctorId}`);
      return res.status(200).json(JSON.parse(cachedDoctor));
    }

    //console.log(`Cache miss for doctor ${doctorId}, fetching from database`);

    // If not in cache, fetch from database
    const doctor = await Doctor.findById(doctorId).lean();
    if (!doctor) {
      //console.log(`Doctor not found for ID: ${doctorId}`);
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Cache the full doctor data for future requests
    try {
      await redis.set(cacheKey, JSON.stringify(doctor), {
        EX: 3600 // 1 hour
      });
      //console.log(`Cached full doctor data for ID: ${doctorId}`);
    } catch (cacheError) {
      console.error('Error caching doctor data:', cacheError);
      // Continue even if caching fails
    }

    //console.log(`Doctor retrieved: ${doctor._id}`);
    res.status(200).json(doctor);
  } catch (error) {
    console.error('Get doctor error:', {
      message: error.message,
      stack: error.stack,
      doctorId: req.params.id
    });
    res.status(500).json({ 
      message: 'Failed to get doctor', 
      error: error.message 
    });
  }
};

// updateDoctor function
const updateDoctor = async (req, res) => {
  try {
    const redis = await redisClientPromise;
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      //console.log(`Doctor not found for update: ${req.params.id}`);
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    if (doctor.user.toString() !== req.user._id.toString()) {
      //console.log(`Unauthorized update attempt by user: ${req.user._id}`);
      return res.status(403).json({ message: 'Not authorized to update this doctor' });
    }

    const updatedData = { ...req.body };
    if (req.file) {
      updatedData.picture = req.file.path;
      //console.log(`Image updated on Cloudinary: ${req.file.path}`);
    } else if (req.body.existingPictureUrl) {
      updatedData.picture = req.body.existingPictureUrl;
      //console.log(`Keeping existing picture URL: ${req.body.existingPictureUrl}`);
    }
    
    if (updatedData.schedule) {
      updatedData.schedule = typeof updatedData.schedule === 'string' 
        ? JSON.parse(updatedData.schedule) 
        : updatedData.schedule;
      //console.log(`Parsed schedule for update: ${JSON.stringify(updatedData.schedule)}`);
    }
    
    delete updatedData.existingPictureUrl;
    Object.assign(doctor, updatedData);
    await doctor.save();
    //console.log(`Doctor updated: ${doctor._id}`);
    
    // Update cache
    const cacheKey = `doctor:${doctor._id}`;
    const partialKey = `all_doctors:${doctor._id}:partial`;
    
    try {
      // Update full cache
      await redis.set(cacheKey, JSON.stringify(doctor), { EX: CACHE_TTL });
      //console.log(`Updated cache for key: ${cacheKey}`);
      
      // Update partial cache
      const partialData = {
        _id: doctor._id,
        name: doctor.name,
        experienceYears: doctor.experienceYears,
        specialist: doctor.specialist,
        fees: doctor.fees,
        picture: doctor.picture
      };
      await redis.set(partialKey, JSON.stringify(partialData), { EX: CACHE_TTL });
      //console.log(`Updated partial cache for key: ${partialKey}`);
      
      // Invalidate all doctors list caches
      const keysToClear = ['doctors', 'all_doctors'];
      await redis.del(keysToClear);
      for (const key of keysToClear) {
        await publishCacheInvalidation(redis, key);
      }
      //console.log('Invalidated all doctors list caches');
    } catch (cacheError) {
      console.error('Cache operation error:', cacheError.message);
      // Continue despite cache errors
    }
    
    res.status(200).json(doctor);
  } catch (error) {
    console.error('Update doctor error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Failed to update doctor', error: error.message });
  }
};

// Subscribe to cache invalidation events (call during app initialization)
const subscribeToCacheUpdates = async () => {
  const redis = await redisClientPromise;
  const subscriber = redis.duplicate(); // subscriber connection

  await subscriber.connect(); // make sure it's connected

  try {
    await subscriber.subscribe(CACHE_CHANNEL, async (message) => {
      const { key } = JSON.parse(message);
      try {
        // Use the original redis client (not subscriber) to delete
        await redis.del(key);
        //console.log(`Cache invalidated for key: ${key} via Pub/Sub`);
      } catch (error) {
        console.error(`Error invalidating cache for key ${key}:`, error.message);
      }
    });

   // console.log(`Subscribed to Redis channel: ${CACHE_CHANNEL}`);
  } catch (error) {
    console.error('Error subscribing to cache updates:', error.message);
  }
};


// Call this during app initialization
subscribeToCacheUpdates();



// Delete doctor
const deleteDoctor = async (req, res) => {
  try {
    // Validate ID
    if (!ObjectId.isValid(req.params.id)) {
      //console.log(`Invalid doctor ID: ${req.params.id}`);
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      //console.log(`Doctor not found for deletion: ${req.params.id}`);
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (doctor.user.toString() !== req.user._id.toString()) {
      //console.log(`Unauthorized deletion attempt by user: ${req.user._id}`);
      return res.status(403).json({ message: 'Not authorized to delete this doctor' });
    }
   // After successful deletion
const redis = await redisClientPromise;

const cacheKey = `doctor:${req.params.id}`;
const partialKey = `all_doctors:${req.params.id}:partial`;
const keysToClear = ['doctors', 'all_doctors', cacheKey, partialKey];

await redis.del(keysToClear); // Optional: Clear locally
for (const key of keysToClear) {
  await publishCacheInvalidation(redis, key); // Notify all instances
}

    await Doctor.deleteOne({ _id: req.params.id });
    //console.log(`Doctor deleted: ${req.params.id}`);
    res.set('Cache-Control', 'no-store');
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
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: No access token provided' });
    }

    const doctor = await Doctor.findOne({ user: req.user._id }).lean();

    if (!doctor) {
      //console.log(`No doctor found for user: ${req.user._id}`);
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    //console.log(`Doctor found for user: ${req.user._id}`);
    res.status(200).json(doctor);
  } catch (error) {
    console.error('Error fetching doctor by access token:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Failed to get doctor', error: error.message });
  }
};

// Get all doctors (using GraphQL)

// Get all doctors (using GraphQL)
const getAllDoctors = async (req, res) => {
  try {
    const redis = await redisClientPromise;
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
    
    // Execute GraphQL query
    const result = await graphql({
      schema,
      source: query,
      rootValue: root,
    });
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return res.status(500).json({ 
        message: 'GraphQL query failed', 
        errors: result.errors 
      });
    }
    
    const doctors = result.data.doctors;
    //console.log(`Fetched ${doctors.length} doctors from database`);
    
    // The response will be cached by the middleware
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
  subscribeToCacheUpdates,
};