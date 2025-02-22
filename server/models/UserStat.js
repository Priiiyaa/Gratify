const mongoose = require('mongoose');

// Define the UserStats schema
const userStatsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This will reference the User collection
    required: true
  },
  totalDonations: {
    type: Number,
    required: true,
    default: 0
  },
  totalClaims: {
    type: Number,
    required: true,
    default: 0
  },
  badges: [
    {
      title: {
        type: String,
        required: true
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the UserStats model
module.exports = mongoose.model('UserStats', userStatsSchema);
