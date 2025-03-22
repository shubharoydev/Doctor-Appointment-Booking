const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const transporter = require('../config/nodemailer');

const bookAppointment = async (req, res) => {
  const { doctorId, day, place, timeInterval } = req.body;
  const userId = req.user._id;

  console.log('Booking request received:', { doctorId, day, place, timeInterval, userId }); // Debug

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      console.log('Doctor not found:', doctorId); // Debug
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if user is a doctor (already handled in frontend, but confirm here)
    if (req.user.role === 'doctor') {
      console.log('Doctor attempted to book:', userId); // Debug
      return res.status(403).json({ message: 'Doctors cannot book appointments' });
    }

    // Find the specific schedule slot
    const scheduleDay = doctor.schedule.find((sched) => sched.day === day);
    if (!scheduleDay) {
      console.log('Invalid schedule day:', day); // Debug
      return res.status(400).json({ message: 'Invalid schedule day' });
    }

    const scheduleSlot = scheduleDay.places.find(
      (p) => p.place === place && 
             p.timeInterval.start === timeInterval.start && 
             p.timeInterval.end === timeInterval.end
    );

    if (!scheduleSlot) {
      console.log('Invalid schedule slot:', { day, place, timeInterval }); // Debug
      return res.status(400).json({ message: 'Invalid schedule slot' });
    }

    // Count existing bookings for this slot
    const existingBookings = await Appointment.countDocuments({
      doctor: doctorId,
      day,
      place,
      'timeInterval.start': timeInterval.start,
      'timeInterval.end': timeInterval.end,
      status: 'confirmed',
    });

    console.log('Existing bookings:', existingBookings, 'Max patients:', scheduleSlot.maxPatients); // Debug

    if (existingBookings >= scheduleSlot.maxPatients) {
      console.log('Booking full for slot:', { day, place, timeInterval }); // Debug
      return res.status(400).json({ message: 'This time slot is fully booked. Please select another time.' });
    }

    // Calculate appointment time based on patient count
    const startTime = timeInterval.start; // Format: "HH:MM"
    const endTime = timeInterval.end; // Format: "HH:MM"
    
    // Parse start and end times
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    // Calculate total minutes in the time slot
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const totalSlotMinutes = endTotalMinutes - startTotalMinutes;
    
    // Calculate minutes per patient
    const minutesPerPatient = Math.floor(totalSlotMinutes / scheduleSlot.maxPatients);
    
    // Calculate this patient's appointment time
    const patientNumber = existingBookings + 1;
    const patientMinutesOffset = (patientNumber - 1) * minutesPerPatient;
    const appointmentTotalMinutes = startTotalMinutes + patientMinutesOffset;
    
    // Convert back to HH:MM format
    const appointmentHour = Math.floor(appointmentTotalMinutes / 60);
    const appointmentMinute = appointmentTotalMinutes % 60;
    const appointmentTime = `${appointmentHour.toString().padStart(2, '0')}:${appointmentMinute.toString().padStart(2, '0')}`;
    
    console.log('Calculated appointment time:', appointmentTime); // Debug

    // Get today's date in DD/MM/YYYY format
    const today = new Date();
    const date = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    // Create the appointment
    const appointment = await Appointment.create({
      user: userId,
      doctor: doctorId,
      day,
      date,
      place,
      timeInterval: {
        start: appointmentTime, // Use the calculated time
        end: timeInterval.end
      },
      status: 'confirmed',
      bookedAt: new Date(),
    });

    // Get user details for email
    const user = await User.findById(userId);
    
    // Send confirmation email
    if (user && user.email) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Appointment Confirmation',
          html: `
            <h2>Appointment Confirmation</h2>
            <p>Dear ${user.name},</p>
            <p>Your appointment has been successfully booked with the following details:</p>
            <ul>
              <li><strong>Doctor:</strong> ${doctor.name}</li>
              <li><strong>Specialization:</strong> ${doctor.specialist}</li>
              <li><strong>Day:</strong> ${day}</li>
              <li><strong>Date:</strong> ${date}</li>
              <li><strong>Time:</strong> ${appointmentTime}</li>
              <li><strong>Place:</strong> ${place}</li>
            </ul>
            <p>Please arrive 10 minutes before your scheduled appointment time.</p>
            <p>Thank you for using our service!</p>
          `,
        });
        console.log('Appointment confirmation email sent to:', user.email); // Debug
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError); // Debug
        // Don't fail the appointment booking if email fails
      }
    }

    console.log('Appointment created:', appointment); // Debug
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Book appointment error:', error.message, error.stack); // Debug
    res.status(500).json({ message: 'Failed to book appointment', error: error.message });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.doctorId, status: 'confirmed' })
      .populate('user', 'name email')
      .sort('bookedAt');
    console.log('Doctor appointments retrieved:', appointments.length); // Debug
    res.json(appointments);
  } catch (error) {
    console.error('Get doctor appointments error:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to get appointments', error: error.message });
  }
};

const getUserAppointments = async (req, res) => {
  try {
    // Check if we're getting appointments for a specific user ID
    const userId = req.params.userId || req.user._id;
    
    console.log('Getting appointments for user:', userId); // Debug
    
    const appointments = await Appointment.find({ user: userId })
      .populate('doctor', 'name specialist')
      .sort('bookedAt');
    
    console.log('User appointments retrieved:', appointments.length, appointments); // Debug
    
    res.json(appointments);
  } catch (error) {
    console.error('Get user appointments error:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to get appointments', error: error.message });
  }
};

module.exports = { bookAppointment, getDoctorAppointments, getUserAppointments };