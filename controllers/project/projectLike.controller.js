const { likeProjectService, userService } = require("../../services");
const { apiResponse, idsValidation } = require("../../utils");

/**
 * Update project Like controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the updated project or an error message.
 */
const likeProject = async (req, res) => {
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

const unlikeProject = async (req, res) => {
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
const retrieveUserPublicLikes = async (req, res) => {
	try {
		const { userId = "" } = req.body;

		// Validate input data
		const validationResult = idsValidation.validateIdInput(userId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Verify if user likes are public
		const userRetrieved = await userService.retrieveUserById(userId, ["projectLikePublic"]);
		if (userRetrieved.status !== "success") {
			return apiResponse.clientErrorResponse(res, userRetrieved.message);
		}

		// In case user likes are private return message likes are private
		if (!userRetrieved.user.projectLikePublic) {
			return apiResponse.serverErrorResponse(res, "User project likes are private");

			// In case user likes are public retrive the projects that user likes
		} else if (userRetrieved.user.projectLikePublic) {
			const likeResult = await likeProjectService.retrieveUserLikes(userId);
			if (likeResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, likeResult.message);
			}
			return apiResponse.successResponseWithData(res, likeResult.message, likeResult.userLikes);
		}
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// Retrive all the project that current connected user likes
const retrieveUserPrivateLikes = async (req, res) => {
	try {
		const userId = req.userId;

		// Validate input data
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
const retrieveProjectLikes = async (req, res) => {
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
	likeProject,
	unlikeProject,
	retrieveUserPublicLikes,
	retrieveUserPrivateLikes,
	retrieveProjectLikes,
};
