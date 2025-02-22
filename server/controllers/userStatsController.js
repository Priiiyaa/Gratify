const UserStats = require('../models/UserStat');
const User = require('../models/User');  // Assuming you have a User model

// Get all user stats
const getUserStats = async (req, res) => {
  try {
    const stats = await UserStats.find().populate('user');
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user stats', error: err });
  }
};

// Get user stats by ID
const getUserStatsById = async (req, res) => {
  try {
    const stats = await UserStats.findById(req.params.id).populate('user');
    if (!stats) {
      return res.status(404).json({ message: 'User stats not found' });
    }
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user stats', error: err });
  }
};

// Create user stats
const createUserStats = async (req, res) => {
  try {
    const { userId, totalDonations, totalClaims, badges } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userStats = new UserStats({
      user: userId,
      totalDonations,
      totalClaims,
      badges
    });

    await userStats.save();
    res.status(201).json({ message: 'User stats created successfully', userStats });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user stats', error: err });
  }
};

// Update user stats by ID
const updateUserStats = async (req, res) => {
  try {
    const { totalDonations, totalClaims, badges } = req.body;

    const updatedUserStats = await UserStats.findByIdAndUpdate(
      req.params.id,
      {
        totalDonations,
        totalClaims,
        badges,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!updatedUserStats) {
      return res.status(404).json({ message: 'User stats not found' });
    }

    res.status(200).json(updatedUserStats);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user stats', error: err });
  }
};

// Delete user stats by ID
const deleteUserStats = async (req, res) => {
  try {
    const userStats = await UserStats.findByIdAndDelete(req.params.id);
    if (!userStats) {
      return res.status(404).json({ message: 'User stats not found' });
    }
    res.status(200).json({ message: 'User stats deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user stats', error: err });
  }
};

module.exports = {
  getUserStats,
  getUserStatsById,
  createUserStats,
  updateUserStats,
  deleteUserStats
};
