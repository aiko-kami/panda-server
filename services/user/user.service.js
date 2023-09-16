const { User } = require("../../models");

const retrieveUserById = async (userId, fields) => {
	try {
		let query = User.findOne({ userId });
		if (fields) {
			query = query.select(`${fields}`);
		}

		const user = await query;

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
	try {
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
	} catch (error) {
		logger.error("Error while retrieving users from the database:", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the users from the database.",
		};
	}
};

const retrieveUserByEmail = async (email, fields) => {
	try {
		let query = User.findOne({ email });
		if (fields) {
			query = query.select(`${fields}`);
		}
		const user = await query;

		if (!user) {
			logger.error("An error occurred while retrieving the user from the database: No user found.");
			return {
				status: "error",
				message: "No user found.",
			};
		}

		return { status: "success", user };
	} catch (error) {
		logger.error("An error occurred while retrieving the user from the database: ", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the user from the database.",
		};
	}
};

const updateUser = async (userId, updatedData) => {
	try {
		// Find the user by userId
		const user = await User.findOne({ userId });

		// Check if the user exists
		if (!user) {
			return { status: "error", message: "User not found." };
		}

		// Define an object to store the fields that need to be updated
		const updateFields = {};

		// Define a mapping of fields between the updatedData object and the project object
		const fieldMapping = {
			email: "email",
			profilePicture: "profilePicture",
			locationCountry: "location.city",
			locationCity: "location.country",
			company: "company",
			description: "description",
			bio: "bio",
			languages: "languages",
			website: "website",
		};

		// Iterate through the fieldMapping and check if the field exists in updatedData
		for (const key in fieldMapping) {
			const userField = fieldMapping[key];
			if (updatedData.hasOwnProperty(key)) {
				// If the field exists in updatedData, update the corresponding field in updateFields
				updateFields[userField] = updatedData[key];
			}
		}

		// Update the user properties
		user.set(updateFields);

		// Save the updated user
		const updatedUser = await user.save();
		logger.info(`User updated successfully. User ID: ${userId}`);
		return {
			status: "success",
			message: "User updated successfully.",
			updatedUser,
		};
	} catch (error) {
		logger.error("Error while updating the user: ", error);

		return {
			status: "error",
			message: "An error occurred while updating the user.",
		};
	}
};

module.exports = {
	retrieveUserById,
	retrieveNewUsers,
	retrieveUserByEmail,
	updateUser,
};
