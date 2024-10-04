// PhonebookEntry.js
const mongoose = require('mongoose');

// Define the Phonebook Entry schema
const phonebookEntrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
   
  },
  extensionCode: {
    type: String,
    required: false,
   
  },
  mobile: {
    type: String,
    required: true,
    
  },
  email: {
    type: String,
    required: true,
 
  }
}, {
  timestamps: true // Automatically create createdAt and updatedAt fields
});

// Create the Phonebook Entry model
const PhonebookEntry = mongoose.model('PhonebookEntry', phonebookEntrySchema);

module.exports = PhonebookEntry;
