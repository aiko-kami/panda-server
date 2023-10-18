const { userRightsService, memberService } = require("../../services");
const { apiResponse, memberValidation } = require("../../utils");

const saveDraftJoinProjectRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		// Validate input data
		const validationResult = memberValidation.validateJoinProjectInputs("request", userIdSender, projectId, role, message);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Send join project request
		const joinProjectResult = await memberService.createJoinProjectRequest(userIdSender, projectId, role, message, "draft");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponse(res, "Join project request draft created successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const sendJoinProjectRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		// Validate input data
		const validationResult = memberValidation.validateJoinProjectInputs("request", userIdSender, projectId, role, message);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Send join project request
		const joinProjectResult = await memberService.createJoinProjectRequest(userIdSender, projectId, role, message, "sent");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponse(res, "Join project request sent successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const saveDraftJoinProjectInvitation = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		// Validate input data
		const validationResult = memberValidation.validateJoinProjectInputs("invitation", userIdSender, projectId, role, message);
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
		const joinProjectResult = await memberService.createJoinProjectInvitation(userIdSender, projectId, role, message, userIdReceiver, "draft");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponse(res, "Join project invitation draft created successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const sendJoinProjectInvitation = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "", userIdReceiver = "" } = req.body;
		// Validate input data
		const validationResult = memberValidation.validateJoinProjectInputs("invitation", userIdSender, projectId, role, message, userIdReceiver);
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
		const joinProjectResult = await memberService.createJoinProjectInvitation(userIdSender, projectId, role, message, userIdReceiver, "sent");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponse(res, "Join project invitation sent successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	saveDraftJoinProjectRequest,
	sendJoinProjectRequest,
	saveDraftJoinProjectInvitation,
	sendJoinProjectInvitation,
};
