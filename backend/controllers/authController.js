const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const transporter = require('../config/nodemailer');

// Utility to generate access token (15 minutes expiry)
const generateAccessToken = (id, role) => {
  //console.log(`Generating access token for user ID: ${id}, role: ${role}`); // Debug
  return jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' });
};

// Utility to generate refresh token (7 days expiry)
const generateRefreshToken = (id, role) => {
  //console.log(`Generating refresh token for user ID: ${id}, role: ${role}`); // Debug
  return jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Doctor Signup with email verification (requires code "123")
const doctorSignup = async (req, res) => {
 // console.log('Doctor signup request received:', req.body); // Debug
  const { name, email, password, code } = req.body;

  if (!name || !email || !password || code !== '123') {
    //console.log('Validation failed: Missing fields or invalid code'); // Debug
    return res.status(400).json({ message: 'All fields required and code must be 123' });
  }

  try {
    const userExists = await User.findOne({ email });
    //console.log('Checking if user exists:', userExists ? 'Yes' : 'No'); // Debug
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate a random 6-digit verification code
    const plainVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    //console.log(`Generated verification code: ${plainVerificationCode}`); // Debug

    // Hash the verification code
    const hashedVerificationCode = await bcrypt.hash(plainVerificationCode, 10);
    
    // Set verification code expiry (10 minutes from now)
    const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({ 
      name, 
      email, 
      password, 
      verificationCode: hashedVerificationCode, 
      verificationExpiry,
      role: 'doctor' 
    });
    //console.log('Doctor user created:', user._id); // Debug

    //console.log('Attempting to send email with credentials:', {
    //  from: process.env.EMAIL_USER,
    //  to: email,
    //}); // Debug

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email (Doctor)',
      text: `Your verification code is: ${plainVerificationCode}. This code will expire in 10 minutes.`,
    });
    //console.log('Email sent successfully:', info.messageId); // Debug

    res.status(201).json({ message: 'Doctor user created, please verify your email', userId: user._id });
  } catch (error) {
    console.error('Doctor signup error:', error.message, error.stack); // Debug
    res.status(500).json({ message: 'Doctor signup failed', error: error.message });
  }
};

// User Signup with email verification (no code required)
const userSignup = async (req, res) => {
  //console.log('User signup request received:', req.body); // Debug
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    //console.log('Validation failed: Missing fields'); // Debug
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    const userExists = await User.findOne({ email });
    //console.log('Checking if user exists:', userExists ? 'Yes' : 'No'); // Debug
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate a random 6-digit verification code
    const plainVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    ///console.log(`Generated verification code: ${plainVerificationCode}`); // Debug

    // Hash the verification code
    const hashedVerificationCode = await bcrypt.hash(plainVerificationCode, 10);
    
    // Set verification code expiry (10 minutes from now)
    const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({ 
      name, 
      email, 
      password, 
      verificationCode: hashedVerificationCode, 
      verificationExpiry,
      role: 'user' 
    });
    //console.log('User created:', user._id); // Debug

    //console.log('Attempting to send email with credentials:', {
    //  from: process.env.EMAIL_USER,
    //  to: email,
    //}); // Debug

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email (User)',
      text: `Your verification code is: ${plainVerificationCode}. This code will expire in 10 minutes.`,
    });
    //console.log('Email sent successfully:', info.messageId); // Debug

    res.status(201).json({ message: 'User created, please verify your email', userId: user._id });
  } catch (error) {
    console.error('User signup error:', error.message, error.stack); // Debug
    res.status(500).json({ message: 'User signup failed', error: error.message });
  }
};

// Verify email with code (for both doctor and user)
const verifyEmail = async (req, res) => {
  //console.log('Verify email request received:', req.body); // Debug
  const { userId, code } = req.body;

  try {
    const user = await User.findById(userId);
    //console.log('User found for verification:', user ? user.email : 'Not found'); // Debug
    
    if (!user) {
      //console.log('Verification failed: User not found'); // Debug
      return res.status(400).json({ message: 'Invalid user' });
    }
    
    // Check if verification code has expired
    if (user.verificationExpiry && new Date() > new Date(user.verificationExpiry)) {
      //console.log('Verification failed: Code expired'); // Debug
      return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
    }
    
    // Compare the provided code with the hashed code in the database
    const isCodeValid = await bcrypt.compare(code, user.verificationCode);
    
    if (!isCodeValid) {
      console.log('Verification failed: Invalid code'); // Debug
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationExpiry = undefined;
    await user.save();
    //console.log('User verified:', user.email, 'Role:', user.role); // Debug

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);
    user.refreshToken = refreshToken;
    await user.save();
    //console.log('Tokens generated and saved for role:', user.role, { accessToken, refreshToken }); // Debug

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error('Verify email error:', error.message, error.stack); // Debug
    res.status(500).json({ message: 'Verification failed', error: error.message });
  }
};

