const { convertIdToObjectId } = require("./encrypt.tools");

const flagUserReportedComments = (comments = [], userId) => {
	try {
		if (!comments || comments.length === 0 || !userId) {
			return { status: "error", message: "No comments or user ID provided." };
		}

		// Convert id to ObjectId
		const objectIdUserId = convertIdToObjectId(userId);
		if (objectIdUserId.status == "error") {
			return { status: "error", message: objectIdUserId.message };
		}

		const processCommentThread = (commentList) => {
			return commentList.map((commentItem) => {
				const hasReported = commentItem?.comment?.isReportedBy?.some((id) => id.toString() === objectIdUserId.toString()) || false;

				return {
					...commentItem,
					comment: {
						...commentItem.comment,
						hasUserReported: hasReported,
					},
					answers: commentItem.answers?.length ? processCommentThread(commentItem.answers) : [],
				};
			});
		};

		const updatedComments = processCommentThread(comments);

		return {
			status: "success",
			comments: updatedComments,
		};
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const removeReportUserList = (comments = []) => {
	if (!comments || comments.length === 0) {
		return { status: "error", message: "No comments provided." };
	}

	const cleanThread = (commentList) => {
		return commentList.map((commentItem) => {
			const { isReportedBy, ...restComment } = commentItem.comment;

			return {
				...commentItem,
				comment: restComment,
				answers: commentItem.answers?.length ? cleanThread(commentItem.answers) : [],
			};
		});
	};

	const cleanedComments = cleanThread(comments);
	return {
		status: "success",
		comments: cleanedComments,
	};
};

const flagUserOwnComments = (comments = [], userId) => {
	try {
		if (!comments || comments.length === 0 || !userId) {
			return { status: "error", message: "No comments or user ID provided." };
		}

		// Convert id to ObjectId
		const objectIdUserId = convertIdToObjectId(userId);
		if (objectIdUserId.status == "error") {
			return { status: "error", message: objectIdUserId.message };
		}

		const processCommentThread = (commentList) => {
			return commentList.map((commentItem) => {
				// Convert id to ObjectId
				const objectIdAuthorUserId = convertIdToObjectId(commentItem?.comment?.author?.userId);
				if (objectIdAuthorUserId.status == "error") {
					return { status: "error", message: objectIdAuthorUserId.message };
				}

				// Flag if the user owns this comment
				const isUserOwnComment = objectIdAuthorUserId.toString() === objectIdUserId.toString();

				return {
					...commentItem,
					comment: {
						...commentItem.comment,
						isUserOwnComment,
					},
					answers: commentItem.answers?.length ? processCommentThread(commentItem.answers) : [],
				};
			});
		};

		const updatedComments = processCommentThread(comments);

		return {
			status: "success",
			comments: updatedComments,
		};
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const countLikesComments = (comments = []) => {
	if (!comments || comments.length === 0) {
		return { status: "error", message: "No comments provided." };
	}

	const processCommentThread = (commentList) => {
		return commentList.map((commentItem) => {
			const { isLikedBy = [], isUnlikedBy = [], ...restComment } = commentItem.comment;

			return {
				...commentItem,
				comment: {
					...restComment,
					likesCount: isLikedBy.length,
					unlikesCount: isUnlikedBy.length,
				},
				answers: commentItem.answers?.length ? processCommentThread(commentItem.answers) : [],
			};
		});
	};

	const countedLikesComments = processCommentThread(comments);
	return {
		status: "success",
		comments: countedLikesComments,
	};
};

module.exports = {
	flagUserReportedComments,
	removeReportUserList,
	flagUserOwnComments,
	countLikesComments,
};
