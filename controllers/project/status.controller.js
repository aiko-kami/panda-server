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
		const { newStatusId = "", statusReason = "" } = req.body;

		// Validate input data for updating project status
		const validationResult = statusValidation.validateStatusInputs(userIdUpdater, projectId, newStatusId, statusReason);
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

		const updateStatusResult = await statusService.updateProjectStatus(projectId, userIdUpdater, newStatusId, statusReason);
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

const retrieveStatusWithIdHandler = (statusType) => {
	return async (req, res) => {
		try {
			const { statusId = "" } = req.params;
			// Validate input data for retrieving a project status
			const validationResult = statusValidation.validateStatusId(statusId);
			if (validationResult.status !== "success") {
				return apiResponse.clientErrorResponse(res, validationResult.message);
			}

			//Retrieve status data
			const statusResult = await statusService.retrieveStatusById(statusId, statusType, ["-_id", "status", "description", "colors"]);
			if (statusResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, statusResult.message);
			}

			return apiResponse.successResponseWithData(res, statusResult.message, statusResult.status);
		} catch (error) {
			return apiResponse.serverErrorResponse(res, error.message);
		}
	};
};

const retrieveStatusWithNameHandler = (statusType) => {
	return async (req, res) => {
		try {
			const { statusName = "" } = req.params;
			// Validate input data for retrieving a project status
			const validationResult = statusValidation.validateStatusName(statusName);
			if (validationResult.status !== "success") {
				return apiResponse.clientErrorResponse(res, validationResult.message);
			}

			//Retrieve status data
			const statusResult = await statusService.retrieveStatusByName(statusName, statusType, ["-_id", "status", "description", "colors"]);
			if (statusResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, statusResult.message);
			}

			return apiResponse.successResponseWithData(res, statusResult.message, statusResult.status);
		} catch (error) {
			return apiResponse.serverErrorResponse(res, error.message);
		}
	};
};

const retrieveAllStatusesHandler = (statusType) => {
	return async (req, res) => {
		try {
			//Retrieve status data
			const statusResult = await statusService.retrieveAllStatuses(statusType, ["-_id", "status", "description", "colors"]);
			if (statusResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, statusResult.message);
			}

			return apiResponse.successResponseWithData(res, statusResult.message, statusResult.statuses);
		} catch (error) {
			return apiResponse.serverErrorResponse(res, error.message);
		}
	};
};

const createStatusHandler = (statusType) => {
	return async (req, res) => {
		try {
			const { statusName = "", statusDescription = "", statusColors = {} } = req.body;

			// Validate input data for creating a status
			const validationInputsResult = statusValidation.validateStatusNameAndDescription(statusName, statusDescription);
			if (validationInputsResult.status !== "success") {
				return apiResponse.clientErrorResponse(res, validationInputsResult.message);
			}
			const validationColorsResult = commonValidation.validateColors(statusColors);
			if (validationColorsResult.status !== "success") {
				return apiResponse.clientErrorResponse(res, validationColorsResult.message);
			}

			// Call the service to create the status
			const createdStatus = await statusService.createStatus(statusName, statusDescription, statusColors, statusType);
			if (createdStatus.status !== "success") {
				return apiResponse.serverErrorResponse(res, createdStatus.message);
			}

			return apiResponse.successResponseWithData(res, createdStatus.message, createdStatus.data);
		} catch (error) {
			return apiResponse.serverErrorResponse(res, error.message);
		}
	};
};

const editStatusHandler = (statusType) => {
	return async (req, res) => {
		try {
			const { statusId = "", statusNewName = "", statusNewDescription = "", statusNewColors = {} } = req.body;

			// Validate input data for updating a status
			const validationIdResult = statusValidation.validateStatusId(statusId);
			if (validationIdResult.status !== "success") {
				return apiResponse.clientErrorResponse(res, validationIdResult.message);
			}

			const validationInputsResult = statusValidation.validateStatusNameAndDescription(statusNewName, statusNewDescription);
			if (validationInputsResult.status !== "success") {
				return apiResponse.clientErrorResponse(res, validationInputsResult.message);
			}
			const validationColorsResult = commonValidation.validateColors(statusNewColors);
			if (validationColorsResult.status !== "success") {
				return apiResponse.clientErrorResponse(res, validationColorsResult.message);
			}

			// Call the service to edit the status
			const editedStatus = await statusService.editStatus(statusId, statusNewName, statusNewDescription, statusNewColors, statusType);
			if (editedStatus.status !== "success") {
				return apiResponse.serverErrorResponse(res, editedStatus.message);
			}

			return apiResponse.successResponseWithData(res, editedStatus.message, editedStatus.data);
		} catch (error) {
			return apiResponse.serverErrorResponse(res, error.message);
		}
	};
};

const removeStatusHandler = (statusType) => {
	return async (req, res) => {
		try {
			const { statusId = "" } = req.body;

			// Validate input data for removing a status
			const validationResult = statusValidation.validateStatusId(statusId);
			if (validationResult.status !== "success") {
				return apiResponse.clientErrorResponse(res, validationResult.message);
			}

			// Call the service to remove the status
			const removedStatus = await statusService.removeStatus(statusId, statusType);
			if (removedStatus.status !== "success") {
				return apiResponse.serverErrorResponse(res, removedStatus.message);
			}

			return apiResponse.successResponseWithData(res, removedStatus.message, removedStatus.data);
		} catch (error) {
			return apiResponse.serverErrorResponse(res, error.message);
		}
	};
};

// Project Status
const retrieveProjectStatusWithId = retrieveStatusWithIdHandler("project");
const retrieveProjectStatusWithName = retrieveStatusWithNameHandler("project");
const retrieveAllProjectStatuses = retrieveAllStatusesHandler("project");
const createProjectStatus = createStatusHandler("project");
const editProjectStatus = editStatusHandler("project");
const removeProjectStatus = removeStatusHandler("project");

// Join Project Status
const retrieveJoinProjectStatusWithId = retrieveStatusWithIdHandler("joinProject");
const retrieveJoinProjectStatusWithName = retrieveStatusWithNameHandler("joinProject");
const retrieveAllJoinProjectStatuses = retrieveAllStatusesHandler("joinProject");
const createJoinProjectStatus = createStatusHandler("joinProject");
const editJoinProjectStatus = editStatusHandler("joinProject");
const removeJoinProjectStatus = removeStatusHandler("joinProject");

module.exports = {
	updateProjectStatus,
	retrieveProjectStatusInfo,
	retrieveProjectStatusWithName,
	retrieveJoinProjectStatusWithName,
	retrieveProjectStatusWithId,
	retrieveJoinProjectStatusWithId,
	retrieveAllProjectStatuses,
	retrieveAllJoinProjectStatuses,
	createProjectStatus,
	editProjectStatus,
	removeProjectStatus,
	createJoinProjectStatus,
	editJoinProjectStatus,
	removeJoinProjectStatus,
};
