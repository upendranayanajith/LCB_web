const express = require('express');
const router = express.Router();

const {
    createEntry,
    getEntries,
    getEntryById,
    updateEntry,
    deleteEntry,
} = require("../Controller/phoneBook.controller").default; // Adjust the path as necessary

// Create a new phonebook entry
router.post('/entries', createEntry);

// Get all phonebook entries
router.get('/entries', getEntries);

// Get a phonebook entry by ID
router.get('/entries/:id', getEntryById);

// Update a phonebook entry by ID
router.put('/entries/:id', updateEntry);

// Delete (deactivate) a phonebook entry by ID
router.delete('/entries/:id', deleteEntry);

module.exports = router;
