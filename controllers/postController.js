const Food = require('../models/Post');

// CREATE a new food item
exports.createFood = async (req, res) => {
  try {
    const {
      user,
      title,
      description,
      quantity,
      category,
      location,
      imageURL,
      isUrgent,
      dietryRestric,
      price,
      unit,
      expiresAt,
      comments
    } = req.body;

    // Create new food item instance
    const newFood = new Food({
      user,
      title,
      description,
      quantity,
      category,
      location,
      imageURL,
      isUrgent,
      dietryRestric,
      price,
      unit,
      expiresAt,
      comments: comments || []  // Default to an empty array if no comments
    });

    // Save the food item to the database
    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (err) {
    res.status(400).json({ message: 'Error creating food item', error: err });
  }
};

// GET all food items
exports.getFoods = async (req, res) => {
  try {
    const foods = await Food.find().populate('user'); // Retrieve all food items
    res.status(200).json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving food items', error: err });
  }
};

// GET a single food item by ID
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate('user'); // Find food by ObjectId
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.status(200).json(food);  // Respond with food details including comments
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving food item', error: err });
  }
};

const moment = require('moment'); // For easier date comparison

// GET food items with expiresAt after today
exports.getFoodsWithExpiryAfterToday = async (req, res) => {
  try {
    const today = moment().startOf('day').toDate();  // Get today's date at midnight

    // Find all food items with expiresAt greater than or equal to today
    const foods = await Food.find({ expiresAt: { $gte: today } })
      .populate('user');  // Populate user data for the food item

    if (foods.length === 0) {
      return res.status(404).json({ message: 'No food items with expiry after today' });
    }

    res.status(200).json(foods);  // Return the filtered food items
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving food items', error: err });
  }
};


// UPDATE a food item by ID
exports.updateFood = async (req, res) => {
  try {
    const { title, description, quantity, category, location, imageURL, isUrgent, dietryRestric, price, unit, expiresAt } = req.body;

    // Find the food item and update its fields
    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        quantity,
        category,
        location,
        imageURL,
        isUrgent,
        dietryRestric,
        price,
        unit,
        expiresAt,
        updatedAt: Date.now()  // Set the updated timestamp
      },
      { new: true } // Return the updated document
    );

    if (!updatedFood) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.status(200).json(updatedFood);
  } catch (err) {
    res.status(400).json({ message: 'Error updating food item', error: err });
  }
};

// DELETE a food item by ID
exports.deleteFood = async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.status(204).send();  // No content (successfully deleted)
  } catch (err) {
    res.status(500).json({ message: 'Error deleting food item', error: err });
  }
};

// ADD a comment to a specific food item by ID
exports.addComment = async (req, res) => {
  try {
    const { user, text } = req.body;

    // Find the food item by ID and add the comment
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Push the new comment to the comments array of the food item
    food.comments.push({
      user,
      text,
      createdAt: Date.now()
    });

    // Save the updated food item
    const updatedFood = await food.save();
    res.status(200).json(updatedFood);
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', error: err });
  }
};

// DELETE a specific comment from a food item by comment ID
exports.deleteComment = async (req, res) => {
  try {
    const food = await Food.findById(req.params.foodId);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Find the comment index and remove it
    const commentIndex = food.comments.findIndex((comment) => comment._id.toString() === req.params.commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Remove the comment
    food.comments.splice(commentIndex, 1);
    const updatedFood = await food.save();

    res.status(200).json(updatedFood);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment', error: err });
  }
};
