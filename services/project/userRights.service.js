const { ProjectRights } = require("../../models");
const { logger, encryptTools } = require("../../utils");

/**
 * Set project owner's default rights during the creation of a project.
 * @param {string} userId - The user ID of the user requesting the update.
 * @param {string} projectId - The ID of the project being updated.
 * @returns {Promise} - An object indicating whether the user has the necessary rights or rejects with an error.
 */
const setProjectOwnerRights = async (projectId, userId) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		const objectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserId.status == "error") {
			return { status: "error", message: objectIdUserId.message };
		}

		// Create owner's rights in the database
		const ownerRights = new ProjectRights({
			project: objectIdProjectId,
			user: objectIdUserId,
			permissions: {
				canEditTitle: true,
				canEditGoal: true,
				canEditSummary: true,
				canEditDescription: true,
				canEditCover: true,
				canEditTags: true,
				canEditLocation: true,
				canEditTalentsNeeded: true,
				canEditStartDate: true,
				canEditStatus: true,
				canEditPhase: true,
				canEditObjectives: true,
				canEditCreatorMotivation: true,
				canEditVisibility: true,
				canEditAttachments: true,
				canEditSteps: true,
				canEditQA: true,
				canSeeJoinProjectRequests: true,
				canAnswerJoinProjectRequests: true,
				canSendJoinProjectInvitations: true,
				canEditMembers: true,
				canRemoveMembers: true,
				canEditRights: true,
			},
			updatedBy: objectIdUserId,
		});

		// Save owner's rights to the database
		const createdRights = await ownerRights.save();

		const projectRights = {
			projectId,
			userId,
			permissions: createdRights.permissions,
		};

		logger.info(`Owner's rights stored in database. Project ID: ${projectId} - User ID: ${userId}`);
		return {
			status: "success",
			message: "Owner's rights stored in the database.",
			projectRights,
		};
	} catch (error) {
		logger.error(`Error while setting project owner's rights: ${error}`);
		return { status: "error", message: "An error occurred while setting project owner's rights." };
	}
};

const setProjectNewMemberRights = async (userId, projectId, userIdUpdater) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		const objectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserId.status == "error") {
			return { status: "error", message: objectIdUserId.message };
		}

		const objectIdUserIdUpdater = encryptTools.convertIdToObjectId(userIdUpdater);
		if (objectIdUserIdUpdater.status == "error") {
			return { status: "error", message: objectIdUserIdUpdater.message };
		}

		// Create new member's rights in the database
		const newMemberRights = new ProjectRights({
			project: objectIdProjectId,
			user: objectIdUserId,
			permissions: {
				canEditTitle: false,
				canEditGoal: false,
				canEditSummary: false,
				canEditDescription: false,
				canEditCover: false,
				canEditTags: false,
				canEditLocation: false,
				canEditTalentsNeeded: false,
				canEditStartDate: false,
				canEditStatus: false,
				canEditPhase: false,
				canEditObjectives: false,
				canEditCreatorMotivation: false,
				canEditVisibility: false,
				canEditAttachments: false,
				canEditSteps: false,
				canEditQA: false,
				canSeeJoinProjectRequests: false,
				canAnswerJoinProjectRequests: false,
				canSendJoinProjectInvitations: false,
				canEditMembers: false,
				canRemoveMembers: false,
				canEditRights: false,
			},
			updatedBy: objectIdUserIdUpdater,
		});

		// Save new member's rights to the database
		const createdRights = await newMemberRights.save();

		const projectRights = {
			projectId,
			userId,
			updatedBy: userIdUpdater,
			permissions: createdRights.permissions,
		};

		logger.info(`New member's rights stored in database. Project ID: ${projectId} - User ID: ${userId} - User ID updater: ${userIdUpdater}`);
		return {
			status: "success",
			message: "New member's rights stored in the database.",
			projectRights,
		};
	} catch (error) {
		logger.error(`Error while setting project new member's rights: ${error}`);
		return { status: "error", message: "An error occurred while setting project new member's rights." };
	}
};

/**
 * Check user's rights to update specific fields of a project.
 * @param {string} userId - The user ID of the user requesting the update.
 * @param {string} projectId - The ID of the project being updated.
 * @param {string} updatedFields - An object containing the fields the user wants to update.
 * @returns {Promise} - An object indicating whether the user has the necessary rights or rejects with an error.
 */
const validateUserRights = async (userId, projectId, updatedFields) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		const objectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserId.status == "error") {
			return { status: "error", message: objectIdUserId.message };
		}

		// Find the user's rights for the specified project
		const userRights = await ProjectRights.findOne({
			user: objectIdUserId,
			project: objectIdProjectId,
		});
		if (!userRights) {
			return {
				canEdit: false,
				message: "User rights not found for this project.",
			};
		}

		// Check if the user has permission to edit each field in updatedFields
		for (const field of updatedFields) {
			if (field === "locationOnlineOnly" || field === "locationCity" || field === "locationCountry") {
				continue; // Skip these fields for now
			}
			let canEditField = userRights.permissions[`canEdit${field.charAt(0).toUpperCase() + field.slice(1)}`];
			if (!canEditField) {
				return {
					canEdit: false,
					message: `User does not have permission to edit the field ${field.charAt(0).toUpperCase() + field.slice(1)}.`,
				};
			}
		}

		// Check user rights for locationOnlineOnly, locationCity, and locationCountry
		if (
			(updatedFields.includes("locationOnlineOnly") && !userRights.permissions.canEditLocation) ||
			(updatedFields.includes("locationCity") && !userRights.permissions.canEditLocation) ||
			(updatedFields.includes("locationCountry") && !userRights.permissions.canEditLocation)
		) {
			return {
				canEdit: false,
				message: "User does not have permission to edit location-related fields.",
			};
		}

		// If the loop completes without returning an error, the user has all necessary permissions
		logger.info("User has permission to edit the specified fields");
		return {
			canEdit: true,
			message: "User has permission to edit the specified fields.",
		};
	} catch (error) {
		logger.error(`Error while checking user rights: ${error}`);
		return {
			status: "error",
			canEdit: false,
			message: "An error occurred while checking user rights.",
		};
	}
};

