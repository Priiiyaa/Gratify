const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // User referencing User model
  title: String,
  description: String,
  quantity: String,
  category: String,
  location: {
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
  },
  imageURL: String,
  isUrgent: Boolean,
  dietryRestric: String,
  price: String,
  unit: String,
  expiresAt: Date,
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Define the Food model
const Food = mongoose.model('Food', foodSchema);
module.exports = Food;
