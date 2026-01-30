const { User } = require("../../models");
const { logger, encryptTools } = require("../../utils");

const createTalent = async (talentData, userId) => {
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

		// Check if the talent already exists. Find the index of the talent to be added based on its unique name
		const talentIndex = user.talents.findIndex((talent) => talent.name === talentData.name);

		if (talentIndex !== -1) {
			return { status: "error", message: "Talent already exists in the database." };
		}

		// Add the new talent to the user's talents array
		user.talents.push(talentData);

		// Save the created talent
		await user.save();
		logger.info(`Talent created successfully. Talent: ${talentData.name}`);

		return {
			status: "success",
			message: "Talent created successfully.",
			talentData,
		};
	} catch (error) {
		logger.error("Error while creating the talent in the database: ", error);

		return {
			status: "error",
			message: "An error occurred while creating the talent in the database.",
		};
	}
};

const updateTalent = async (updatedTalentData, userId) => {
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

		// Find the index of the talent to be updated based on its unique name
		const talentIndex = user.talents.findIndex((talent) => talent.name === updatedTalentData.name);

		if (talentIndex === -1) {
			return { status: "error", message: "Talent not found." };
		}

		// Define an object to store the fields that need to be updated
		const updateFields = {};

		// Define a mapping of fields between the updatedTalentData object and the talent object
		const fieldMapping = {
			description: "description",
			skills: "skills",
			experience: "experience",
			portfolio: "portfolio",
			certifications: "certifications",
		};

		// Iterate through the fieldMapping and check if the field exists in updatedTalentData
		for (const key in fieldMapping) {
			const talentField = fieldMapping[key];
			if (updatedTalentData.hasOwnProperty(key)) {
				// If the field exists in updatedTalentData, update the corresponding field in updateFields
				updateFields[`talents.${talentIndex}.${talentField}`] = updatedTalentData[key];
			}
		}

		// Update the talent properties
		user.set(updateFields);

		// Save the updated talent
		const updatedTalent = await user.save();
		logger.info(`Talent updated successfully. Talent: ${updatedTalentData.name}`);

		return {
			status: "success",
			message: "Talent updated successfully.",
			updatedTalentData,
		};
	} catch (error) {
		logger.error("Error while updating the talent in the database: ", error);
		return {
			status: "error",
			message: "An error occurred while updating the talent in the database.",
		};
	}
};

const updateTalents = async (talents, userId) => {
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

		// Set the updated talents array
		user.talents = talents;

		// Save the updated user
		await user.save();

		// Save the updated talent
		logger.info("Talents updated successfully.");

		return {
			status: "success",
			message: "Talents updated successfully.",
			talents,
		};
	} catch (error) {
		logger.error("Error while updating the talents in the database: ", error);
		return {
			status: "error",
			message: "An error occurred while updating the talents in the database.",
		};
	}
};

const removeTalent = async (talentName, userId) => {
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

		// Find the index of the talent to be removed based on its unique name
		const talentIndex = user.talents.findIndex((talent) => talent.name === talentName);

		if (talentIndex === -1) {
			return { status: "error", message: "Talent not found." };
		}

		// Remove the talent from the talents array
		user.talents.splice(talentIndex, 1);

		// Save the created talent
		await user.save();

		logger.info(`Talent removed successfully. Talent: ${talentName}`);
		return {
			status: "success",
			message: "Talent removed successfully.",
			talentName,
		};
	} catch (error) {
		logger.error("Error while removing the talent in the database: ", error);

		return {
			status: "error",
			message: "An error occurred while removing the talent in the database.",
		};
	}
};

const updateQuickSkills = async (userId, skill, action) => {
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

		// Find the index of the skill to be updated based on its unique name
		const existingSkillIndex = user.quickSkills.data.findIndex((sk) => sk.toLowerCase() === skill.toLowerCase());

		if (action === "add") {
			if (existingSkillIndex !== -1) {
				return { status: "error", message: "Skill already present." };
			}

			// Max objectives limit
			const MAX_QUICK_SKILLS = 10;

			if (user.quickSkills.data.length >= MAX_QUICK_SKILLS) {
				return {
					status: "error",
					message: `You cannot add more than ${MAX_QUICK_SKILLS} skills.`,
				};
			}

			// Add new objective
			user.quickSkills.data.push(skill);

			await user.save();

			logger.info(`Skill added successfully. User ID: ${userId} - Skill: ${skill}`);
			return { status: "success", message: "Skill added successfully." };
		} else if (action === "remove") {
			if (existingSkillIndex === -1) {
				return { status: "error", message: "Skill not found." };
			}

			// Remove Objective from the list
			user.quickSkills.data.splice(existingSkillIndex, 1);

			// Save the updated project
			await user.save();

			logger.info(`Skill removed successfully. User ID: ${userId} - Skill: ${skill}`);
			return { status: "success", message: "Skill removed successfully." };
		} else {
			throw new Error("Invalid action specified.");
		}
	} catch (error) {
		logger.error("Error while updating the quick skills in the database: ", error);
		return {
			status: "error",
			message: "An error occurred while updating the quick skills in the database.",
		};
	}
};

module.exports = {
	createTalent,
	updateTalent,
	updateTalents,
	removeTalent,
	updateQuickSkills,
};
