/**
 * Validate input data for updating user project rights.
 * @param {string} userIdUpdater - The ID of the user performing the update.
 * @param {string} userIdUpdated - The ID of the user whose rights are being updated.
 * @param {string} projectId - The ID of the project.
 * @param {Object} updatedPermissions - An object containing the updated permissions.
 * @returns {Object} - An object containing a status and a message.
 */
const validateUserProjectRightsInputs = (
	userIdUpdater,
	userIdUpdated,
	projectId,
	updatedPermissions
) => {
	//Types validation
	const invalidType =
		typeof userIdUpdater !== "string" ||
		typeof userIdUpdated !== "string" ||
		typeof projectId !== "string" ||
		typeof updatedPermissions !== "object";

	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!userIdUpdater) {
		return { status: "error", message: "Updater user ID is required." };
	}
	// Check if required fields are present
	if (!userIdUpdated) {
		return { status: "error", message: "Updated user ID is required." };
	}
	// Check if required fields are present
	if (!projectId) {
		return { status: "error", message: "Poject ID is required." };
	}
	// Check if required fields are present
	if (!updatedPermissions) {
		return { status: "error", message: "List of updated permissions is required." };
	}

	// Check if every element in updatedPermissions is a boolean
	for (const permission in updatedPermissions) {
		if (typeof updatedPermissions[permission] !== "boolean") {
			return {
				status: "error",
				message: "Invalid permission value(s). Permissions must be booleans.",
			};
		}
	}

	// If all validations pass, return success status
	return {
		status: "success",
		message: "Input data is valid.",
	};
};

module.exports = {
	validateUserProjectRightsInputs,
};
