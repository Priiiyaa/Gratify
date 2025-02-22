const mongoose = require('mongoose');

// Define the schema for Address (nested object in the user)
const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  location: { type: String, required: false } // optional
}, { _id: false }); // Disable _id generation for this sub-schema

// Define the schema for User
const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },   // Unique User ID
  name: { type: String, required: true },               // User's Name
  email: { type: String, required: true, unique: true }, // Email (unique)
  phoneNumber: { type: String, required: true },         // Phone Number
  address: addressSchema,                               // Address (nested object)
  role: { type: String, required: true },                // User Role (Receiver, Sender, etc.)
  category: { type: String, required: true },            // User Category (User, Admin, etc.)
  fcmToken: { type: String, required: true },           // FCM Token (for push notifications)
  profileImage: { type: String, required: true },       // Profile Image URL
  rating: { type: String, required: true },             // User Rating
  createdAt: { type: Date, default: Date.now },         // Timestamp for user creation
  updatedAt: { type: Date, default: Date.now }          // Timestamp for user update
});

// Mongoose will automatically create a collection named 'users' (plural form of 'User')
const User = mongoose.model('User', userSchema);

module.exports = User;
