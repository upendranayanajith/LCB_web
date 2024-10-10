// reviewModel.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewName: {
    type: String,
    required: true
  },
  reviewDescription: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },

reviewStatus: {
    type: Boolean,
    default: true
  },

  date: {
    type: Date,
    default: function() {
      return new Date(); // Set the date to now when document is created
    }
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;