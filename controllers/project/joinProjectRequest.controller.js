const { joinProjectService } = require("../../services");
const { apiResponse, joinProjectValidation } = require("../../utils");

const saveDraftRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		const joinProjectData = { userIdSender, projectId, role, message, requestType: "join project request", joinProjectStatus: "draft" };

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
		const { projectId = "", role = "", message = "", joinProjectId = "" } = req.body;

		const joinProjectData = { userIdSender, projectId, role, message, requestType: "join project request", joinProjectStatus: "draft", joinProjectId };

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

const retrieveDraftsRequests = async (req, res) => {
	try {
		const userIdSender = req.userId;

		// Retrieve join project request drafts
		const joinProjectResult = await joinProjectService.retrieveJoinProjects(userIdSender, "join project request", "draft");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project request drafts retrieved successfully.", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveAllRequests = async (req, res) => {
	try {
		const userIdSender = req.userId;

		// Retrieve join project requests
		const joinProjectResult = await joinProjectService.retrieveJoinProjects(userIdSender, "join project request", "all");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project requests retrieved successfully.", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const joinProjectId = req.params.requestId;

		// Validate join project ID and sender ID
		const IdValidationResult = joinProjectValidation.validateJoinProjectIdAndSender(joinProjectId, userIdSender);
		if (IdValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, IdValidationResult.message);
		}

		// Retrieve join project request
		const joinProjectResult = await joinProjectService.retrieveJoinProject(userIdSender, "join project request", joinProjectId);
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project request retrieved successfully.", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const sendRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "", joinProjectId = "" } = req.body;

		const joinProjectData = { userIdSender, projectId, role, message, requestType: "join project request", joinProjectStatus: "sent", joinProjectId };

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

// ---------------------------------------TO BE COMPLETED STARTING FROM HERE---------------------------------------

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

//To be refactor because there is no specific receiver with a join project request. We need to check the user ID who is trying to accept the request and check if he/she has the rights to accept the requests from the project rights
const acceptRequest = async (req, res) => {
	try {
		const userIdReceiver = req.userId;
		const { joinProjectId = "" } = req.body;

		// Validate join project ID and sender ID
		const IdValidationResult = joinProjectValidation.validateJoinProjectIdAndSender(joinProjectId, userIdReceiver);
		if (IdValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, IdValidationResult.message);
		}

		// Accept join project request
		const joinProjectResult = await joinProjectService.updateStatusJoinProject(userIdReceiver, joinProjectId, "accepted", "join project request");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		//Add new member to the proeject

		return apiResponse.successResponseWithData(res, "Join project request accepted successfully.", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

//To be refactor because there is no specific receiver with a join project request. We need to check the user ID who is trying to refuse the request and check if he/she has the rights to refuse the requests from the project rights

const refuseRequest = async (req, res) => {
	try {
		const userIdReceiver = req.userId;
		const { joinProjectId = "" } = req.body;

		// Validate join project ID and sender ID
		const IdValidationResult = joinProjectValidation.validateJoinProjectIdAndSender(joinProjectId, userIdReceiver);
		if (IdValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, IdValidationResult.message);
		}

		// Cancel join project request
		const joinProjectResult = await joinProjectService.updateStatusJoinProject(userIdReceiver, joinProjectId, "cancelled", "join project request");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project request cancelled successfully.", joinProjectResult.joinProject);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	saveDraftRequest,
	updateDraftRequest,
	removeDraftRequest,
	sendRequest,

	retrieveDraftsRequests,
	retrieveAllRequests,
	retrieveRequest,

	cancelRequest,
	acceptRequest,
	refuseRequest,
};
