const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
var mongoose = require("mongoose");
const config = require("../config/config");

const retrieveUserById = async (id, fields) => {
	return User.findOne({ userId: id }).select(`-_id ${fields}`);
};

const retrieveNewUsers = async (limit, fields) => {
	return User.find().sort({ createdAt: -1 }).limit(limit).select(`-_id ${fields}`);
};

async function checkUsernameAvailability(username) {
	return await User.findOne({ username });
}

async function checkEmailAvailability(email) {
	return await User.findOne({ email });
}

async function signupUser(username, email, password) {
	const hashedPassword = await bcrypt.hash(password, 10);
	const newUser = new User({ username, email, password: hashedPassword });
	return await newUser.save();
}

module.exports = {
	retrieveUserById,
	retrieveNewUsers,
	checkUsernameAvailability,
	checkEmailAvailability,
	signupUser,
};
