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

const retrieveUserByEmail = async (email) => {
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return { status: "error", message: "User not found." };
		}

		return { status: "success" };
	} catch (error) {
		return { status: "error", message: "An error occurred while fetching user." };
	}
};

module.exports = {
	retrieveUserById,
	retrieveNewUsers,
	retrieveUserByEmail,
};
