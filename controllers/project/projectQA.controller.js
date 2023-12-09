const { likeProjectService } = require("../../services");
const { apiResponse, idsValidation } = require("../../utils");

/**
 * Update project Like controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the updated project or an error message.
 */
const addQAs = async (req, res) => {
	try {
		const userId = req.userId;

		const { projectId = "" } = req.body;

		const ids = {
			userId,
			projectId,
		};

		// Validate input data for updating project like
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const likeResult = await likeProjectService.updateLike(projectId, userId, "like");
		if (likeResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, likeResult.message);
		}

		return apiResponse.successResponse(res, likeResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const editQAs = async (req, res) => {
	try {
		const userId = req.userId;
		const { projectId = "" } = req.body;

		const ids = {
			userId,
			projectId,
		};

		// Validate input data for updating project like
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const likeResult = await likeProjectService.updateLike(projectId, userId, "unlike");
		if (likeResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, likeResult.message);
		}

		return apiResponse.successResponse(res, likeResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const publishQA = async (req, res) => {
	try {
		const userId = req.userId;
		const { projectId = "" } = req.body;

		const ids = {
			userId,
			projectId,
		};

		// Validate input data for updating project like
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const likeResult = await likeProjectService.updateLike(projectId, userId, "unlike");
		if (likeResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, likeResult.message);
		}

		return apiResponse.successResponse(res, likeResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// Retrive all the project that a user likes
const removeQA = async (req, res) => {
	try {
		const userId = req.userId;

		// Validate input data for updating project like
		const validationResult = idsValidation.validateIdInput(userId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const likeResult = await likeProjectService.retrieveUserLikes(userId);

		if (likeResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, likeResult.message);
		}
		return apiResponse.successResponseWithData(res, likeResult.message, likeResult.userLikes);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// Retrive for one project the list of users that like this project and count them
const retrieveProjectQAs = async (req, res) => {
	try {
		const { projectId = "" } = req.body;

		// Validate input data for updating project like
		const validationResult = idsValidation.validateIdInput(projectId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const likeResult = await likeProjectService.retrieveProjectLikes(projectId);

		if (likeResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, likeResult.message);
		}
		return apiResponse.successResponseWithData(res, likeResult.message, likeResult.projectLikes);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	addQAs,
	editQAs,
	publishQA,
	removeQA,
	retrieveProjectQAs,
};