/**
 * retrieve the project rights document for the specified project and user.
 * @param {string} projectId - The ID of the project.
 * @param {string} userId - The ID of the user.
 * @returns {Object} - An object containing whether the user's rights or rejects with an error.
 */
const retrieveProjectRights = async (projectId, userId) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		const objectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserId.status == "error") {
			return { status: "error", message: objectIdUserId.message };
		}

		const projectRights = await ProjectRights.findOne({
			project: objectIdProjectId,
			user: objectIdUserId,
		}).select("-_id -__v");

		if (!projectRights) {
			logger.error("An error occurred while retrieving user's project rights: Project rights not found for this user and project.");
			return {
				status: "error",
				message: "An error occurred while retrieving user's project rights: Project rights not found for this user and project.",
			};
		}
		logger.info(`Project rights found successfully. Project ID: ${projectId} - User ID: ${userId}`);
		return {
			status: "success",
			message: "Project rights found successfully.",
			projectRights: projectRights,
		};
	} catch (error) {
		logger.error(`Error while retrieving user's project rights: ${error}`);
		return {
			status: "error",
			message: "An error occurred while retrieving user's project rights.",
		};
	}
};

/**
 * Update user project rights service.
 * @param {string} projectId - The ID of the project.
 * @param {string} userId - The ID of the user.
 * @param {Object} updatedPermissions - An object containing the updated permissions or a string with predefined profiles like owner or member.
 * @returns {Object} - An object containing a status and a message.
 */
const updateUserProjectRights = async (projectId, userIdUpdated, updatedPermissions, userIdUpdater) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		const objectIdUserIdUpdated = encryptTools.convertIdToObjectId(userIdUpdated);
		if (objectIdUserIdUpdated.status == "error") {
			return { status: "error", message: objectIdUserIdUpdated.message };
		}

		const objectIdUserIdUpdater = encryptTools.convertIdToObjectId(userIdUpdater);
		if (objectIdUserIdUpdater.status == "error") {
			return { status: "error", message: objectIdUserIdUpdater.message };
		}

		// Find the project rights document for the specified project and user
		const projectRights = await ProjectRights.findOne({
			project: objectIdProjectId,
			user: objectIdUserIdUpdated,
		});

		if (!projectRights) {
			logger.error("An error occurred while retrieving user's project rights: Project rights not found for this user and project.");
			return {
				status: "error",
				message: "Project rights not found for this user and project.",
			};
		}

		if (updatedPermissions === "owner") {
			// Update all the permissions to true
			for (const permission in projectRights.permissions) {
				if (Object.prototype.hasOwnProperty.call(projectRights.permissions, permission)) {
					projectRights.permissions[permission] = true;
				}
			}
		} else if (updatedPermissions === "member") {
			// Update all permissions to false
			for (const permission in projectRights.permissions) {
				if (Object.prototype.hasOwnProperty.call(projectRights.permissions, permission)) {
					projectRights.permissions[permission] = false;
				}
			}
		} else {
			// Update the permissions based on the request
			for (const permission in updatedPermissions) {
				if (Object.prototype.hasOwnProperty.call(updatedPermissions, permission)) {
					// Check if the permission is a valid field in ProjectRights
					if (projectRights.permissions.hasOwnProperty(permission)) {
						projectRights.permissions[permission] = updatedPermissions[permission];
					}
				}
			}
		}

		// Set the 'updatedBy' field to the ID of the user who is updating
		projectRights.updatedBy = objectIdUserIdUpdater;

		// Save the updated project rights
		await projectRights.save();

		logger.info(`Project rights updated successfully. Project ID: ${projectId} - User ID: ${userIdUpdated}`);
		return {
			status: "success",
			message: "Project rights updated successfully.",
		};
	} catch (error) {
		logger.error(`Error while retrieving user's project rights: ${error}`);
		return {
			status: "error",
			message: "Error updating project rights: " + error.message,
		};
	}
};

const removeUserProjectRights = async (projectId, userId) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		const objectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserId.status == "error") {
			return { status: "error", message: objectIdUserId.message };
		}

		// Find the project rights document for the specified project and user
		const projectRights = await ProjectRights.findOneAndRemove({
			project: objectIdProjectId,
			user: objectIdUserId,
		});

		if (!projectRights) {
			logger.error("An error occurred while retrieving user's project rights: Project rights not found for this user and project.");
			return {
				status: "error",
				message: "Project rights not found for this user and project.",
			};
		}

		logger.info(`User's project rights removed successfully. Project ID: ${projectId} - User ID: ${userId}`);
		return {
			status: "success",
			message: "User's project rights removed successfully.",
		};
	} catch (error) {
		logger.error(`Error while removing user's project rights: ${error}`);
		return {
			status: "error",
			message: "Error removing project rights: " + error.message,
		};
	}
};

module.exports = {
	setProjectOwnerRights,
	setProjectNewMemberRights,
	validateUserRights,
	retrieveProjectRights,
	updateUserProjectRights,
	removeUserProjectRights,
};
