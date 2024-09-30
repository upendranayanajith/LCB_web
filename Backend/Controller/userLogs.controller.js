const UserLogs = require('../Model/userLogs.model');
const express = require('express');
const { StatusCodes } = require('http-status-codes');

const router = express.Router();

const createUser = async (req, res) => {
  try {
    const userLogs = new UserLogs(req.body);
    const newUser = await userLogs.save();
    res.status(StatusCodes.CREATED).json(newUser);
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error (e.g., duplicate username)
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Duplicate username. Please use a different username.' });
    } else {
      console.error(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating userLogs.' });
    }
  }
};

const getUserLogss = async (req, res) => {
  try {
    console.log('Fetching users...');
    const users = await UserLogs.find();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching users' });
  }
};

const getUserLogsById = async (req, res) => {
  const { id: userid } = req.params;
  try {
    const userLogs = await UserLogs.findOne({ userID: userid });
    if (!userLogs) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: `No UserLog with id : ${userid}` });
    }
    res.status(StatusCodes.OK).json(userLogs);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching userLogs' });
  }
};





module.exports = {
  createUser,
  getUsers,
  getUserById,
};


