const { commentService } = require("../../services");
const { apiResponse, idsValidation, stringValidation } = require("../../utils");

/**
 * Update project comments controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the updated project or an error message.
 */
const addComment = async (req, res) => {
	try {
		const userId = req.userId;

		const { projectId = "", commentContent = "" } = req.body;

		const ids = {
			userId,
			projectId,
		};

		// Validate input data for creating project comment
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const commentValidationResult = stringValidation.validateComment(commentContent);
		if (commentValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, commentValidationResult.message);
		}

		const commentResult = await commentService.editComment(projectId, userId, commentContent, "create");
		if (commentResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, commentResult.message);
		}

		return apiResponse.successResponse(res, commentResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const answerComment = async (req, res) => {
	try {
		const userId = req.userId;

		const { projectId = "", commentIdtoAnswer = "", commentContent = "" } = req.body;

		const ids = {
			userId,
			projectId,
			commentIdtoAnswer,
		};

		// Validate input data for creating project comment answer
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const commentValidationResult = stringValidation.validateComment(commentContent);
		if (commentValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, commentValidationResult.message);
		}

		const commentResult = await commentService.editComment(projectId, userId, commentContent, "answer", commentIdtoAnswer);
		if (commentResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, commentResult.message);
		}

		return apiResponse.successResponse(res, commentResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const editComment = async (req, res) => {
	try {
		const userId = req.userId;

		const { projectId = "", commentId = "", commentContent = "" } = req.body;

		const ids = {
			userId,
			projectId,
			commentId,
		};

		// Validate input data for creating project comment
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const commentValidationResult = stringValidation.validateComment(commentContent);
		if (commentValidationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, commentValidationResult.message);
		}

		const commentResult = await commentService.editComment(projectId, userId, commentContent, "update", commentId);
		if (commentResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, commentResult.message);
		}

		return apiResponse.successResponse(res, commentResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const reportComment = async (req, res) => {
	try {
		const userId = req.userId;

		const { projectId = "", commentId = "" } = req.body;

		const ids = {
			userId,
			projectId,
			commentId,
		};

		// Validate input data for creating project comment
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const commentResult = await commentService.editComment(projectId, userId, "", "report", commentId);
		if (commentResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, commentResult.message);
		}

		return apiResponse.successResponse(res, commentResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const unreportComment = async (req, res) => {
	try {
		const userId = req.userId;

		const { projectId = "", commentId = "" } = req.body;

		const ids = {
			userId,
			projectId,
			commentId,
		};

		// Validate input data for creating project comment
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const commentResult = await commentService.editComment(projectId, userId, "", "unreport", commentId);
		if (commentResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, commentResult.message);
		}

		return apiResponse.successResponse(res, commentResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// Retrive all the project that a user likes
const removeComment = async (req, res) => {
	try {
		const userId = req.userId;

		const { projectId = "", commentId = "" } = req.body;

		const ids = {
			userId,
			projectId,
			commentId,
		};

		// Validate input data for creating project comment
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const commentResult = await commentService.editComment(projectId, userId, "", "remove", commentId);
		if (commentResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, commentResult.message);
		}

		return apiResponse.successResponse(res, commentResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// Retrive for one project the list of users that like this project and count them
const retrieveProjectComments = async (req, res) => {
	try {
		const { projectId = "" } = req.body;

		// Validate input data for updating project like
		const validationResult = idsValidation.validateIdInput(projectId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const commentsResult = await commentService.retrieveProjectComments(projectId);

		if (commentsResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, commentsResult.message);
		}
		return apiResponse.successResponseWithData(res, commentsResult.message, commentsResult.projectComments);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	addComment,
	answerComment,
	editComment,
	reportComment,
	unreportComment,
	removeComment,
	retrieveProjectComments,
};
