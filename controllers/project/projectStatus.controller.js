const { statusService, userRightsService, projectService } = require("../../services");
const { apiResponse, statusValidation, projectValidation, filterTools, encryptTools } = require("../../utils");

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

const retrieveProjectStatusInfo = async (req, res) => {
	try {
		const userId = req.userId;
		const { projectId = "" } = req.params;

		// Validate input data for creating a project
		const validationResult = projectValidation.validateProjectIdAndUserId(projectId, userId, "mandatory");
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		//Retrieve project data
		const projectData = await projectService.retrieveProjectById(projectId, ["-_id", "title", "members", "statusInfo", "projectId"]);
		if (projectData.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectData.message);
		}

		//Verify user is member of the project
		const projectMembers = projectData.project.members;

		// Convert id to ObjectId
		const objectIdUserId = encryptTools.convertIdToObjectId(userId);

		if (objectIdUserId.status == "error") {
			return apiResponse.serverErrorResponse(res, objectIdUserId.message);
		}

		// Find the user in the project's members
		const isUserProjectMember = projectMembers.find((member) => encryptTools.convertIdToObjectId(member.user.userId).toString() === objectIdUserId.toString());

		// If user is not member of the project, return error
		if (!isUserProjectMember) {
			return apiResponse.unauthorizedResponse(res, "Status info only available for the members of the project.");
		}

		//Filter users public data from projects
		projectData.project.members = undefined;
		const projectFiltered = filterTools.filterProjectOutputFields(projectData.project, userId);
		if (projectFiltered.status !== "success") {
			return apiResponse.clientErrorResponse(res, projectFiltered.message);
		}
		return apiResponse.successResponseWithData(res, projectData.message, projectFiltered.project);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	updateProjectStatus,
	retrieveProjectStatusInfo,
};
