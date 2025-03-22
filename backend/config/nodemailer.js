const nodemailer = require('nodemailer');

/**
 * Configure Nodemailer for sending emails via Gmail
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//  console.log('Nodemailer configured with:', {
//    user: process.env.EMAIL_USER,
//    pass: process.env.EMAIL_PASS ? '***' : 'Not set',
//  }); // Debug

module.exports = transporter;