const User = require('../models/User');

// GET all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Get all users
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users', error: err });
  }
};

// GET user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Find by ObjectId
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user', error: err });
  }
};

// CREATE a new user
exports.createUser = async (req, res) => {
  try {
    const { uid, name, email, phoneNumber, address, role, category, fcmToken, profileImage, rating } = req.body;

    // Create new user instance
    const newUser = new User({
      uid,
      name,
      email,
      phoneNumber,
      address,
      role,
      category,
      fcmToken,
      profileImage,
      rating
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err });
  }
};

// UPDATE a user by ID
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: 'Error updating user', error: err });
  }
};

// DELETE a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
};
