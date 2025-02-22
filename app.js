const express = require('express');
const mongoose = require('mongoose');
const userController = require('./controllers/userController.js');
const foodController = require('./controllers/postController.js');
const reservationController = require('./controllers/reservationController.js');
const userStatsController = require('./controllers/userStatsController.js');
const loginController = require('./controllers/loginController.js');
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection string (replace with your own MongoDB URI)
const mongoURI = 'mongodb://localhost:27017/Gratify'; // Example for local MongoDB
// For MongoDB Atlas, use the URI format provided by MongoDB Atlas

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// User routes using the controller
app.get('/api/users', userController.getUsers);
app.get('/api/users/:id', userController.getUserById);
app.post('/api/users', userController.createUser);
app.put('/api/users/:id', userController.updateUser);
app.delete('/api/users/:id', userController.deleteUser);

// Food routes
app.post('/api/foods', foodController.createFood);  // Create food item
app.get('/api/foods', foodController.getFoods);  // Get all food items
app.get('/api/foods/:id', foodController.getFoodById);  // Get a food item by ID
app.put('/api/foods/:id', foodController.updateFood);  // Update food item by ID
app.delete('/api/foods/:id', foodController.deleteFood);  // Delete food item by ID

// Comment routes
app.post('/api/foods/:id/comments', foodController.addComment);  // Add a comment to a food item
app.delete('/api/foods/:foodId/comments/:commentId', foodController.deleteComment);  // Delete comment by comment ID

// Route to get foods with expiresAt after today
app.get('/api/foods/expiryAfterToday', foodController.getFoodsWithExpiryAfterToday);

// Reservations routes
app.get('/api/reservations', reservationController.getReservations);
app.get('/api/reservations/:id', reservationController.getReservationById); // Get reservation by ID
app.post('/api/reservations', reservationController.createReservation); // Create a new reservation
app.put('/api/reservations/:id', reservationController.updateReservation); // Update reservation by ID
app.delete('/api/reservations/:id', reservationController.deleteReservation); // Delete reservation by ID

// User Stat routes
app.get('/api/userStats', userStatsController.getUserStats);
app.get('/api/userStats/:id', userStatsController.getUserStatsById); // Get user stats by ID
app.post('/api/userStats', userStatsController.createUserStats); // Create new user stats
app.put('/api/userStats/:id', userStatsController.updateUserStats); // Update user stats by ID
app.delete('/api/userStats/:id', userStatsController.deleteUserStats); // Delete user stats by ID

// User login route
app.post('/api/login', loginController.loginUser);


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
