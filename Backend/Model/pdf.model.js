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
    default: Date.now 
  }
});

const Pdf = mongoose.model('Pdf', pdfSchema);

module.exports = Pdf;