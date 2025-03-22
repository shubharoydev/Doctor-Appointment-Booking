const UserProfile = require('../models/UserProfile');

const createUserProfile = async (req, res) => {
  console.log('Create user profile request received:', req.body, 'File:', req.file); // Debug
  const user = req.user;

  try {
    const profileData = { ...req.body, user: user._id };
    
    // Handle file upload
    if (req.file) {
      // If using Cloudinary, the file path will be in req.file.path
      profileData.picture = req.file.path; // Cloudinary URL
      console.log('Image uploaded to Cloudinary:', req.file.path); // Debug
    } else {
      console.log('No file uploaded in createUserProfile'); // Debug
    }
    
    const profile = await UserProfile.create(profileData);
    console.log('User profile created:', profile._id); // Debug
    res.status(201).json(profile);
  } catch (error) {
    console.error('Create user profile error:', error.message, error.stack); // Debug
    res.status(500).json({ message: 'Failed to create user profile', error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  // Check if we're getting a specific profile by ID
  const profileId = req.params.id;
  
  console.log('Get user profile request received for:', profileId || req.user._id); // Debug
  
  try {
    let profile;
    
    if (profileId) {
      profile = await UserProfile.findById(profileId);
    } else {
      profile = await UserProfile.findOne({ user: req.user._id });
    }
    
    if (!profile) {
      console.log('User profile not found'); // Debug
      return res.status(404).json({ message: 'User profile not found' });
    }
    
    console.log('User profile retrieved:', profile._id); // Debug
    res.json(profile);
  } catch (error) {
    console.error('Get user profile error:', error.message, error.stack); // Debug
    res.status(500).json({ message: 'Failed to get user profile', error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  console.log('Update user profile request received:', req.body, 'File:', req.file); // Debug
  
  // Check if we're updating a specific profile by ID
  const profileId = req.params.id;
  const user = req.user;

  try {
    let profile;
    
    if (profileId) {
      profile = await UserProfile.findById(profileId);
    } else {
      profile = await UserProfile.findOne({ user: user._id });
    }
    
    if (!profile) {
      console.log('User profile not found, creating new'); // Debug
      
      const profileData = { ...req.body, user: user._id };
      
      // Handle file upload
      if (req.file) {
        // If using Cloudinary, the file path will be in req.file.path
        profileData.picture = req.file.path; // Cloudinary URL
        console.log('Image uploaded to Cloudinary:', req.file.path); // Debug
      }
      
      profile = await UserProfile.create(profileData);
    } else {
      const updatedData = { ...req.body };
      
      // Handle file upload
      if (req.file) {
        // If using Cloudinary, the file path will be in req.file.path
        updatedData.picture = req.file.path; // Update picture if new file is uploaded
        console.log('Image updated on Cloudinary:', req.file.path); // Debug
      } else if (req.body.existingPictureUrl) {
        // If no new picture is uploaded but there's an existing one, keep it
        updatedData.picture = req.body.existingPictureUrl;
        console.log('Keeping existing picture URL:', req.body.existingPictureUrl); // Debug
        delete updatedData.existingPictureUrl; // Remove from data to be saved
      }
      
      Object.assign(profile, updatedData);
      await profile.save();
    }
    
    console.log('User profile updated:', profile._id); // Debug
    res.json(profile);
  } catch (error) {
    console.error('Update user profile error:', error.message, error.stack); // Debug
    res.status(500).json({ message: 'Failed to update user profile', error: error.message });
  }
};

const deleteUserProfile = async (req, res) => {
  // Check if we're deleting a specific profile by ID
  const profileId = req.params.id;
  
  console.log('Delete user profile request received for:', profileId || req.user._id); // Debug
  
  try {
    let profile;
    
    if (profileId) {
      profile = await UserProfile.findByIdAndDelete(profileId);
    } else {
      profile = await UserProfile.findOneAndDelete({ user: req.user._id });
    }
    
    if (!profile) {
      console.log('User profile not found'); // Debug
      return res.status(404).json({ message: 'User profile not found' });
    }
    
    console.log('User profile deleted:', profile._id); // Debug
    res.json({ message: 'User profile deleted' });
  } catch (error) {
    console.error('Delete user profile error:', error.message, error.stack); // Debug
    res.status(500).json({ message: 'Failed to delete user profile', error: error.message });
  }
};

module.exports = {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};