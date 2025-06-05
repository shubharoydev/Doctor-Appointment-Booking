const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const redis = require('../config/redis');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const CACHE_TTL = 3600; // 1 hour in seconds

const resolvers = {
  Query: {
    getAllDoctors: async () => {
      try {
        // Try to get from Redis first
        const cachedDoctors = await redis.get('all_doctors').catch(err => {
          console.error('Redis error in getAllDoctors:', err);
          return null;
        });
        if (cachedDoctors) {
          return JSON.parse(cachedDoctors);
        }

        // If not in Redis, fetch from database
        const doctors = await Doctor.find({})
          .select('_id user name email contactNumber experienceYears specialist education registrationNo language fees about picture schedule qualification gender location achievement')
          .lean();

        // Format data for GraphQL
        const formattedDoctors = doctors.map(doctor => ({
          ...doctor,
          _id: doctor._id.toString(),
          user: doctor.user ? doctor.user.toString() : null,
          schedule: doctor.schedule
            ? doctor.schedule.map(schedule => ({
                ...schedule,
                _id: schedule._id.toString(),
                places: schedule.places
                  ? schedule.places.map(place => ({
                      ...place,
                      _id: place._id.toString(),
                    }))
                  : [],
              }))
            : [],
        }));

        // Cache the result in Redis
        await redis.setex('all_doctors', CACHE_TTL, JSON.stringify(formattedDoctors)).catch(err => {
          console.error('Redis cache set error in getAllDoctors:', err);
        });
        
        return formattedDoctors;
      } catch (error) {
        console.error('Error in getAllDoctors:', error);
        throw new Error('Failed to fetch doctors');
      }
    },

    getDoctorById: async (_, { id }) => {
      try {
        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
          throw new Error('Invalid doctor ID format');
        }

        // Try to get from Redis first
        const cachedDoctor = await redis.get(`doctor:${id}`).catch(err => {
          console.error('Redis error in getDoctorById:', err);
          return null;
        });
        if (cachedDoctor) {
          return JSON.parse(cachedDoctor);
        }

        // If not in Redis, fetch from database
        const doctor = await Doctor.findById(id)
          .select('_id user name email contactNumber experienceYears specialist education registrationNo language fees about picture schedule qualification gender location achievement')
          .lean();
        if (!doctor) {
          throw new Error('Doctor not found');
        }

        // Format data for GraphQL
        const formattedDoctor = {
          ...doctor,
          _id: doctor._id.toString(),
          user: doctor.user ? doctor.user.toString() : null,
          schedule: doctor.schedule
            ? doctor.schedule.map(schedule => ({
                ...schedule,
                _id: schedule._id.toString(),
                places: schedule.places
                  ? schedule.places.map(place => ({
                      ...place,
                      _id: place._id.toString(),
                    }))
                  : [],
              }))
            : [],
        };

        // Cache the result in Redis
        await redis.setex(`doctor:${id}`, CACHE_TTL, JSON.stringify(formattedDoctor)).catch(err => {
          console.error('Redis cache set error in getDoctorById:', err);
        });
        
        return formattedDoctor;
      } catch (error) {
        console.error('Error in getDoctorById:', error);
        throw new Error(`Failed to fetch doctor details: ${error.message}`);
      }
    },

    getDoctorAppointments: async (_, { doctorId }) => {
      try {
        // Validate ObjectId format
        if (!doctorId.match(/^[0-9a-fA-F]{24}$/)) {
          throw new Error('Invalid doctor ID format');
        }

        // Try to get from Redis first
        const cachedAppointments = await redis.get(`appointments:${doctorId}`).catch(err => {
          console.error('Redis error in getDoctorAppointments:', err);
          return null;
        });
        if (cachedAppointments) {
          return JSON.parse(cachedAppointments);
        }

        // If not in Redis, fetch from database
        const appointments = await Appointment.find({ doctor: doctorId }) // Changed from doctorId to doctor
          .sort({ bookedAt: -1 })
          .lean();

        // Format data for GraphQL
        const formattedAppointments = appointments.map(appointment => ({
          ...appointment,
          _id: appointment._id.toString(),
          user: appointment.user ? appointment.user.toString() : null,
          doctor: appointment.doctor ? appointment.doctor.toString() : null,
          timeInterval: appointment.timeInterval || {},
          bookedAt: appointment.bookedAt ? appointment.bookedAt.toISOString() : new Date().toISOString(),
        }));

        // Cache the result in Redis
        await redis.setex(`appointments:${doctorId}`, CACHE_TTL, JSON.stringify(formattedAppointments)).catch(err => {
          console.error('Redis cache set error in getDoctorAppointments:', err);
        });
        
        return formattedAppointments;
      } catch (error) {
        console.error('Error in getDoctorAppointments:', error);
        throw new Error('Failed to fetch appointments');
      }
    },
  },

  Mutation: {
    loginDoctor: async (_, { email, password }) => {
      try {
        const doctor = await Doctor.findOne({ email })
          .select('_id user name email contactNumber experienceYears specialist education registrationNo language fees about picture schedule qualification gender location achievement password')
          .lean();
        if (!doctor) {
          throw new Error('Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(password, doctor.password);
        if (!isValidPassword) {
          throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
          { id: doctor._id, role: 'doctor' },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );

        // Format doctor data for response and caching
        const doctorData = {
          ...doctor,
          _id: doctor._id.toString(),
          user: doctor.user ? doctor.user.toString() : null,
          schedule: doctor.schedule
            ? doctor.schedule.map(schedule => ({
                ...schedule,
                _id: schedule._id.toString(),
                places: schedule.places
                  ? schedule.places.map(place => ({
                      ...place,
                      _id: place._id.toString(),
                    }))
                  : [],
              }))
            : [],
        };
        delete doctorData.password;

        // Cache doctor data in Redis
        await redis.setex(`doctor:${doctor._id}`, CACHE_TTL, JSON.stringify(doctorData)).catch(err => {
          console.error('Redis cache set error in loginDoctor:', err);
        });

        return {
          token,
          doctor: doctorData,
        };
      } catch (error) {
        console.error('Error in loginDoctor:', error);
        throw new Error('Login failed');
      }
    },
  },
};

module.exports = resolvers;