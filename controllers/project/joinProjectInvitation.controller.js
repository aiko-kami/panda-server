const { joinProjectService, memberService, userRightsService } = require("../../services");
const { apiResponse, joinProjectValidation } = require("../../utils");

const saveDraftInvitation = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", talent = "", message = "", userIdReceiver = "" } = req.body;

		const joinProjectData = { userIdSender, projectId, talent, message, userIdReceiver, requestType: "join project invitation", joinProjectStatus: "draft" };

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the sender
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdSender);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
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

const updateDraftInvitation = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", talent = "", message = "", userIdReceiver = "", joinProjectId = "" } = req.body;

		const joinProjectData = { userIdSender, projectId, talent, message, userIdReceiver, requestType: "join project invitation", joinProjectStatus: "draft", joinProjectId };

		// Validate join project ID and sender ID
		const IdValidationResult = joinProjectValidation.validateJoinProjectIdAndSender(joinProjectId, userIdSender);
		if (IdValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, IdValidationResult.message);
		}

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the sender
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdSender);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
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

		return apiResponse.successResponseWithData(res, "Join project invitation draft updated successfully.", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const removeDraftInvitation = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { joinProjectId = "" } = req.body;

		// Validate join project ID and sender ID
		const IdValidationResult = joinProjectValidation.validateJoinProjectIdAndSender(joinProjectId, userIdSender);
		if (IdValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, IdValidationResult.message);
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

const sendInvitation = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", talent = "", message = "", userIdReceiver = "", joinProjectId = "" } = req.body;

		const joinProjectData = { userIdSender, projectId, talent, message, userIdReceiver, requestType: "join project invitation", joinProjectStatus: "sent", joinProjectId };

		// If join project ID is present, validate join project ID and sender ID
		if (joinProjectId) {
			const IdValidationResult = joinProjectValidation.validateJoinProjectIdAndSender(joinProjectId, userIdSender);
			if (IdValidationResult.status !== "success") {
				return apiResponse.clientErrorResponse(res, IdValidationResult.message);
			}
		}

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the sender
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdSender);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canSendJoinProjectInvitations permission
		if (!rightsCheckResult.projectRights.permissions.canSendJoinProjectInvitations) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to send join project invitations for this project.");
		}

		// Send join project invitation
		let joinProjectResult;
		// If no join project ID is provided in input, create a new join project invitation wtih status "sent"
		if (!joinProjectId) {
			joinProjectResult = await joinProjectService.createJoinProject(joinProjectData);
		} else {
			// If a join project ID is provided in input, update the join project invitation and change status to "sent"
			joinProjectResult = await joinProjectService.updateJoinProject(joinProjectData);
		}

		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project invitation sent successfully.", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveMyDraftsInvitations = async (req, res) => {
	try {
		const userIdSender = req.userId;

		// Retrieve user's join project invitation drafts
		const joinProjectResult = await joinProjectService.retrieveMyJoinProjects(userIdSender, "join project invitation", "draft");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, joinProjectResult.message, joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveAllMyInvitations = async (req, res) => {
	try {
		const userIdSender = req.userId;

		// Retrieve user's join project invitations
		const joinProjectResult = await joinProjectService.retrieveMyJoinProjects(userIdSender, "join project invitation", "all");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, joinProjectResult.message, joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveMyInvitation = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const joinProjectId = req.params.invitationId;

		// Validate join project ID and sender ID
		const IdValidationResult = joinProjectValidation.validateJoinProjectIdAndSender(joinProjectId, userIdSender);
		if (IdValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, IdValidationResult.message);
		}

		// Retrieve user's join project invitation
		const joinProjectResult = await joinProjectService.retrieveMyJoinProject(userIdSender, "join project invitation", joinProjectId);
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, joinProjectResult.message, joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const cancelInvitation = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { joinProjectId = "" } = req.body;

		// Validate join project ID and sender ID
		const IdValidationResult = joinProjectValidation.validateJoinProjectIdAndSender(joinProjectId, userIdSender);
		if (IdValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, IdValidationResult.message);
		}

		// Cancel join project invitation
		const joinProjectResult = await joinProjectService.updateStatusJoinProject(userIdSender, joinProjectId, "cancelled", "join project invitation");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project invitation cancelled successfully.", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const acceptInvitation = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { joinProjectId = "" } = req.body;

		// Validate join project ID and sender ID
		const IdValidationResult = joinProjectValidation.validateJoinProjectIdAndSender(joinProjectId, userIdUpdater);
		if (IdValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, IdValidationResult.message);
		}

		// Accept join project invitation
		const joinProjectResult = await joinProjectService.updateStatusJoinProject(userIdUpdater, joinProjectId, "accepted", "join project invitation");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		const projectId = joinProjectResult.joinProject.projectId;
		const newMemeberId = joinProjectResult.joinProject.userIdReceiver;
		const talent = joinProjectResult.joinProject.talent;
		const userIdSender = joinProjectResult.joinProject.userIdSender;

		//Add new member to the project
		const addedMember = await memberService.updateMemberFromProject(projectId, userIdUpdater, newMemeberId, "add", talent);
		if (addedMember.status !== "success") {
			return apiResponse.serverErrorResponse(res, addedMember.message);
		}

		//Set new member's project rights
		const rightsSet = await userRightsService.setProjectNewMemberRights(newMemeberId, projectId, userIdSender);
		if (rightsSet.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsSet.message);
		}

		return apiResponse.successResponseWithData(res, "Join project invitation accepted successfully. Member added to the project successfully", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const refuseInvitation = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { joinProjectId = "" } = req.body;

		// Validate join project ID and sender ID
		const IdValidationResult = joinProjectValidation.validateJoinProjectIdAndSender(joinProjectId, userIdUpdater);
		if (IdValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, IdValidationResult.message);
		}

		// Refuse join project invitation
		const joinProjectResult = await joinProjectService.updateStatusJoinProject(userIdUpdater, joinProjectId, "refused", "join project invitation");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project invitation refused successfully.", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	saveDraftInvitation,
	updateDraftInvitation,
	removeDraftInvitation,
	sendInvitation,

	retrieveMyDraftsInvitations,
	retrieveAllMyInvitations,
	retrieveMyInvitation,

	cancelInvitation,
	acceptInvitation,
	refuseInvitation,
};
