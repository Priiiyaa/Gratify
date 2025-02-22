const mongoose = require('mongoose');

// Define the schema for Address (nested object in the user)
const addressSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  location: {
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
  },
}, { _id: false }); // Disable _id generation for this sub-schema

// Define the schema for User
const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },   // Unique User ID
  name: { type: String, required: true },               // User's Name
  email: { type: String, required: true, unique: true }, // Email (unique)
  phoneNumber: { type: String  },         // Phone Number
  address: addressSchema,                               // Address (nested object)
  role: { type: String },                // User Role (Receiver, Sender, etc.)
  category: { type: String },            // User Category (User, Admin, etc.)
  profileImage: { type: String },       // Profile Image URL
  rating: { type: String },             // User Rating
  createdAt: { type: Date, default: Date.now },         // Timestamp for user creation
  updatedAt: { type: Date, default: Date.now }          // Timestamp for user update
});

// Mongoose will automatically create a collection named 'users' (plural form of 'User')
const User = mongoose.model('User', userSchema);

module.exports = User;
