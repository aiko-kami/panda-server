const User = require("../models/user.model");
var mongoose = require("mongoose");

const retrieveUserById = async (id, fields) => {
	return User.findOne({ userId: id }).select(`-_id ${fields}`);
};

const retrieveNewUsers = async (limit, fields) => {
	return User.find().sort({ createdAt: -1 }).limit(limit).select(`-_id ${fields}`);
};

module.exports = {
	retrieveUserById,
	retrieveNewUsers,
};
