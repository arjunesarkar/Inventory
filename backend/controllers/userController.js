// Import necessary modules
const { hashPassword, comparePassword } = require('../halpers/authHelper'); // Adjusted 'halpers' to 'helpers'
const UserModel = require('../models/UserModel');
const JWT = require('jsonwebtoken');
// User Registration Controller
const userController = async (req, res) => {
  console.log('Request Body:', req.body);

  try {
      const { username, name, email, password, question } = req.body;

      // Validate input
      if (!name) return res.status(400).send({ success: false, message: 'Name is required' });
      if (!email) return res.status(400).send({ success: false, message: 'Email is required' });
      if (!password) return res.status(400).send({ success: false, message: 'Password is required' });
      if (!question) return res.status(400).send({ success: false, message: 'Security question is required' });

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
          return res.status(409).send({ success: false, message: 'User already registered' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create new user
      const user = new UserModel({ username, name, email, password: hashedPassword, question });
      await user.save();

      res.status(201).send({
          success: true,
          message: 'User registered successfully',
          user: { username: user.username, name: user.name, email: user.email }
      });
  } catch (error) {
      console.error('Registration error:', error);
      res.status(500).send({ success: false, message: 'Error in registration', error: error.message });
  }
};

// User Login Controller
const logInController = async (req, res) => {
  try {
    // Destructure email and password from the request body
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Invalid email'
      });
    }

    // Compare passwords
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: 'Invalid password'
      });
    }

    // Generate a JWT token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Respond with success message and token
    res.status(200).send({
      success: true,
      message: 'Login successful',
      user: {
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Forgot Password Controller
const forgatPasswordController = async (req, res) => { // Adjusted typo 'forgat' to 'forgot'
  try {
    // Destructure email, security question, and new password from the request body
    const { email, question, newPassword } = req.body;

    // Validate input
    if (!email) return res.status(400).send({ success: false, message: 'Email is required' });
    if (!question) return res.status(400).send({ success: false, message: 'Security question is required' });
    if (!newPassword) return res.status(400).send({ success: false, message: 'New password is required' });

    // Find user by email and security question
    const user = await UserModel.findOne({ email, question });
    if (!user) {
      return res.status(404).send({ success: false, message: 'Invalid email or security question' });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user's password
    await UserModel.findByIdAndUpdate(user._id, { password: hashedPassword });

    // Respond with success message
    res.status(200).send({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).send({
      success: false,
      message: 'Error in password reset',
      error: error.message
    });
  }
};

// Test Controller for protected routes
const testController = (req, res) => {
  res.send('Protected route');
};

// Export controllers
module.exports = { userController, logInController, testController, forgatPasswordController };

