const { statusService, userRightsService, projectService } = require("../../services");
const { apiResponse, statusValidation, projectValidation, commonValidation, filterTools, encryptTools } = require("../../utils");

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

		// Validate input data for retrieving a project status
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

const retrieveProjectStatusWithId = async (req, res) => {
	try {
		const { projectStatusId = "" } = req.params;

		// Validate input data for retrieving a project status
		const validationResult = statusValidation.validateStatusId(projectStatusId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		//Retrieve status data
		const projectStatusData = await statusService.retrieveStatusById(projectStatusId, ["-_id", "status", "description", "colors"]);
		if (projectStatusData.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectStatusData.message);
		}

		return apiResponse.successResponseWithData(res, projectStatusData.message, projectStatusData.projectStatus);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveProjectStatusWithName = async (req, res) => {
	try {
		const { projectStatusName = "" } = req.params;

		// Validate input data for retrieving a project status
		const validationResult = statusValidation.validateStatusName(projectStatusName);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		//Retrieve status data
		const projectStatusData = await statusService.retrieveStatusByName(projectStatusName, ["-_id", "status", "description", "colors"]);
		if (projectStatusData.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectStatusData.message);
		}

		return apiResponse.successResponseWithData(res, projectStatusData.message, projectStatusData.projectStatus);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveProjectStatuses = async (req, res) => {
	try {
		//Retrieve status data
		const projectStatusData = await statusService.retrieveAllStatuses(["-_id", "status", "description", "colors"]);
		if (projectStatusData.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectStatusData.message);
		}

		return apiResponse.successResponseWithData(res, projectStatusData.message, projectStatusData.projectStatuses);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const createProjectStatus = async (req, res) => {
	try {
		const { projectStatusName = "", projectStatusDescription = "", projectStatusColors = {} } = req.body;

		// Validate input data for creating a project status
		const validationInputsResult = statusValidation.validateStatusNameAndDescription(projectStatusName, projectStatusDescription);
		if (validationInputsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationInputsResult.message);
		}
		const validationColorsResult = commonValidation.validateColors(projectStatusColors);
		if (validationColorsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationColorsResult.message);
		}

		// Call the service to create the project status
		const createdProjectStatus = await statusService.createStatus(projectStatusName, projectStatusDescription, projectStatusColors);
		if (createdProjectStatus.status !== "success") {
			return apiResponse.serverErrorResponse(res, createdProjectStatus.message);
		}

		return apiResponse.successResponseWithData(res, createdProjectStatus.message, createdProjectStatus);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const editProjectStatus = async (req, res) => {
	try {
		const { projectStatusId = "", projectStatusNewName = "", projectStatusNewDescription = "", projectStatusNewColors = {} } = req.body;

		// Validate input data for updating a project status
		const validationIdResult = statusValidation.validateStatusId(projectStatusId);
		if (validationIdResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdResult.message);
		}

		const validationInputsResult = statusValidation.validateStatusNameAndDescription(projectStatusNewName, projectStatusNewDescription);
		if (validationInputsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationInputsResult.message);
		}
		const validationColorsResult = commonValidation.validateColors(projectStatusNewColors);
		if (validationColorsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationColorsResult.message);
		}

		// Call the service to edit the project status
		const editedProjectStatus = await statusService.editStatus(projectStatusId, projectStatusNewName, projectStatusNewDescription, projectStatusNewColors);
		if (editedProjectStatus.status !== "success") {
			return apiResponse.serverErrorResponse(res, editedProjectStatus.message);
		}

		return apiResponse.successResponseWithData(res, editedProjectStatus.message, editedProjectStatus);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const removeProjectStatus = async (req, res) => {
	try {
		const { projectStatusId = "" } = req.body;

		// Validate input data for removing a project status
		const validationResult = statusValidation.validateStatusId(projectStatusId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Call the service to remove the project status
		const removedProjectStatus = await statusService.removeStatus(projectStatusId);
		if (removedProjectStatus.status !== "success") {
			return apiResponse.serverErrorResponse(res, removedProjectStatus.message);
		}

		return apiResponse.successResponseWithData(res, removedProjectStatus.message, removedProjectStatus);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	updateProjectStatus,
	retrieveProjectStatusInfo,
	retrieveProjectStatusWithId,
	retrieveProjectStatusWithName,
	retrieveProjectStatuses,
	createProjectStatus,
	editProjectStatus,
	removeProjectStatus,
};
