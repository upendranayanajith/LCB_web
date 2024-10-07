const PhonebookEntry = require('../Model/phoneBook.model'); // Corrected import
const { StatusCodes } = require('http-status-codes');

const createEntry = async (req, res) => {
  try {
    const entry = new PhonebookEntry(req.body);
    const newEntry = await entry.save();
    res.status(StatusCodes.CREATED).json(newEntry);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Duplicate entry. Please use a different value.' });
    } else {
      console.error(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating entry.' });
    }
  }
};

const getEntries = async (req, res) => {
  try {
    console.log('Fetching entries...');
    const entries = await PhonebookEntry.find();
    res.status(StatusCodes.OK).json(entries);
  } catch (err) {
    console.error('Error fetching entries:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching entries' });
  }
};

const getEntryById = async (req, res) => {
  try {
    const entry = await PhonebookEntry.findById(req.params.id);
    if (!entry) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Entry not found.' });
    }
    res.status(StatusCodes.OK).json(entry);
  } catch (error) {
    console.error('Error fetching entry:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error.' });
  }
};

const updateEntry = async (req, res) => {
  const { id } = req.params;
  try {
    const entry = await PhonebookEntry.findByIdAndUpdate(id, req.body, { 
      new: true, 
      runValidators: true 
    });
    if (!entry) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: `No Entry with id: ${id}` });
    }
    res.status(StatusCodes.OK).json(entry);
  } catch (err) {
    console.error('Error updating entry:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating entry' });
  }
};

const deleteEntry = async (req, res) => {
  const { id } = req.params;
  try {
    const entry = await PhonebookEntry.findById(id);
    if (!entry) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: `No Entry with id: ${id}` });
    }

    entry.status = false;
    await entry.save();

    res.status(StatusCodes.OK).json({ message: 'Entry deactivated successfully', entry });
  } catch (err) {
    console.error('Error deactivating entry:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error deactivating entry' });
  }
};

module.exports = {
  createEntry,
  getEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
};