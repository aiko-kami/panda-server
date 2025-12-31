const { Project, ProjectRights } = require("../../models");
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
				canEditCategory: true,
				canEditSubCategory: true,
				canEditSummary: true,
				canEditDescription: true,
				canEditGoal: true,
				canEditCover: true,
				canEditTags: true,
				canEditStatus: true,
				canEditVisibility: true,
				canEditLocation: true,
				canEditSteps: true,
				canEditQAs: true,
				canEditRights: true,
				canEditMembers: true,
				canRemoveMembers: true,
				canEditTalentsNeeded: true,
				canViewJoinProjectRequests: true,
				canEditJoinProjectRequests: true,
				canViewJoinProjectInvitations: true,
				canEditJoinProjectInvitations: true,
				canViewAttachments: true,
				canAddAttachments: true,
				canEditAttachments: true,
				canRemoveAttachments: true,
				canEditStartDate: true,
				canEditPhase: true,
				canEditObjectives: true,
				canEditCreatorMotivation: true,

				canEditSectionGeneral: true,
				canEditSectionMembers: true,
				canEditSectionRights: true,
				canEditSectionStatus: true,
				canEditSectionLocation: true,
				canEditSectionAttachments: true,
				canEditSectionSteps: true,
				canEditSectionQAs: true,
				canEditSectionDetails: true,
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
				canEditTitle: true,
				canEditCategory: true,
				canEditSubCategory: true,
				canEditSummary: true,
				canEditDescription: true,
				canEditGoal: true,
				canEditCover: true,
				canEditTags: true,
				canEditStatus: true,
				canEditVisibility: true,
				canEditLocation: true,
				canEditSteps: true,
				canEditQAs: true,
				canEditRights: true,
				canEditMembers: true,
				canRemoveMembers: true,
				canEditTalentsNeeded: true,
				canViewJoinProjectRequests: true,
				canEditJoinProjectRequests: true,
				canViewJoinProjectInvitations: true,
				canEditJoinProjectInvitations: true,
				canViewAttachments: true,
				canAddAttachments: true,
				canEditAttachments: true,
				canRemoveAttachments: true,
				canEditStartDate: true,
				canEditPhase: true,
				canEditObjectives: true,
				canEditCreatorMotivation: true,

				canEditSectionGeneral: true,
				canEditSectionMembers: true,
				canEditSectionRights: true,
				canEditSectionStatus: true,
				canEditSectionLocation: true,
				canEditSectionAttachments: true,
				canEditSectionSteps: true,
				canEditSectionQAs: true,
				canEditSectionDetails: true,
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
			if (field === "locationOnlineOnly" || field === "locationCity" || field === "locationCountry" || field === "categoryId") {
				continue; // Skip these fields for now - the check is done later below
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
			(updatedFields.includes("locationCountry") && !userRights.permissions.canEditLocation) ||
			(updatedFields.includes("categoryId") && !userRights.permissions.canEditCategory)
		) {
			return {
				canEdit: false,
				message: "User does not have permission to edit location-related fields.",
			};
		}

		// If the loop completes without returning an error, the user has all necessary permissions
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
		return {
			status: "success",
			message: "Project rights retrieved successfully.",
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

const retrieveProjectRightsByLink = async (projectLink, userId) => {
	try {
		const objectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserId.status === "error") {
			return { status: "error", message: objectIdUserId.message };
		}

		const project = await Project.findOne({ link: projectLink })
			.select("_id statusInfo")
			.populate([
				{ path: "statusInfo.currentStatus", select: "-_id status colors description" },
				{ path: "statusInfo.statusHistory.status", select: "-_id status colors" },
				{ path: "statusInfo.statusHistory.updatedBy", select: "username profilePicture userId" },
				{ path: "privateData.attachments.updatedBy", select: "username profilePicture userId" },
			]);
		if (!project) {
			return {
				status: "error",
				message: "Project not found.",
			};
		}

		const projectRights = await ProjectRights.findOne({
			project: project._id,
			user: objectIdUserId,
		}).select("-_id -__v -project -user -updatedBy -createdAt -updatedAt");

		if (!projectRights) {
			logger.error("An error occurred while retrieving user's project rights: Project rights not found for this user and project.");
			return {
				status: "error",
				message: "An error occurred while retrieving user's project rights: Project rights not found for this user and project.",
			};
		}
		logger.info(`Project rights retrieved successfully. Project link: ${projectLink} - User ID: ${userId}`);
		return {
			status: "success",
			message: "Project rights retrieved successfully.",
			projectRights: projectRights,
			projectStatus: project.statusInfo?.currentStatus ?? null,
		};
	} catch (error) {
		logger.error(`Error while retrieving user's project rights: ${error}`);
		return {
			status: "error",
			message: "An error occurred while retrieving user's project rights.",
		};
	}
};

