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
    const user = await User.findOne({ uid: req.params.uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// CREATE a new user
exports.createUser = async (req, res) => {
  try {
    const { uid, name, email, phoneNumber, address, role, category, profileImage, rating } = req.body;


    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(200).json(existingUser); // Return existing user
    }

    // Create new user instance
    const newUser = new User({
      uid,
      name,
      email,
      phoneNumber,
      address,
      role,
      category,
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

exports.myData = async (req, res) => {

  try {
    // Fetch the user from your database using the Firebase UID
    const user = await User.findOne({ uid: req.user.uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's details
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// UPDATE a user by ID
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { uid: req.params.uid },
      req.body,
      { new: true, upsert: true } // Create the user if they don't exist
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
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
