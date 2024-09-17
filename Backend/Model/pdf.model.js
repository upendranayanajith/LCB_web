// pdfModel.js
const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  pdfName: {
    type: String,
    required: true
  },
  pdfDescription: {
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
  date: {
    type: Date,
    default: function() {
      return new Date(); // Set the date to now when document is created
    }
  }
});

const Pdf = mongoose.model('Pdf', pdfSchema);

module.exports = Pdf;