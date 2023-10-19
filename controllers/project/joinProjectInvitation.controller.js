const { userRightsService, joinProjectService } = require("../../services");
const { apiResponse, joinProjectValidation } = require("../../utils");

const saveDraftInvitation = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "", userIdReceiver = "" } = req.body;

		const joinProjectData = { userIdSender, projectId, role, message, userIdReceiver, requestType: "join project invitation", joinProjectStatus: "draft" };

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the sender
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdSender);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.errorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canSendJoinProjectInvitations permission
		if (!rightsCheckResult.projectRights.permissions.canSendJoinProjectInvitations) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to send join project invitations for this project.");
		}

		// Save draft join project invitation
		const joinProjectResult = await joinProjectService.createJoinProject(joinProjectData);
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project invitation draft created successfully.", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const sendInvitation = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "", userIdReceiver = "" } = req.body;

		const joinProjectData = { userIdSender, projectId, role, message, userIdReceiver, requestType: "join project invitation", joinProjectStatus: "sent" };

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the sender
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdSender);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.errorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canSendJoinProjectInvitations permission
		if (!rightsCheckResult.projectRights.permissions.canSendJoinProjectInvitations) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to send join project invitations for this project.");
		}

		// Send join project invitation
		const joinProjectResult = await joinProjectService.createJoinProject(joinProjectData);
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project invitation sent successfully.", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const removeDraftInvitation = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { joinProjectId = "" } = req.body;

		// Check if joinProjectId is present
		if (!joinProjectId) {
			return apiResponse.clientErrorResponse(res, "JoinProject ID is required.");
		}

		// Remove join project invitation
		const joinProjectResult = await joinProjectService.removeJoinProject(userIdSender, joinProjectId, "join project invitation");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project invitation draft removed successfully.", joinProjectResult.joinProjectRemoved);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// ---------------------------------------TO BE COMPLETED STARTING FROM HERE---------------------------------------

const updateDraftInvitation = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "", userIdReceiver = "", joinProjectId = "" } = req.body;

		const joinProjectData = { userIdSender, projectId, role, message, userIdReceiver, requestType: "join project invitation", joinProjectStatus: "draft", joinProjectId };

		// Check if joinProjectId is present
		if (!joinProjectId) {
			return apiResponse.clientErrorResponse(res, "JoinProject ID is required.");
		}

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the sender
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdSender);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.errorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canSendJoinProjectInvitations permission
		if (!rightsCheckResult.projectRights.permissions.canSendJoinProjectInvitations) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to send join project invitations for this project.");
		}

		// Update draft join project request
		const joinProjectResult = await joinProjectService.updateJoinProject(joinProjectData);
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponse(res, "Join project invitation draft updated successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const cancelInvitation = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Send join project request
		const joinProjectResult = await joinProjectService.createJoinProjectRequest(userIdSender, projectId, role, message, "draft");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponse(res, "Join project request draft created successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const acceptInvitation = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Send join project request
		const joinProjectResult = await joinProjectService.createJoinProjectRequest(userIdSender, projectId, role, message, "draft");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponse(res, "Join project request draft created successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const refuseInvitation = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Send join project request
		const joinProjectResult = await joinProjectService.createJoinProjectRequest(userIdSender, projectId, role, message, "draft");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponse(res, "Join project request draft created successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveDraftsInvitations = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Send join project request
		const joinProjectResult = await joinProjectService.createJoinProjectRequest(userIdSender, projectId, role, message, "draft");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponse(res, "Join project request draft created successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveDraftInvitation = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Send join project request
		const joinProjectResult = await joinProjectService.createJoinProjectRequest(userIdSender, projectId, role, message, "draft");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponse(res, "Join project request draft created successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveAllInvitations = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Send join project request
		const joinProjectResult = await joinProjectService.createJoinProjectRequest(userIdSender, projectId, role, message, "draft");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponse(res, "Join project request draft created successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveInvitation = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Send join project request
		const joinProjectResult = await joinProjectService.createJoinProjectRequest(userIdSender, projectId, role, message, "draft");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponse(res, "Join project request draft created successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	saveDraftInvitation,
	updateDraftInvitation,
	removeDraftInvitation,
	sendInvitation,
	cancelInvitation,
	acceptInvitation,
	refuseInvitation,
	retrieveDraftsInvitations,
	retrieveDraftInvitation,
	retrieveAllInvitations,
	retrieveInvitation,
};
