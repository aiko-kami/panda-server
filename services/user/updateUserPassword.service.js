const { User } = require("../../models");
const bcrypt = require("bcryptjs");
const { logger } = require("../../utils");

/**
 * Update user's password in the database.
 * @param {string} userId - The ID of the user whose password needs to be updated.
 * @param {string} newPassword - The new password to set for the user.
 * @returns {Object} - An object with a status and message indicating the result.
 */

const updateUserPassword = async (userId, newPassword) => {
	try {
		// Hash the new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);

		// Update the password in the database for the user with userId
		await User.findOneAndUpdate({ userId }, { password: hashedPassword });

		logger.info(`User password updated successfully. userId: ${userId}`);

		return {
			status: "success",
			message: "User password updated successfully.",
		};
	} catch (error) {
		logger.error(`Error while updating user password: ${error}`);

		return {
			status: "error",
			message: "An error occurred while updating the user password.",
		};
	}
};

module.exports = {
	updateUserPassword,
};
