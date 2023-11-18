const { joinProjectService, memberService, userRightsService } = require("../../services");
const { apiResponse, joinProjectValidation } = require("../../utils");

const saveDraftRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", talent = "", message = "" } = req.body;

		const joinProjectData = { userIdSender, projectId, talent, message, requestType: "join project request", joinProjectStatus: "draft" };

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Save join project request draft
		const joinProjectResult = await joinProjectService.createJoinProject(joinProjectData);
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project request draft created successfully.", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const updateDraftRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", talent = "", message = "", joinProjectId = "" } = req.body;

		const joinProjectData = { userIdSender, projectId, talent, message, requestType: "join project request", joinProjectStatus: "draft", joinProjectId };

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

		// Update join project request draft
		const joinProjectResult = await joinProjectService.updateJoinProject(joinProjectData);
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project request draft updated successfully.", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const removeDraftRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { joinProjectId = "" } = req.body;

		// Validate join project ID and sender ID
		const IdValidationResult = joinProjectValidation.validateJoinProjectIdAndSender(joinProjectId, userIdSender);
		if (IdValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, IdValidationResult.message);
		}

		// Remove join project request draft
		const joinProjectResult = await joinProjectService.removeJoinProject(userIdSender, joinProjectId, "join project request");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project request draft removed successfully.", joinProjectResult.joinProjectRemoved);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const sendRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", talent = "", message = "", joinProjectId = "" } = req.body;

		const joinProjectData = { userIdSender, projectId, talent, message, requestType: "join project request", joinProjectStatus: "sent", joinProjectId };

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

		let joinProjectResult;
		// If no join project ID is provided in input, create a new join project request wtih status "sent"
		if (!joinProjectId || typeof joinProjectId !== "string") {
			joinProjectResult = await joinProjectService.createJoinProject(joinProjectData);
		} else {
			// If a join project ID is provided in input, update the join project request and change status to "sent"
			joinProjectResult = await joinProjectService.updateJoinProject(joinProjectData);
		}

		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project request sent successfully.", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveMyDraftsRequests = async (req, res) => {
	try {
		const userIdSender = req.userId;

		// Retrieve user's join project request drafts
		const joinProjectResult = await joinProjectService.retrieveMyJoinProjects(userIdSender, "join project request", "draft");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, joinProjectResult.message, joinProjectResult.joinProjects);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveAllMyRequests = async (req, res) => {
	try {
		const userIdSender = req.userId;

		// Retrieve user's join project requests
		const joinProjectResult = await joinProjectService.retrieveMyJoinProjects(userIdSender, "join project request", "all");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, joinProjectResult.message, joinProjectResult.joinProjects);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveMyRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const joinProjectId = req.params.requestId;

		// Validate join project ID and sender ID
		const IdValidationResult = joinProjectValidation.validateJoinProjectIdAndSender(joinProjectId, userIdSender);
		if (IdValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, IdValidationResult.message);
		}

		// Retrieve user's join project request
		const joinProjectResult = await joinProjectService.retrieveMyJoinProject(userIdSender, "join project request", joinProjectId);
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, joinProjectResult.message, joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const cancelRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { joinProjectId = "" } = req.body;

		// Validate join project ID and sender ID
		const IdValidationResult = joinProjectValidation.validateJoinProjectIdAndSender(joinProjectId, userIdSender);
		if (IdValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, IdValidationResult.message);
		}

		// Cancel join project request
		const joinProjectResult = await joinProjectService.updateStatusJoinProject(userIdSender, joinProjectId, "cancelled", "join project request");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project request cancelled successfully.", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const acceptRequest = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { joinProjectId = "" } = req.body;

		// Validate join project ID and sender ID
		const IdValidationResult = joinProjectValidation.validateJoinProjectIdAndSender(joinProjectId, userIdUpdater);
		if (IdValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, IdValidationResult.message);
		}

		// Retrieve join project request
		const joinProjectRetrieved = await joinProjectService.retrieveJoinProject("join project request", joinProjectId);

		console.log("🚀 ~ acceptRequest ~ joinProjectRetrieved:", joinProjectRetrieved);

		if (joinProjectRetrieved.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectRetrieved.message);
		}

		const projectId = joinProjectRetrieved.joinProject.projectId;
		const newMemeberId = joinProjectRetrieved.joinProject.userIdSender;
		const talent = joinProjectRetrieved.joinProject.talent;

		console.log("🚀 ~ acceptRequest ~ projectId:", projectId);

		// Retrieve Project Rights of the sender
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdUpdater);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.errorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canAnswerJoinProjectRequests permission
		if (!rightsCheckResult.projectRights.permissions.canAnswerJoinProjectRequests) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to answer join project requests for this project.");
		}

		// Accept join project request
		const joinProjectResult = await joinProjectService.updateStatusJoinProject(userIdUpdater, joinProjectId, "accepted", "join project request");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		//Add new member to the project
		const addedMember = await memberService.updateMemberFromProject(projectId, newMemeberId, "add", talent);
		if (addedMember.status !== "success") {
			return apiResponse.serverErrorResponse(res, addedMember.message);
		}

		//Set new member's project rights
		const rightsSet = await userRightsService.setProjectNewMemberRights(newMemeberId, projectId, userIdUpdater);
		if (rightsSet.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsSet.message);
		}

		return apiResponse.successResponseWithData(res, "Join project request accepted successfully. Member added to the project successfully", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const refuseRequest = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { joinProjectId = "" } = req.body;

		// Validate join project ID and sender ID
		const IdValidationResult = joinProjectValidation.validateJoinProjectIdAndSender(joinProjectId, userIdUpdater);
		if (IdValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, IdValidationResult.message);
		}

		// Retrieve join project request
		const joinProjectRetrieved = await joinProjectService.retrieveJoinProject("join project request", joinProjectId);
		if (joinProjectRetrieved.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectRetrieved.message);
		}

		const projectId = joinProjectRetrieved.joinProject.projectId;
		// Retrieve Project Rights of the sender
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdUpdater);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.errorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canAnswerJoinProjectRequests permission
		if (!rightsCheckResult.projectRights.permissions.canAnswerJoinProjectRequests) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to answer join project requests for this project.");
		}

		// Decline join project request
		const joinProjectResult = await joinProjectService.updateStatusJoinProject(userIdUpdater, joinProjectId, "refused", "join project request");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project request refused successfully.", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	saveDraftRequest,
	updateDraftRequest,
	removeDraftRequest,
	sendRequest,

	retrieveMyDraftsRequests,
	retrieveAllMyRequests,
	retrieveMyRequest,

	cancelRequest,
	acceptRequest,
	refuseRequest,
};
