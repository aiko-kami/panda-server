const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { logger } = require("../utils");

const v4 = require("uuid").v4;

// Function to get user by username or email
const getUserByUsernameOrEmail = async (identifier) => {
	try {
		const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
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

module.exports = {
	getUserByUsernameOrEmail,
	comparePasswords,
};
