const User = require('../Model/user.model');
const express = require('express');
const { StatusCodes } = require('http-status-codes');

const router = express.Router();

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const newUser = await user.save();
    res.status(StatusCodes.CREATED).json(newUser);
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error (e.g., duplicate username)
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Duplicate username. Please use a different username.' });
    } else {
      console.error(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating user.' });
    }
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ status: true });
    res.status(StatusCodes.OK).json({ users, count: users.length });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching users' });
  }
};

const getUserById = async (req, res) => {
  const { id: userid } = req.params;
  try {
    const user = await User.findOne({ userID: userid });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: `No User with id : ${userid}` });
    }
    res.status(StatusCodes.OK).json(user);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching user' });
  }
};

const updateUser = async (req, res) => {
  const { id: userid } = req.params;
  try {
    const user = await User.findOneAndUpdate({ userID: userid }, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: `No User with id : ${userid}` });
    }
    res.status(StatusCodes.OK).json(user);
  } catch (err) {

    console.error(err); // Log the error for debugging
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating user' });
  }
};

const deleteUser = async (req, res) => {
  const { id: userid } = req.params;
  try {
    let user = await User.findOne({ userID: userid });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: `No User with id : ${userid}` });
    }
    
    // Mark the user as inactive instead of deleting
    user.status = false;
    user = await User.findOneAndUpdate({ userID: userid }, user);
    
    res.status(StatusCodes.OK).json(user);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting user' });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};


