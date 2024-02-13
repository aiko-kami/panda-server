const { statusService, userRightsService, projectService } = require("../../services");
const { apiResponse, statusValidation, filterTools } = require("../../utils");

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
		const { newStatus = "", reason = "" } = req.body;

		// Validate input data for updating project status
		const validationResult = statusValidation.validateStatusInputs(userIdUpdater, projectId, newStatus, reason);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the updater
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdUpdater);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditStatus permission
		if (!rightsCheckResult.projectRights.permissions.canEditStatus) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update status for this project.");
		}

		const updateStatusResult = await statusService.updateStatus(projectId, userIdUpdater, newStatus, reason);
		if (updateStatusResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateStatusResult.message);
		}

		// Retrieve the updated project
		const updatedProject = await projectService.retrieveProjectById(projectId, [
			"-_id",
			"title",
			"goal",
			"summary",
			"description",
			"cover",
			"crush",
			"category",
			"subCategory",
			"location",
			"startDate",
			"creatorMotivation",
			"tags",
			"talentsNeeded",
			"objectives",
			"updatedBy",
			"visibility",
			"statusInfo",
			"privateData",
			"createdAt",
			"members",
			"projectId",
		]);
		if (updatedProject.status !== "success") {
			return apiResponse.serverErrorResponse(res, updatedProject.message);
		}

		//Filter users public data from projects
		const projectFiltered = filterTools.filterProjectOutputFields(updatedProject.project, userIdUpdater);
		if (projectFiltered.status !== "success") {
			return apiResponse.clientErrorResponse(res, projectFiltered.message);
		}
		return apiResponse.successResponseWithData(res, updateStatusResult.message, projectFiltered.project);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	updateProjectStatus,
};
