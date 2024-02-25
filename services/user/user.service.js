const { User } = require("../../models");
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

		const user = await User.findOne({ _id: ObjectIdUserId }).select(fieldsString);

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

const retrieveLatestUsers = async (fields, conditions, limit) => {
	try {
		const fieldsString = fields.join(" ");

		const users = await User.find(conditions).sort({ createdAt: -1 }).limit(limit).select(fieldsString);

		if (!users || users.length === 0) {
			logger.info(`No user found.`);
			return { status: "success", message: "No user found." };
		}

		const nbUsers = users.length;

		if (nbUsers === 1) {
			logger.info(`${nbUsers} user retrieved successfully.`);
			return { status: "success", message: `${nbUsers} user retrieved successfully.`, users };
		} else logger.info(`${nbUsers} users retrieved successfully.`);
		return { status: "success", message: `${nbUsers} users retrieved successfully.`, users };
	} catch (error) {
		logger.error("Error while retrieving users:", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the users.",
		};
	}
};

const retrieveUserByEmail = async (email, fields) => {
	try {
		const fieldsString = fields.join(" ");

		const user = await User.findOne({ email }).select(fieldsString);

		if (!user) {
			logger.error("An error occurred while retrieving the user: No user found.");
			return {
				status: "error",
				message: "No user found.",
			};
		}

		return { status: "success", message: "User retrieved successfully", user };
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
		const user = await User.findOne({ _id: ObjectIdUserId });

		// Check if the user exists
		if (!user) {
			return { status: "error", message: "User not found." };
		}

		// Define an object to store the fields that need to be updated
		const updateFields = {};

		// Define a mapping of fields between the updatedData object and the project object
		const fieldMapping = {
			email: "email",
			profilePictureKey: "profilePicture.key",
			profilePictureLink: "profilePicture.link",
			locationCity: "location.city.data",
			locationCountry: "location.country.data",
			company: "company.data",
			description: "description",
			bio: "bio.data",
			languages: "languages.data",
			website: "website.data",
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

const updateUserPrivacy = async (userId, updatedData) => {
	try {
		// Convert id to ObjectId
		const ObjectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (ObjectIdUserId.status == "error") {
			return { status: "error", message: ObjectIdUserId.message };
		}

		// Find the user by userId
		const user = await User.findOne({ _id: ObjectIdUserId });

		// Check if the user exists
		if (!user) {
			return { status: "error", message: "User not found." };
		}

		// Define an object to store the fields that need to be updated
		const updateFields = {};

		// Define a mapping of fields between the updatedData object and the project object
		const fieldMapping = {
			profilePicture: "profilePicture.privacy",
			locationCountry: "location.country.privacy",
			locationCity: "location.city.privacy",
			company: "company.privacy",
			bio: "bio.privacy",
			website: "website.privacy",
			languages: "languages.privacy",
			projectLike: "projectLikePrivacy",
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
		logger.info(`User privacy data updated successfully. User ID: ${userId}`);
		return {
			status: "success",
			message: "User privacy data updated successfully.",
			updatedUser,
		};
	} catch (error) {
		logger.error("Error while updating the user privacy data: ", error);

		return {
			status: "error",
			message: "An error occurred while updating the user privacy data.",
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
		const user = await User.findById(ObjectIdUserId);

		// Check if the old password matches the stored hashed password
		const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

		if (!isPasswordValid) {
			logger.error("Error while updating user password: Old password is incorrect");
			return { status: "error", message: "Old password is incorrect." };
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);

		// Update the password in the database for the user with userId
		await User.findOneAndUpdate({ _id: ObjectIdUserId }, { password: hashedPassword });

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
		const existingUser = await User.findOne({ email });

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
	retrieveLatestUsers,
	retrieveUserByEmail,
	updateUser,
	updateUserPrivacy,
	updateUserPassword,
	verifyEmailAvailability,
};
