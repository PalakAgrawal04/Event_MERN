const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
  
    console.log('Login attempt for:', username);
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        console.log('User not found');
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Directly compare plain text passwords
      if (password !== user.password) {
        console.log('Invalid credentials');
        return res.status(401).json({ msg: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, role: user.role });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  };
  
