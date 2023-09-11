const { ProjectRights } = require("../../models");
const { logger } = require("../../utils");

/**
 * Check user's rights to update specific fields of a project.
 * @param {string} userId - The user ID of the user requesting the update.
 * @param {string} projectId - The ID of the project being updated.
 * @param {string} updatedFields - An object containing the fields the user wants to update.
 * @returns {Promise} - An object indicating whether the user has the necessary rights or rejects with an error.
 */
const checkUserRights = async (userId, projectId, updatedFields) => {
	console.log("🚀 ~ checkUserRights ~ updatedFields:", updatedFields);

	try {
		// Find the user's rights for the specified project
		const userRights = await ProjectRights.findOne({
			userId: userId,
			projectId: projectId,
		});

		console.log("🚀 ~ checkUserRights ~ userRights:", userRights);

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

			console.log("🚀 ~ checkUserRights ~ field:", field);

			let canEditField =
				userRights.permissions[`canEdit${field.charAt(0).toUpperCase() + field.slice(1)}`];
			console.log("🚀 ~ checkUserRights ~ canEditField:", canEditField);
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
		throw new Error("Error checking user rights: " + error.message);
	}
};

module.exports = {
	checkUserRights,
};
