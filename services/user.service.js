const User = require("../models/user.model");
var mongoose = require("mongoose");

const retrieveNewUsers = async (limit, fields) => {
	return User.find().sort({ createdAt: -1 }).limit(limit).select(`-_id ${fields}`);
};

module.exports = {
	retrieveNewUsers,
};
