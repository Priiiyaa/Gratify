const Reservation = require('../models/Reserve');
const Food = require('../models/Post');
const User = require('../models/User');

// CREATE a new reservation
exports.createReservation = async (req, res) => {
  try {
    const { foodId, userId, location, dateTime, quantity, status } = req.body;

    // Check if the food and user exist
    const food = await Food.findById(foodId);
    const user = await User.findById(userId);

    if (!food || !user) {
      return res.status(404).json({ message: 'Food or User not found' });
    }

    const reservation = new Reservation({
      food: foodId,
      user: userId,
      location,
      dateTime,
      quantity,
      status
    });

    await reservation.save();
    res.status(201).json({ message: 'Reservation created successfully', reservation });
  } catch (err) {
    res.status(500).json({ message: 'Error creating reservation', error: err });
  }
};

// GET all reservations
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('food user');  // Populate food and user data
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving reservations', error: err });
  }
};

// GET a single reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('food user');
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving reservation', error: err });
  }
};

// UPDATE a reservation by ID
exports.updateReservation = async (req, res) => {
  try {
    const { foodId, userId, location, dateTime, quantity, status } = req.body;
    
    // Check if the food and user exist
    const food = await Food.findById(foodId);
    const user = await User.findById(userId);
    
    if (!food || !user) {
      return res.status(404).json({ message: 'Food or User not found' });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        food: foodId,
        user: userId,
        location,
        dateTime,
        quantity,
        status,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!updatedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json(updatedReservation);
  } catch (err) {
    res.status(500).json({ message: 'Error updating reservation', error: err });
  }
};

// DELETE a reservation by ID
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting reservation', error: err });
  }
};
