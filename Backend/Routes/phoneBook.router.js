const express = require('express');
const router = express.Router();
const phonebookController = require('../Controller/phoneBook.controller');

router.post('/entries', phonebookController.createEntry);
router.get('/entries', phonebookController.getEntries);
router.get('/entries/:id', phonebookController.getEntryById);
router.put('/entries/:id', phonebookController.updateEntry);
router.delete('/entries/:id', phonebookController.deleteEntry);

module.exports = router;