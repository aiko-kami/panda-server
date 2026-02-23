const { commentService } = require("../../services");
const { apiResponse, idsValidation, stringValidation, commentTools } = require("../../utils");

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

const likeComment = async (req, res) => {
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

		const commentResult = await commentService.editComment(projectId, userId, "", "like", commentId);
		if (commentResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, commentResult.message);
		}

		return apiResponse.successResponse(res, commentResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const unlikeComment = async (req, res) => {
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

		const commentResult = await commentService.editComment(projectId, userId, "", "unlike", commentId);
		if (commentResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, commentResult.message);
		}

		return apiResponse.successResponse(res, commentResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const dislikeComment = async (req, res) => {
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

		const commentResult = await commentService.editComment(projectId, userId, "", "dislike", commentId);
		if (commentResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, commentResult.message);
		}

		return apiResponse.successResponse(res, commentResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const undislikeComment = async (req, res) => {
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

		const commentResult = await commentService.editComment(projectId, userId, "", "undislike", commentId);
		if (commentResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, commentResult.message);
		}

		return apiResponse.successResponse(res, commentResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

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
		const { projectId = "" } = req.params;
		const userId = req.userId;

		// Validate input data for updating project like
		const validationResult = idsValidation.validateIdInput(projectId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const commentsResult = await commentService.retrieveProjectComments(projectId);
		if (commentsResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, commentsResult.message);
		}

		if (userId !== "unknown") {
			// Check if the user reported the comments and add this information to the comments
			const flaggedCommentsResult = commentTools.flagUserReportedComments(commentsResult.projectComments, userId);
			if (flaggedCommentsResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, flaggedCommentsResult.message);
			}

			commentsResult.projectComments = flaggedCommentsResult.comments;

			// Check if the user is the author of the comments and add this information to the comments
			const flaggedOwnCommentsResult = commentTools.flagUserOwnComments(flaggedCommentsResult.comments, userId);
			if (flaggedOwnCommentsResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, flaggedOwnCommentsResult.message);
			}

			commentsResult.projectComments = flaggedOwnCommentsResult.comments;

			// Check if the user liked the comments and add this information to the comments
			const flaggedLikedCommentsResult = commentTools.flagUserLikedComments(flaggedOwnCommentsResult.comments, userId);
			if (flaggedLikedCommentsResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, flaggedLikedCommentsResult.message);
			}

			commentsResult.projectComments = flaggedLikedCommentsResult.comments;

			// Check if the user disliked the comments and add this information to the comments
			const flaggedDislikedCommentsResult = commentTools.flagUserDislikedComments(flaggedLikedCommentsResult.comments, userId);
			if (flaggedDislikedCommentsResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, flaggedDislikedCommentsResult.message);
			}

			commentsResult.projectComments = flaggedDislikedCommentsResult.comments;
		}

		// Remove the list of users that liked and unliked the comments and replace it with the count of likes and unlikes for security and privacy
		commentsLikesListResult = commentTools.countLikesComments(commentsResult.projectComments);
		if (commentsLikesListResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, commentsLikesListResult.message);
		}

		// Remove the list of users that reported the comments for security and privacy
		commentsReportListResult = commentTools.removeReportUserList(commentsLikesListResult.comments);
		if (commentsReportListResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, commentsReportListResult.message);
		}

		// Remove the field isAnswerTo for the answers to avoid confusion on the frontend and replace it with a field answerToCommentId which contains the id of the comment to which it is an answer
		commentsAnswerCleanResult = commentTools.removeIsAnswerToField(commentsReportListResult.comments);
		if (commentsAnswerCleanResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, commentsAnswerCleanResult.message);
		}

		return apiResponse.successResponseWithData(res, commentsResult.message, { comments: commentsAnswerCleanResult.comments });
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
	likeComment,
	unlikeComment,
	dislikeComment,
	undislikeComment,
	removeComment,
	retrieveProjectComments,
};
