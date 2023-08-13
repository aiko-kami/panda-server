const { User } = require("../models");

const retrieveUserById = async (id, fields) => {
	const user = await User.findOne({ userId: id }).select(`-_id ${fields}`);
	if (!user) {
		return { status: "error", message: "User not found." };
	}
	return user;
};

const retrieveNewUsers = async (limit, fields) => {
	const users = User.find().sort({ createdAt: -1 }).limit(limit).select(`-_id ${fields}`);
	if (!users) {
		return { status: "error", message: "No user found." };
	}
	return users;
};

module.exports = {
	retrieveUserById,
	retrieveNewUsers,
};
