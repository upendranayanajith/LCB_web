const User = require('../Model/user.model');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors/custom-error');

const createUser = async(req, res) => {
    try {

        const user = new User(req.body);
        const newUser = await user.save();
        res.status(StatusCodes.CREATED).json(newUser);
    } catch (err) {
        res.status(StatusCodes.BadRequest).json({ message: err.message });
    }
}


const getUsers = async(req, res) => {
    try {

        const users = await User.find({ status: true });
        res.status(StatusCodes.OK).json({ users, count: users.length });
    } catch (err) {
        res.status(StatusCodes.BadRequest).json({ message: err.message });
    }
}

const getUserById = async(req, res) => {
    const { id: userid } = req.params;
    try {

        const user = await User.findOne({ userID: userid });
        if (!user) {
            throw new CustomError.NotFoundError(`No User with id : ${req.params.id}`);
        }
        res.status(StatusCodes.OK).json(user);
    } catch (err) {
        res.status(StatusCodes.BadRequest).json({ message: err.message });
    }
}


const updateUser = async(req, res) => {
    const { id: userid } = req.params;
    try {
        const user = await User.findOneAndUpdate({ userID: userid }, req.body, { new: true, runValidators: true });
        if (!user) {
            throw new CustomError.NotFoundError(`No User with id : ${req.params.id}`);
        }
        res.status(StatusCodes.OK).json(user);
    } catch (err) {
        res.status(StatusCodes.BadRequest).json({ message: err.message });
    }
}


const deleteUser = async(req, res) => {
    const { id: userid } = req.params;
    try {
        const user = await User.findOne({ userID: userid });
        if (!user) {
            throw new CustomError.NotFoundError(`No User with id : ${req.params.id}`);
        }
        user.status = false;
        user = await User.findOneAndUpdate({ userID: userid }, user);
        res.status(StatusCodes.OK).json(user);
    } catch (err) {
        res.status(StatusCodes.BadRequest).json({ message: err.message });
    }
}


module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
}