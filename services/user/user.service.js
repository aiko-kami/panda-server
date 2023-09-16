const { User } = require("../../models");

const retrieveUserById = async (userId, fields) => {
	console.log("🚀 ~ retrieveUserById ~ userId:", userId);

	try {
		let query = User.findOne({ userId });
		if (fields) {
			query = query.select(`${fields}`);
		}

		const user = await query;

		console.log("🚀 ~ retrieveUserById ~ user:", user);

		if (!user) {
			return { status: "error", message: "User not found." };
		}
		return {
			status: "success",
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
	let query = User.find().sort({ createdAt: -1 }).limit(limit);
	if (fields) {
		query = query.select(`${fields}`);
	}

	const users = await query;
	if (!users) {
		return { status: "error", message: "No user found." };
	}
	return {
		status: "success",
		users,
	};
};

const retrieveUserByEmail = async (email, fields) => {
	try {
		let query = User.findOne({ email });
		if (fields) {
			query = query.select(`${fields}`);
		}
		const user = await query;

		if (!user) {
			logger.error("An error occurred while fetching user by email: No user found.");
			return {
				status: "error",
				message: "An error occurred while fetching user by email: No user found.",
			};
		}

		return { status: "success", user };
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
