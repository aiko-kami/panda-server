const { userRightsService, projectStepQAService } = require("../../services");
const { apiResponse, idsValidation, stringValidation } = require("../../utils");

/**
 * Update project QAs controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the updated project or an error message.
 */
const addQAs = async (req, res) => {
	try {
		const userId = req.userId;

		const { projectId = "", QAs = [{ question: "", response: "", published: false }] } = req.body;

		const ids = {
			userId,
			projectId,
		};

		// Validate input data for creating project QAs
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const QAValidationResult = stringValidation.validateQAs(QAs);
		if (QAValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, QAValidationResult.message);
		}

		// Retrieve Project Rights of the user
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userId);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditQAs permission
		if (!rightsCheckResult.projectRights.permissions.canEditQAs) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update Q&A for this project.");
		}

		const QAResult = await projectStepQAService.editQAs(projectId, userId, QAs, "create");
		if (QAResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, QAResult.message);
		}

		return apiResponse.successResponse(res, QAResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const updateQAs = async (req, res) => {
	try {
		const userId = req.userId;
		const { projectId = "", QAs = [] } = req.body;
		const ids = {
			userId,
			projectId,
		};

		// Validate input data for updating project QAs
		const validationIdsResult = idsValidation.validateIdsInputs(ids);
		if (validationIdsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdsResult.message);
		}

		const validationQAsResult = stringValidation.validateQAs(QAs);
		if (validationQAsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationQAsResult.message);
		}

		// Retrieve Project Rights of the user
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userId);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditQAs permission
		if (!rightsCheckResult.projectRights.permissions.canEditQAs) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update Q&A for this project.");
		}

		const QAResult = await projectStepQAService.editQAs(projectId, userId, QAs, "update");
		if (QAResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, QAResult.message);
		}

		return apiResponse.successResponse(res, QAResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const publishQA = async (req, res) => {
	try {
		const userId = req.userId;

		const { projectId = "", QAQuestion = "" } = req.body;

		const ids = {
			userId,
			projectId,
		};

		// Validate input data for publishing project QA
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const QAValidationResult = stringValidation.validateQAQuestion(QAQuestion);
		if (QAValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, QAValidationResult.message);
		}

		// Retrieve Project Rights of the user
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userId);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditQAs permission
		if (!rightsCheckResult.projectRights.permissions.canEditQAs) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update Q&A for this project.");
		}

		const QAResult = await projectStepQAService.editQAs(projectId, userId, QAQuestion, "publish");
		if (QAResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, QAResult.message);
		}

		return apiResponse.successResponse(res, QAResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const unpublishQA = async (req, res) => {
	try {
		const userId = req.userId;

		const { projectId = "", QAQuestion = "" } = req.body;

		const ids = {
			userId,
			projectId,
		};

		// Validate input data for unpublishing project QA
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const QAValidationResult = stringValidation.validateQAQuestion(QAQuestion);
		if (QAValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, QAValidationResult.message);
		}

		// Retrieve Project Rights of the user
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userId);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditQAs permission
		if (!rightsCheckResult.projectRights.permissions.canEditQAs) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update Q&A for this project.");
		}

		const QAResult = await projectStepQAService.editQAs(projectId, userId, QAQuestion, "unpublish");
		if (QAResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, QAResult.message);
		}

		return apiResponse.successResponse(res, QAResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// Retrive all the project that a user likes
const removeQA = async (req, res) => {
	try {
		const userId = req.userId;

		const { projectId = "", QAQuestion = "" } = req.body;

		const ids = {
			userId,
			projectId,
		};

		// Validate input data for removing project QA
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const QAValidationResult = stringValidation.validateQAQuestion(QAQuestion);
		if (QAValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, QAValidationResult.message);
		}

		// Retrieve Project Rights of the user
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userId);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditQAs permission
		if (!rightsCheckResult.projectRights.permissions.canEditQAs) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update Q&A for this project.");
		}

		const QAResult = await projectStepQAService.editQAs(projectId, userId, QAQuestion, "remove");
		if (QAResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, QAResult.message);
		}

		return apiResponse.successResponse(res, QAResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// Retrive for one project the list of users that like this project and count them
const retrieveProjectQAsPublished = async (req, res) => {
	try {
		const { projectId = "" } = req.body;

		// Validate input data for retrieving project QA
		const validationResult = idsValidation.validateIdInput(projectId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const QAResult = await projectStepQAService.retrieveProjectQAs(projectId, "published");

		if (QAResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, QAResult.message);
		}
		return apiResponse.successResponseWithData(res, QAResult.message, QAResult.QAsOutput);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// Retrive for one project the list of users that like this project and count them
const retrieveProjectQAsAll = async (req, res) => {
	try {
		const userId = req.userId;

		const { projectId = "" } = req.body;

		const ids = {
			userId,
			projectId,
		};

		// Validate input data for retrieving project QA
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the user
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userId);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditQAs permission
		if (!rightsCheckResult.projectRights.permissions.canEditQAs) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update Q&A for this project.");
		}

		const QAResult = await projectStepQAService.retrieveProjectQAs(projectId, "all", userId);
		if (QAResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, QAResult.message);
		}
		return apiResponse.successResponseWithData(res, QAResult.message, QAResult.QAsOutput);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	addQAs,
	updateQAs,
	publishQA,
	unpublishQA,
	removeQA,
	retrieveProjectQAsPublished,
	retrieveProjectQAsAll,
};
