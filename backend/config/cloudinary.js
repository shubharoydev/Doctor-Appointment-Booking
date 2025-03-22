const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log('Cloudinary configured'); // Debug
// console.log('Cloudinary config:', cloudinary.config()); // Debug
// console.log('process.env.CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME); // Debug

module.exports = { cloudinary };