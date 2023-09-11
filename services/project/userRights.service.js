const { ProjectRights } = require("../../models");
const { logger } = require("../../utils");

/**
 * Check user's rights to update specific fields of a project.
 * @param {string} userId - The user ID of the user requesting the update.
 * @param {string} projectId - The ID of the project being updated.
 * @param {string} updatedFields - An object containing the fields the user wants to update.
 * @returns {Promise} - An object indicating whether the user has the necessary rights or rejects with an error.
 */
const setProjectOwnerRights = async (userId, projectId) => {
	try {
	} catch (error) {
		logger.error(`Error while setting project owner's rights: ${error}`);
		return { status: "error", message: "An error occurred while setting project owner's rights." };
	}
};

/**
 * Check user's rights to update specific fields of a project.
 * @param {string} userId - The user ID of the user requesting the update.
 * @param {string} projectId - The ID of the project being updated.
 * @param {string} updatedFields - An object containing the fields the user wants to update.
 * @returns {Promise} - An object indicating whether the user has the necessary rights or rejects with an error.
 */
const checkUserRights = async (userId, projectId, updatedFields) => {
	try {
		// Find the user's rights for the specified project
		const userRights = await ProjectRights.findOne({
			userId: userId,
			projectId: projectId,
		});
		if (!userRights) {
			return {
				canEdit: false,
				message: "User rights not found for this project.",
			};
		}

		// Check if the user has permission to edit each field in updatedFields
		for (const field in updatedFields) {
			if (
				field === "locationOnlineOnly" ||
				field === "locationCity" ||
				field === "locationCountry"
			) {
				continue; // Skip these fields for now
			}
			let canEditField =
				userRights.permissions[`canEdit${field.charAt(0).toUpperCase() + field.slice(1)}`];
			if (!canEditField) {
				return {
					canEdit: false,
					message: `User does not have permission to edit the field ${field.toUpperCase()}.`,
				};
			}
		}

		// Check user rights for locationOnlineOnly, locationCity, and locationCountry
		if (
			(updatedFields.locationOnlineOnly !== undefined && !userRights.permissions.canEditLocation) ||
			(updatedFields.locationCity !== undefined && !userRights.permissions.canEditLocation) ||
			(updatedFields.locationCountry !== undefined && !userRights.permissions.canEditLocation)
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
		return { status: "error", message: "An error occurred while checking user rights." };
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
		const projectRights = await ProjectRights.findOne({
			projectId: projectId,
			userId: userId,
		});

		if (!projectRights) {
			logger.error(
				"An error occurred while retrieving user's project rights: Project rights not found for this user and project."
			);
			return {
				status: "error",
				message:
					"An error occurred while retrieving user's project rights: Project rights not found for this user and project.",
			};
		}
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

module.exports = {
	setProjectOwnerRights,
	checkUserRights,
	retrieveProjectRights,
};
