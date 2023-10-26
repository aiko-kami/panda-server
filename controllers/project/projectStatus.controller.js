const { statusService, userRightsService } = require("../../services");
const { apiResponse, statusValidation } = require("../../utils");

/**
 * Update project status controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the updated status or an error message.
 */
const updateProjectStatus = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { projectId = "" } = req.params;
		const { newStatus = "" } = req.body;

		// Validate input data for updating project status
		const validationResult = statusValidation.validateStatusInputs(userIdUpdater, projectId, newStatus);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the updater
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdUpdater);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.errorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditStatus permission
		if (!rightsCheckResult.projectRights.permissions.canEditStatus) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update status for this project.");
		}

		const updateStatusResult = await statusService.updateStatus(projectId, userIdUpdater, newStatus);
		if (updateStatusResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateStatusResult.message);
		}

		return apiResponse.successResponse(res, updateStatusResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	updateProjectStatus,
};
