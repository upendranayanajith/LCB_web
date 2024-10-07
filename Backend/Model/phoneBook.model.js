const e = require('express');
const mongoose = require('mongoose');

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

branch: {
    type: String,
    required: true,
   default: 'Head Office',
   enum: ['Head Office', 'Galle','Matara','Kandy','Kurunegala','Jaffna','Kalmunai','Kegalle','Kuliyapitiya','Negombo','Panadura','Ratnapura'],
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
  },
  status: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const PhonebookEntry = mongoose.model('PhonebookEntry', phonebookEntrySchema);

module.exports = PhonebookEntry;
