const { Project, Comment } = require("../../models");
const { logger, encryptTools, idTools } = require("../../utils");
const { DateTime } = require("luxon");

/**
 * Update project steps.
 * @param {string} projectId - The ID of the project.
 * @param {string} userId - The ID of the user performing the update.
 * @param {string} newStatus - The new status to be set to the project.
 * @returns {Object} - The result of the update operation.
 */

const editComment = async (projectId, userIdUpdater, commentContent, actionType, commentId) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}
		// Convert id to ObjectId
		const objectIdUserIdUpdater = encryptTools.convertIdToObjectId(userIdUpdater);
		if (objectIdUserIdUpdater.status == "error") {
			return { status: "error", message: objectIdUserIdUpdater.message };
		}

		const project = await Project.findOne({ _id: objectIdProjectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		if (actionType === "create") {
			// Create a new Comment
			const newComment = new Comment({
				project: objectIdProjectId,
				author: objectIdUserIdUpdater,
				content: commentContent,
				createdAt: DateTime.now().toHTTP(),
			});

			// Save the new comment
			created = await newComment.save();

			//Add encrypted ID
			const encryptedId = encryptTools.convertObjectIdToId(created._id.toString());
			const createdComment = await Comment.findOneAndUpdate({ _id: created._id }, { commentId: encryptedId }, { new: true }).select("-_id -__v");

			logger.info(`Comment created successfully. Project ID: ${projectId} - User ID updater: ${userIdUpdater} - Comment ID: ${createdComment.commentId}`);
			return { status: "success", message: "Comment created successfully." };
		}

		if (actionType === "update") {
			// Convert id to ObjectId
			const objectIdCommentId = encryptTools.convertIdToObjectId(commentId);
			if (objectIdCommentId.status == "error") {
				return { status: "error", message: objectIdCommentId.message };
			}

			// Find the existing comment
			const existingComment = await Comment.findOne({ _id: objectIdCommentId });

			if (!existingComment || existingComment.isDeleted) {
				return { status: "error", message: "Comment not found." };
			}

			// Check if the user making the request is the author of the comment
			if (existingComment.author.toString() !== objectIdUserIdUpdater.toString()) {
				return { status: "error", message: "Only the author of the comment can update it." };
			}

			// Update the existing comment
			existingComment.content = commentContent;
			existingComment.updatedAt = DateTime.now().toHTTP();

			// Save the updated comment
			await existingComment.save();

			logger.info(`Comment updated successfully. Project ID: ${projectId} - User ID updater: ${userIdUpdater} - Comment ID: ${commentId}`);
			return { status: "success", message: "Comment updated successfully." };
		}

		if (actionType === "answer") {
			// Convert id to ObjectId
			const objectIdCommentId = encryptTools.convertIdToObjectId(commentId);
			if (objectIdCommentId.status == "error") {
				return { status: "error", message: objectIdCommentId.message };
			}

			// Find the existing comment
			const existingComment = await Comment.findOne({ _id: objectIdCommentId });

			if (!existingComment || existingComment.isDeleted) {
				return { status: "error", message: "Comment not found." };
			}

			if (existingComment.project.toString() !== objectIdProjectId.toString()) {
				return { status: "error", message: "Wrong project ID." };
			}

			// Create a new Comment and add the isAnswerTo field
			const newComment = new Comment({
				project: objectIdProjectId,
				author: objectIdUserIdUpdater,
				content: commentContent,
				isAnswerTo: objectIdCommentId,
				createdAt: DateTime.now().toHTTP(),
			});

			// Save the new comment
			created = await newComment.save();

			//Add encrypted ID
			const encryptedId = encryptTools.convertObjectIdToId(created._id.toString());
			const createdComment = await Comment.findOneAndUpdate({ _id: created._id }, { commentId: encryptedId }, { new: true }).select("-_id -__v");

			logger.info(`Comment answer created successfully. Project ID: ${projectId} - User ID updater: ${userIdUpdater} - Comment ID: ${createdComment.commentId} - Parent Comment ID: ${commentId}`);
			return { status: "success", message: "Comment answer created successfully." };
		}

		if (actionType === "report") {
			// Convert id to ObjectId
			const objectIdCommentId = encryptTools.convertIdToObjectId(commentId);
			if (objectIdCommentId.status == "error") {
				return { status: "error", message: objectIdCommentId.message };
			}

			// Find the existing comment
			const existingComment = await Comment.findOne({ _id: objectIdCommentId });

			if (!existingComment || existingComment.isDeleted) {
				return { status: "error", message: "Comment not found." };
			}

			// Check if the user has already reported the comment
			if (existingComment.isReportedBy.includes(objectIdUserIdUpdater)) {
				return { status: "error", message: "You have already reported this comment." };
			}

			// Add the user to the list of users who reported the comment
			existingComment.isReportedBy.push(objectIdUserIdUpdater);

			// Save the updated comment
			await existingComment.save();

			logger.info(`Comment reported successfully. Project ID: ${projectId} - User ID updater: ${userIdUpdater} - Comment ID: ${commentId}`);
			return { status: "success", message: "Comment reported successfully." };
		}

		if (actionType === "unreport") {
			// Convert id to ObjectId
			const objectIdCommentId = encryptTools.convertIdToObjectId(commentId);
			if (objectIdCommentId.status == "error") {
				return { status: "error", message: objectIdCommentId.message };
			}

			// Find the existing comment
			const existingComment = await Comment.findOne({ _id: objectIdCommentId });

			if (!existingComment || existingComment.isDeleted) {
				return { status: "error", message: "Comment not found." };
			}

			// Check if the user making the unreport is in the list of users who reported the comment
			const reporterIndex = existingComment.isReportedBy.indexOf(objectIdUserIdUpdater);

			if (reporterIndex === -1) {
				return { status: "error", message: "You have not reported this comment." };
			}

			// Remove the user from the list of users who reported the comment
			existingComment.isReportedBy.splice(reporterIndex, 1);

			// Save the updated comment
			await existingComment.save();

			logger.info(`Comment unreported successfully. Project ID: ${projectId} - User ID updater: ${userIdUpdater} - Comment ID: ${commentId}`);
			return { status: "success", message: "Comment unreported successfully." };
		}

		if (actionType === "remove") {
			// Convert id to ObjectId
			const objectIdCommentId = encryptTools.convertIdToObjectId(commentId);
			if (objectIdCommentId.status == "error") {
				return { status: "error", message: objectIdCommentId.message };
			}

			// Find the existing comment
			const existingComment = await Comment.findOne({ _id: objectIdCommentId });

			if (!existingComment || existingComment.isDeleted) {
				return { status: "error", message: "Comment not found." };
			}

			// Check if the user making the request is the author of the comment
			if (existingComment.author.toString() !== objectIdUserIdUpdater.toString()) {
				return { status: "error", message: "Only the author of the comment can remove it." };
			}

			// Remove the comment
			existingComment.isDeleted = true;

			// Save the updated comment
			await existingComment.save();

			logger.info(`Comment removed successfully. Project ID: ${projectId} - User ID updater: ${userIdUpdater} - Comment ID: ${commentId}`);
			return { status: "success", message: "Comment removed successfully." };
		}
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const retrieveProjectComments = async (projectId) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		const projectComments = await Comment.find({
			project: objectIdProjectId,
			isDeleted: { $ne: true }, // Exclude soft-deleted comments from the count
		})
			.select("-project -__v")
			.sort({ createdAt: 1 })
			.populate([{ path: "author", select: "-_id username profilePicture userId" }]);

		if (!projectComments || projectComments.length === 0) {
			logger.info(`No comment found for this project.`);
			return { status: "success", message: "No comment found for this project." };
		}

		// Initialize the comment tree to store comments and their answers
		const commentTreeObj = {};

		// Build a tree structure by recursively adding comments and their answers
		const buildCommentTree = (comment) => {
			const findParent = (parentId) => {
				for (const comm in commentTreeObj) {
					if (commentTreeObj.hasOwnProperty(comm)) {
						if (comm.toString() === parentId) {
							return commentTreeObj[comm];
						}
						const parentComment = commentTreeObj[comm];
						if (commentTreeObj[comm].answers.length > 0) {
							const parentAnswer = findParentInAnswers(parentComment.answers, parentId);
							if (parentAnswer) {
								return parentAnswer;
							}
						}
					}
				}
				return null;
			};

			const findParentInAnswers = (answers, parentId) => {
				for (const answer of answers) {
					if (answer.comment._id.toString() === parentId) {
						return answer;
					}

					const parentAnswer = findParentInAnswers(answer.answers || [], parentId);
					if (parentAnswer) {
						return parentAnswer;
					}
				}
				return null;
			};

			const commentId = comment._id.toString();
			const parentId = comment.isAnswerTo && comment.isAnswerTo.toString();

			if (!parentId) {
				// Top-level comment
				commentTreeObj[commentId] = { comment, answers: [] };
			} else {
				// Nested comment
				const parent = findParent(parentId);
				if (parent) {
					parent.answers.push({ comment, answers: [] });
				}
			}
		};

		// Clean comments and build the comment tree
		for (let comment of projectComments) {
			comment = comment.toObject();

			if (comment.author.profilePicture) {
				if (comment.author.profilePicture.privacy !== "public") {
					comment.author.profilePicture = undefined;
				}
			}

			comment.isReportedBy = comment.isReportedBy.length;

			buildCommentTree(comment);
		}

		const commentTree = Object.values(commentTreeObj);

		idTools.removeIdsFromArray(commentTree);

		// Sort the array based on the createdAt property in descending order
		commentTree.sort((a, b) => new Date(b.comment.createdAt) - new Date(a.comment.createdAt));

		const nbProjectComments = await Comment.countDocuments({
			project: objectIdProjectId,
			isDeleted: { $ne: true },
		});

		if (nbProjectComments.length === 1) {
			logger.info(`${nbProjectComments} comment for this project retrieved successfully.`);
			return { status: "success", message: `${nbProjectComments} comment for this project retrieved successfully.`, projectComments: commentTree };
		} else logger.info(`${nbProjectComments} comments for this project retrieved successfully.`);
		return { status: "success", message: `${nbProjectComments} comments for this project retrieved successfully.`, projectComments: commentTree };
	} catch (error) {
		logger.error("Error while retrieving project comments:", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the project comments.",
		};
	}
};

module.exports = {
	editComment,
	retrieveProjectComments,
};
