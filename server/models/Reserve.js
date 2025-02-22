const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },  // Reference to Food model
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to User model
  location: { type: String, required: true },
  dateTime: { type: Date, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['Reserved', 'Completed', 'Cancelled'], default: 'Reserved' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
