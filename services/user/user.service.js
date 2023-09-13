const { User } = require("../../models");

const retrieveUserById = async (userId, fields) => {
	try {
		const user = await User.findOne({ userId }).select(`${fields}`);
		if (!user) {
			return { status: "error", message: "User not found." };
		}
		return {
			status: "success",
			message: "User retrieved successfully.",
			user,
		};
	} catch (error) {
		logger.error("Error while retrieving user from the database:", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the user from the database.",
		};
	}
};

const retrieveNewUsers = async (limit, fields) => {
	const users = await User.find().sort({ createdAt: -1 }).limit(limit).select(`-_id ${fields}`);
	if (!users) {
		return { status: "error", message: "No user found." };
	}
	return { status: "success", data: users };
};

const retrieveUserByEmail = async (email) => {
	try {
		const user = await User.findOne({ email });

		if (!user) {
			logger.error("An error occurred while fetching user by email: No user found.");
			return {
				status: "error",
				message: "An error occurred while fetching user by email: No user found.",
			};
		}

		return { status: "success", data: user };
	} catch (error) {
		logger.error("An error occurred while fetching user by email: ", error);
		return { status: "error", message: "An error occurred while fetching user by email." };
	}
};

module.exports = {
	retrieveUserById,
	retrieveNewUsers,
	retrieveUserByEmail,
};
