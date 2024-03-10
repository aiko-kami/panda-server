const { AdminUser } = require("../../models");
const bcrypt = require("bcryptjs");
const { logger, encryptTools } = require("../../utils");

const retrieveUserById = async (userId, fields) => {
	try {
		// Convert id to ObjectId
		const ObjectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (ObjectIdUserId.status == "error") {
			return { status: "error", message: ObjectIdUserId.message };
		}
		const fieldsString = fields.join(" ");

		const user = await AdminUser.findOne({ _id: ObjectIdUserId }).select(fieldsString);
		if (!user) {
			return { status: "error", message: "User not found." };
		}

		return {
			status: "success",
			message: "User retrieved successfully",
			user,
		};
	} catch (error) {
		logger.error("Error while retrieving user:", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the user.",
		};
	}
};

const retrieveUserByEmail = async (email, fields) => {
	try {
		const fieldsString = fields.join(" ");

		const user = await AdminUser.findOne({ email }).select(fieldsString);

		if (!user) {
			logger.error("An error occurred while retrieving the user: User not found.");
			return {
				status: "error",
				message: "User not found.",
			};
		}

		return { status: "success", message: "User retrieved successfully.", user };
	} catch (error) {
		logger.error("Error while retrieving user: ", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the user.",
		};
	}
};

const updateUser = async (userId, updatedData) => {
	try {
		// Convert id to ObjectId
		const ObjectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (ObjectIdUserId.status == "error") {
			return { status: "error", message: ObjectIdUserId.message };
		}

		// Find the user by userId
		const user = await AdminUser.findOne({ _id: ObjectIdUserId });
		if (!user) {
			return { status: "error", message: "User not found." };
		}

		// Define an object to store the fields that need to be updated
		const updateFields = {};

		// Define a mapping of fields between the updatedData object and the project object
		const fieldMapping = {
			email: "email",
			locationCity: "location.city.data",
			locationCountry: "location.country.data",
			description: "description",
			bio: "bio.data",
			languages: "languages.data",
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
		const updatedUser = await AdminUser.save();
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

/**
 * Update user's password in the database.
 * @param {string} userId - The ID of the user whose password needs to be updated.
 * @param {string} newPassword - The new password to set for the user.
 * @returns {Object} - An object with a status and message indicating the result.
 */
const updateUserPassword = async (userId, oldPassword, newPassword) => {
	try {
		// Convert id to ObjectId
		const ObjectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (ObjectIdUserId.status == "error") {
			return { status: "error", message: ObjectIdUserId.message };
		}

		// Retrieve the user from the database
		const user = await AdminUser.findById(ObjectIdUserId);
		if (!user) {
			return { status: "error", message: "User not found." };
		}

		// Check if the old password matches the stored hashed password
		const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
		if (!isPasswordValid) {
			logger.error("Error while updating user password: Old password is incorrect");
			return { status: "error", message: "Old password is incorrect." };
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);

		// Update the password in the database for the user with userId
		await AdminUser.findOneAndUpdate({ _id: ObjectIdUserId }, { password: hashedPassword });

		logger.info(`User password updated successfully. userId: ${userId}`);
		return {
			status: "success",
			message: "Password updated successfully.",
		};
	} catch (error) {
		logger.error(`Error while updating user password: ${error}`);

		return {
			status: "error",
			message: "An error occurred while updating the user password.",
		};
	}
};

/**
 * Verify Email Availability Service
 *
 * @param {string} email - The email to be verified for availability.
 * @returns {Object} - The result of the email availability check (status and message).
 */
const verifyEmailAvailability = async (email) => {
	try {
		const existingUser = await AdminUser.findOne({ email });

		if (existingUser) {
			logger.warn("Email is already in use.");
			return {
				status: "error",
				message: "Email is already in use.",
			};
		}

		return { status: "success", message: "Email is available." };
	} catch (error) {
		logger.error("Error occurred while verifying email availability: ", error);
		return {
			status: "error",
			message: "An error occurred while verifying email availability.",
		};
	}
};

module.exports = {
	retrieveUserById,
	retrieveUserByEmail,
	updateUser,
	updateUserPassword,
	verifyEmailAvailability,
};
