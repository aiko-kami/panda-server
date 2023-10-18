const { userRightsService, joinProjectService } = require("../../services");
const { apiResponse, joinProjectValidation } = require("../../utils");

const saveDraftJoinProjectRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		const joinProjectData = { userIdSender, projectId, role, message, requestType: "join project request", joinProjectStatus: "draft" };

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Save draft join project request
		const joinProjectResult = await joinProjectService.createJoinProject(joinProjectData);

		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project request draft created successfully.", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const sendJoinProjectRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		const joinProjectData = { userIdSender, projectId, role, message, requestType: "join project request", joinProjectStatus: "sent" };

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Send join project request
		const joinProjectResult = await joinProjectService.createJoinProject(joinProjectData);
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project request sent successfully.", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const saveDraftJoinProjectInvitation = async (req, res) => {
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

const sendJoinProjectInvitation = async (req, res) => {
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

const updateDraftJoinProjectRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "", joinProjectId = "" } = req.body;

		const joinProjectData = { userIdSender, projectId, role, message, requestType: "join project request", joinProjectStatus: "draft", joinProjectId };

		// Check if joinProjectId is present
		if (!joinProjectId) {
			return apiResponse.clientErrorResponse(res, "JoinProject ID is required.");
		}

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Update draft join project request
		const joinProjectResult = await joinProjectService.updateJoinProject(joinProjectData);
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project request draft updated successfully.", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// ---------------------------------------TO BE COMPLETED STARTING FROM HERE---------------------------------------

const removeDraftJoinProjectRequest = async (req, res) => {
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

const cancelJoinProjectRequest = async (req, res) => {
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

const acceptJoinProjectRequest = async (req, res) => {
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

const refuseJoinProjectRequest = async (req, res) => {
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

const retrieveDraftsJoinProjectRequests = async (req, res) => {
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

const retrieveDraftJoinProjectRequest = async (req, res) => {
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

const retrieveAllJoinProjectRequests = async (req, res) => {
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

const retrieveJoinProjectRequest = async (req, res) => {
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

const updateDraftJoinProjectInvitation = async (req, res) => {
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

const removeDraftJoinProjectInvitation = async (req, res) => {
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

const cancelJoinProjectInvitation = async (req, res) => {
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

const acceptJoinProjectInvitation = async (req, res) => {
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

const refuseJoinProjectInvitation = async (req, res) => {
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

const retrieveDraftsJoinProjectInvitations = async (req, res) => {
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

const retrieveDraftJoinProjectInvitation = async (req, res) => {
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

const retrieveAllJoinProjectInvitations = async (req, res) => {
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

const retrieveJoinProjectInvitation = async (req, res) => {
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
	saveDraftJoinProjectRequest,
	sendJoinProjectRequest,
	saveDraftJoinProjectInvitation,
	sendJoinProjectInvitation,
	updateDraftJoinProjectRequest,
	removeDraftJoinProjectRequest,
	cancelJoinProjectRequest,
	acceptJoinProjectRequest,
	refuseJoinProjectRequest,
	retrieveDraftsJoinProjectRequests,
	retrieveDraftJoinProjectRequest,
	retrieveAllJoinProjectRequests,
	retrieveJoinProjectRequest,
	updateDraftJoinProjectInvitation,
	removeDraftJoinProjectInvitation,
	cancelJoinProjectInvitation,
	acceptJoinProjectInvitation,
	refuseJoinProjectInvitation,
	retrieveDraftsJoinProjectInvitations,
	retrieveDraftJoinProjectInvitation,
	retrieveAllJoinProjectInvitations,
	retrieveJoinProjectInvitation,
};