const retrieveMembersProjectRights = async (projectId, members = []) => {
	try {
		// Convert projectId to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		// Convert members userId to ObjectId
		const userIdStrings = members.map((m) => m.user?.userId);
		const memberObjectIds = [];
		for (const userId of userIdStrings) {
			const objectIdMemberId = encryptTools.convertIdToObjectId(userId);
			if (objectIdMemberId.status === "error") {
				return { status: "error", message: objectIdMemberId.message };
			}
			memberObjectIds.push(objectIdMemberId);
		}

		// retrieve the members rights using previous array
		const membersProjectRights = await ProjectRights.find({
			project: objectIdProjectId,
			user: { $in: memberObjectIds },
		})
			.select("-_id user permissions")
			.populate([{ path: "user", select: "-_id username profilePicture userId" }])
			.lean();

		if (!membersProjectRights) {
			logger.error("An error occurred while retrieving user's project rights: Project rights not found for these users and project.");
			return {
				status: "error",
				message: "An error occurred while retrieving user's project rights: Project rights not found for these users and project.",
			};
		}
		logger.info(`Members project rights retrieved successfully. Project ID: ${projectId}`);
		return {
			status: "success",
			message: "Members project rights retrieved successfully.",
			membersProjectRights: membersProjectRights,
		};
	} catch (error) {
		logger.error(`Error while retrieving members's project rights: ${error}`);
		return {
			status: "error",
			message: "An error occurred while retrieving members's project rights.",
		};
	}
};

/**
 * Update user project rights service.
 * @param {string} projectId - The ID of the project.
 * @param {string} userId - The ID of the user.
 * @param {Object} permissions - An object containing the updated permissions or a string with predefined profiles like owner or member.
 * @returns {Object} - An object containing a status and a message.
 */
const updateUserProjectRights = async (projectId, member, userIdUpdater) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		const objectIdUserIdUpdated = encryptTools.convertIdToObjectId(member.userId);
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

		if (member.permissions === "owner") {
			// Update all the permissions to true
			for (const permission in projectRights.permissions) {
				if (Object.prototype.hasOwnProperty.call(projectRights.permissions, permission)) {
					projectRights.permissions[permission] = true;
				}
			}
		} else if (member.permissions === "member") {
			// Update all permissions to false
			for (const permission in projectRights.permissions) {
				if (Object.prototype.hasOwnProperty.call(projectRights.permissions, permission)) {
					projectRights.permissions[permission] = false;
				}
			}
		} else {
			// Update the permissions based on the request
			for (const permission in member.permissions) {
				if (Object.prototype.hasOwnProperty.call(member.permissions, permission)) {
					// Check if the permission is a valid field in ProjectRights
					if (projectRights.permissions.hasOwnProperty(permission)) {
						projectRights.permissions[permission] = member.permissions[permission];
					}
				}
			}
		}

		// Set the 'updatedBy' field to the ID of the user who is updating
		projectRights.updatedBy = objectIdUserIdUpdater;

		// Save the updated project rights
		await projectRights.save();

		logger.info(`Project rights updated successfully. Project ID: ${projectId} - User ID: ${member.userIdUpdated}`);
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
		const projectRights = await ProjectRights.findOneAndDelete({
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
	retrieveProjectRightsByLink,
	retrieveMembersProjectRights,
	updateUserProjectRights,
	removeUserProjectRights,
};
