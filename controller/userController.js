const User = require('../models/user');
const path = require('path');
const fs = require('fs');
const createUser = async (req, res) => {
  try {
    const photoURL = req.file ? `/uploads/${req.file.filename}` : req.body.photo;

    const user = new User({
      name: req.body.name,
      designation: req.body.designation,
      photo: photoURL, 
      department: req.body.department,
      expertise: req.body.expertise
    });

    await user.save();
    res.status(201).send(user);
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error);
  }
};

const getUser = async (req, res) => {
  try {
    const sortField = req.query.sortBy || 'name';
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const sortOptions = {};
    sortOptions[sortField] = sortOrder;

    const filter = {};

    if (req.query.name) {
      filter.name = { $regex: new RegExp(req.query.name, 'i') }; 
    }

    if (req.query.department) {
      filter.department = { $regex: new RegExp(req.query.department, 'i') };
    }
    const users = await User.find(filter).sort(sortOptions);
    res.send(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: 'Failed to fetch users' });
  }
};



const getUserById = async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
};

const updateUser = async (req, res) => {
  try {
    const user = { ...req.body };

    if (req.file) {
      user.photo = `/uploads/${req.file.filename}`;
    }

    const users = await User.findByIdAndUpdate(req.params.id, user, { new: true });

    if (!users) {
      return res.status(404).send();
    }

    res.send(users);
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  createUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
  
};
