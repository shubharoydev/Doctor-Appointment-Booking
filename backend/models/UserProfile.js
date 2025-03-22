const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String },
  bloodGroup: { type: String },
  contactNumber: { type: String },
  // gender:{type:string},
  // city:{type:string},
  // state:{type:string},
  // pincode:{type:string},
  // profilepicture:{type:string},
});

module.exports = mongoose.model('UserProfile', userProfileSchema);