const { userRightsService } = require("../../services");
const { apiResponse, ProjectRightsValidation } = require("../../utils");

/**
 * Edit user's right to update a project controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the created category or an error message.
 */
const updateUserProjectRights = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { updatedPermissions, userIdUpdated } = req.body;
		const { projectId } = req.params;

		// Validate input data for updating user's right
		const validationResult = ProjectRightsValidation.validateUserProjectRightsInputs(
			userIdUpdater,
			userIdUpdated,
			projectId,
			updatedPermissions
		);

		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Use the retrieveProjectRights function to check if theRights
		const rightsCheckResult = await userRightsService.retrieveProjectRights(
			projectId,
			userIdUpdater
		);

		if (rightsCheckResult.status !== "success") {
			return apiResponse.errorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditRights permission
		if (!rightsCheckResult.projectRights.permissions.canEditRights) {
			return apiResponse.unauthorizedResponse(
				res,
				"You do not have permission to update project rights."
			);
		}

		// Update the user's project rights
		const updateResult = await userRightsService.updateUserProjectRights(
			projectId,
			userIdUpdated,
			updatedPermissions,
			userIdUpdater
		);

		if (updateResult.status !== "success") {
			return apiResponse.errorResponse(res, updateResult.message);
		}
		return apiResponse.successResponse(res, updateResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, "An error occurred while updating project rights.");
	}
};

module.exports = {
	updateUserProjectRights,
};
