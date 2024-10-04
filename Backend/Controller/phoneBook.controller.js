import PhonebookEntry, { find, findById, findByIdAndUpdate } from '../Model/phoneBook.model'; // Adjust the path as necessary
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = Router();

const createEntry = async (req, res) => {
  try {
    const entry = new PhonebookEntry(req.body);
    const newEntry = await entry.save();
    res.status(StatusCodes.CREATED).json(newEntry);
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error (e.g., duplicate entry)
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
    const entries = await find();
    res.status(200).json(entries);
  } catch (err) {
    console.error('Error fetching entries:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching entries' });
  }
};

const getEntryById = async (req, res) => {
  try {
    const entry = await findById(req.params.id);
    if (!entry) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Entry not found.' });
    }
    res.status(200).json(entry);
  } catch (error) {
    console.error('Error fetching entry:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error.' });
  }
};

const updateEntry = async (req, res) => {
  const { id } = req.params;
  try {
    const entry = await findByIdAndUpdate(id, req.body, { 
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
    const entry = await findById(id);
    if (!entry) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: `No Entry with id: ${id}` });
    }

    // Set the entry's status to false instead of deleting
    entry.status = false;
    await entry.save();

    res.status(StatusCodes.OK).json({ message: 'Entry deactivated successfully', entry });
  } catch (err) {
    console.error('Error deactivating entry:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error deactivating entry' });
  }
};

export default {
  createEntry,
  getEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
};
