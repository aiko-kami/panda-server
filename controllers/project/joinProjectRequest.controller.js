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

const sendRequest = async (req, res) => {
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

const updateDraftRequest = async (req, res) => {
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

const removeDraftRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { joinProjectId = "" } = req.body;

		// Check if joinProjectId is present
		if (!joinProjectId) {
			return apiResponse.clientErrorResponse(res, "JoinProject ID is required.");
		}

		// Remove join project request
		const joinProjectResult = await joinProjectService.removeJoinProject(userIdSender, joinProjectId, "join project request");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponseWithData(res, "Join project request draft removed successfully.", joinProjectResult.joinProjectRemoved);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// ---------------------------------------TO BE COMPLETED STARTING FROM HERE---------------------------------------

const cancelRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Send join project request
		const joinProjectResult = await joinProjectService.createJoinProject(userIdSender, projectId, role, message, "draft");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponse(res, "Join project request draft created successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const acceptRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Send join project request
		const joinProjectResult = await joinProjectService.createJoinProject(userIdSender, projectId, role, message, "draft");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponse(res, "Join project request draft created successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const refuseRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Send join project request
		const joinProjectResult = await joinProjectService.createJoinProject(userIdSender, projectId, role, message, "draft");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponse(res, "Join project request draft created successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveDraftsRequests = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Send join project request
		const joinProjectResult = await joinProjectService.createJoinProject(userIdSender, projectId, role, message, "draft");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponse(res, "Join project request draft created successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveDraftRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Send join project request
		const joinProjectResult = await joinProjectService.createJoinProject(userIdSender, projectId, role, message, "draft");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponse(res, "Join project request draft created successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveAllRequests = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Send join project request
		const joinProjectResult = await joinProjectService.createJoinProject(userIdSender, projectId, role, message, "draft");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponse(res, "Join project request draft created successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveRequest = async (req, res) => {
	try {
		const userIdSender = req.userId;
		const { projectId = "", role = "", message = "" } = req.body;

		// Validate input data
		const validationResult = joinProjectValidation.validateJoinProjectInputs(joinProjectData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Send join project request
		const joinProjectResult = await joinProjectService.createJoinProject(userIdSender, projectId, role, message, "draft");
		if (joinProjectResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, joinProjectResult.message);
		}

		return apiResponse.successResponse(res, "Join project request draft created successfully.");
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	saveDraftRequest,
	updateDraftRequest,
	removeDraftRequest,
	sendRequest,
	cancelRequest,
	acceptRequest,
	refuseRequest,
	retrieveDraftsRequests,
	retrieveDraftRequest,
	retrieveAllRequests,
	retrieveRequest,
};
