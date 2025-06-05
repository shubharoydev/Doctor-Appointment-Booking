require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const { connectDB } = require('./config/db');
const cors = require('cors');
const startApolloServer = require('./graphql/app');

const app = express();

require('dotenv').config();

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://doctor-appointment-booking-frontend.onrender.com',
    'https://doctor-appointment-booking-bice.vercel.app'
   ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

connectDB();

const PORT = process.env.PORT || 5001; // Changed from 5000 to avoid port conflict
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));