// Login with email and password (for both doctor and user)
const login = async (req, res) => {
  //console.log('Login request received:', req.body); // Debug
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    //console.log('User found for login:', user ? user.email : 'Not found', 'Role:', user?.role); // Debug
    
    if (!user) {
      //console.log('Login failed: User not found'); // Debug
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Log the password comparison for debugging
    //console.log('Comparing password for user:', user.email);
    //console.log('Stored hashed password:', user.password);
    //console.log('Provided password:', password);
    
    try {
      // Try both methods for password comparison
      //console.log('Starting password comparison...');
      
      // Method 1: Use the model's comparePassword method
      let isPasswordValid = false;
      if (typeof user.comparePassword === 'function') {
        //console.log('Using model comparePassword method');
        isPasswordValid = await user.comparePassword(password);
      } else {
        // Method 2: Direct bcrypt compare as fallback
        //console.log('Using direct bcrypt compare');
        isPasswordValid = await bcrypt.compare(password, user.password);
      }
      
      //console.log('Password comparison result:', isPasswordValid); // Debug
      
      if (!isPasswordValid) {
        //console.log('Login failed: Invalid password'); // Debug
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (passwordError) {
      console.error('Password comparison error:', passwordError);
      return res.status(500).json({ message: 'Error verifying credentials', error: passwordError.message });
    }

    if (!user.isVerified) {
      console.log('Login failed: Email not verified'); // Debug
      return res.status(403).json({ message: 'Email not verified' });
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);
    user.refreshToken = refreshToken;
    await user.save();
    //console.log('Login successful, tokens generated for role:', user.role, { accessToken, refreshToken }); // Debug

    res.json({ 
      accessToken, 
      refreshToken, 
      role: user.role, 
      userId: user._id,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error.message, error.stack); // Debug
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Refresh access token using refresh token (for both doctor and user)
const refreshToken = async (req, res) => {
  //console.log('Refresh token request received:', req.body); // Debug
  const { refreshToken } = req.body;

  if (!refreshToken) {
    //console.log('Refresh failed: No refresh token provided'); // Debug
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    //console.log('Refresh token decoded:', decoded.id, 'Role:', decoded.role); // Debug

    const user = await User.findById(decoded.id);
    //console.log('User found for refresh:', user ? user.email : 'Not found', 'Role:', user?.role); // Debug
    if (!user || user.refreshToken !== refreshToken) {
      //console.log('Refresh failed: Invalid refresh token'); // Debug
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken(user._id, user.role);
    //console.log('New access token generated for role:', user.role, accessToken); // Debug

    res.json({ accessToken });
  } catch (error) {
    console.error('Refresh token error:', error.message, error.stack); // Debug
    res.status(403).json({ message: 'Refresh token expired or invalid', error: error.message });
  }
};

// Forgot password - send reset code (for both doctor and user)
const forgotPassword = async (req, res) => {
  //console.log('Forgot password request received:', req.body); // Debug
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    //console.log('User found for password reset:', user ? user.email : 'Not found', 'Role:', user?.role); // Debug
    if (!user) {
      //console.log('Forgot password failed: User not found'); // Debug
      return res.status(404).json({ message: 'User not found' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = resetCode;
    await user.save();
    console.log('Reset code generated and saved for role:', user.role, resetCode); // Debug

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Reset Your Password (${user.role.charAt(0).toUpperCase() + user.role.slice(1)})`,
      text: `Your password reset code is: ${resetCode}`,
    });
    //console.log('Reset email sent successfully:', info.messageId); // Debug

    res.json({ message: 'Reset code sent to email', userId: user._id });
  } catch (error) {
    console.error('Forgot password error:', error.message, error.stack); // Debug
    res.status(500).json({ message: 'Failed to send reset code', error: error.message });
  }
};

// Reset password with code (for both doctor and user)
const resetPassword = async (req, res) => {
  //console.log('Reset password request received:', req.body); // Debug
  const { userId, code, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    //console.log('User found for reset:', user ? user.email : 'Not found', 'Role:', user?.role); // Debug
    if (!user || user.verificationCode !== code) {
      //console.log('Reset failed: Invalid user or code'); // Debug
      return res.status(400).json({ message: 'Invalid code or user' });
    }

    user.password = newPassword;
    user.verificationCode = undefined;
    await user.save();
    //console.log('Password reset successfully for role:', user.role, user.email); // Debug

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error.message, error.stack); // Debug
    res.status(500).json({ message: 'Reset failed', error: error.message });
  }
};

// Get current user (for profile checking in frontend, includes role)
const getCurrentUser = async (req, res) => {
  //console.log('Get current user request received'); // Debug
  try {
    //console.log('Current user:', req.user ? { id: req.user._id, role: req.user.role } : 'No user found'); // Debug
    res.json({ id: req.user._id, role: req.user.role }); // Return role for differentiation
  } catch (error) {
    console.error('Get current user error:', error.message, error.stack); // Debug
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
};

module.exports = {
  doctorSignup,
  userSignup,
  verifyEmail,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};