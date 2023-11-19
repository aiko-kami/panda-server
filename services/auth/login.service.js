const bcrypt = require("bcryptjs");
const { User, AdminUser } = require("../../models");
const { logger, encryptTools } = require("../../utils");
const { DateTime } = require("luxon");

// Function to get user by username or email
const retrieveUserByUsernameOrEmail = async (identifier) => {
	try {
		const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] }).select("-_id -talents._id -__v");
		if (!user) {
			return { status: "error", message: "User not found." };
		}

		user.status = "success";
		return user;
	} catch (error) {
		logger.error("Error while searching for the user by username or email:", error);
		return { status: "error", message: "An error occurred while searching for the user." };
	}
};

const comparePasswords = async (password, hashedPassword) => {
	try {
		// Compare the provided password with the hashed password using bcrypt.compare
		const passwordMatch = await bcrypt.compare(password, hashedPassword);

		// Return the result of the comparison
		return passwordMatch;
	} catch (error) {
		logger.error("Error while comparing passwords:", error);
		return { status: "error", message: "An error occurred while comparing passwords." };
	}
};

const updateLastConnection = async (userId) => {
	try {
		const objectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserId.status == "error") {
			return { status: "error", message: objectIdUserId.message };
		}

		// Find the user by userId and update the lastConnection field
		const updatedUser = await User.findOneAndUpdate(
			{ _id: objectIdUserId },
			{ lastConnection: DateTime.now().toHTTP() }, // Set the lastConnection field to the current date
			{ new: true } // Return the updated user document
		).select("-_id -talents._id -__v");

		if (!updatedUser) {
			return { status: "error", message: "User not found." };
		}

		logger.info(`User last connection updated. userId: ${userId} - New last connection: ${updatedUser.lastConnection}`);

		return {
			status: "success",
			message: "User last connection updated successfully.",
			data: { user: updatedUser },
		};
	} catch (error) {
		logger.error(`Error while updating user last connection: ${error}`);

		return {
			status: "error",
			message: "An error occurred while updating the user last connection.",
		};
	}
};

// Function to get user by username or email
const retrieveAdminUserByUsernameOrEmail = async (identifier) => {
	try {
		const user = await AdminUser.findOne({ $or: [{ username: identifier }, { email: identifier }] }).select("-_id -__v");
		if (!user) {
			return { status: "error", message: "User not found." };
		}

		user.status = "success";
		return user;
	} catch (error) {
		logger.error("Error while searching for the user by username or email:", error);
		return { status: "error", message: "An error occurred while searching for the user." };
	}
};

const updateAdminLastConnection = async (userId) => {
	try {
		const objectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserId.status == "error") {
			return { status: "error", message: objectIdUserId.message };
		}

		// Find the user by userId and update the lastConnection field
		const updatedUser = await AdminUser.findOneAndUpdate(
			{ _id: objectIdUserId },
			{ lastConnection: DateTime.now().toHTTP() }, // Set the lastConnection field to the current date
			{ new: true } // Return the updated user document
		).select("-_id -__v");

		if (!updatedUser) {
			return { status: "error", message: "User not found." };
		}

		logger.info(`User last connection updated. adminUserId: ${userId} - New last connection: ${updatedUser.lastConnection}`);

		return {
			status: "success",
			message: "User last connection updated successfully.",
			data: { user: updatedUser },
		};
	} catch (error) {
		logger.error(`Error while updating user last connection: ${error}`);

		return {
			status: "error",
			message: "An error occurred while updating the user last connection.",
		};
	}
};

module.exports = {
	retrieveUserByUsernameOrEmail,
	comparePasswords,
	updateLastConnection,
	retrieveAdminUserByUsernameOrEmail,
	updateAdminLastConnection,
};
