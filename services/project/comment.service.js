const { Project, Comment } = require("../../models");
const { logger, encryptTools } = require("../../utils");
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

			// Check if there are already QAs
			if (!project.QAs.QAsList || project.QAs.QAsList.length === 0) {
				return { status: "error", message: "No Q&A found for this project." };
			}

			// Update all QAs with the provided data
			project.QAs.QAsList = QAs.map((updatedQA) => ({
				question: updatedQA.question,
				response: updatedQA.response || "",
				published: updatedQA.published ? true : false,
			}));

			// Update timestamps and the user who made the changes
			project.updatedBy = objectIdUserIdUpdater;
			project.QAs.updatedBy = objectIdUserIdUpdater;
			project.QAs.updatedAt = DateTime.now().toHTTP();

			// Save the updated project
			await project.save();

			logger.info(`Project Q&A updated successfully. Project ID: ${projectId} - User ID updater: ${userIdUpdater}`);
			return { status: "success", message: "Project Q&A updated successfully." };
		}

		if (actionType === "answer") {
			// Convert id to ObjectId
			const objectIdCommentId = encryptTools.convertIdToObjectId(commentId);
			if (objectIdCommentId.status == "error") {
				return { status: "error", message: objectIdCommentId.message };
			}

			// Check if there are already QAs
			if (!project.QAs.QAsList || project.QAs.QAsList.length === 0) {
				return { status: "error", message: "No Q&A found for this project." };
			}

			// Update all QAs with the provided data
			project.QAs.QAsList = QAs.map((updatedQA) => ({
				question: updatedQA.question,
				response: updatedQA.response || "",
				published: updatedQA.published ? true : false,
			}));

			// Update timestamps and the user who made the changes
			project.updatedBy = objectIdUserIdUpdater;
			project.QAs.updatedBy = objectIdUserIdUpdater;
			project.QAs.updatedAt = DateTime.now().toHTTP();

			// Save the updated project
			await project.save();

			logger.info(`Project Q&A updated successfully. Project ID: ${projectId} - User ID updater: ${userIdUpdater}`);
			return { status: "success", message: "Project Q&A updated successfully." };
		}

		if (actionType === "remove") {
			// Convert id to ObjectId
			const objectIdCommentId = encryptTools.convertIdToObjectId(commentId);
			if (objectIdCommentId.status == "error") {
				return { status: "error", message: objectIdCommentId.message };
			}

			const QAQuestion = QAs;
			// Find the index of the QA with the given question
			const QAIndex = project.QAs.QAsList.findIndex((QA) => QA.question === QAQuestion);

			if (QAIndex === -1) {
				return { status: "error", message: "Q&A not found." };
			}

			// Remove the QA at the found index
			project.QAs.QAsList.splice(QAIndex, 1);

			// Update timestamps and the user who made the changes
			project.updatedBy = objectIdUserIdUpdater;
			project.QAs.updatedBy = objectIdUserIdUpdater;
			project.QAs.updatedAt = DateTime.now().toHTTP();

			// Save the updated project
			await project.save();

			logger.info(`Project Q&A removed successfully. Project ID: ${projectId} - User ID updater: ${userIdUpdater}`);
			return { status: "success", message: "Project Q&A removed successfully." };
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

		const projectComments = await Comment.find({ project: objectIdProjectId })
			.select("-_id commentId author content answers createdAt")
			.populate([{ path: "author", select: "-_id username profilePicture userId" }]);

		if (!projectComments) {
			return { status: "error", message: "Project not found." };
		}

		/*		if (!projectQAs.QAs.QAsList || projectQAs.QAs.QAsList.length === 0) {
			return { status: "error", message: "No Project Q&A found." };
		}

		if (projectQAs.QAs.updatedBy.profilePicture.privacy !== "public") {
			projectQAs.QAs.updatedBy.profilePicture = undefined;
		}

		const QAsList = projectQAs.QAs.QAsList;

		const QAsOutput = {
			QAsList: QAsList,
			createdAt: projectQAs.QAs.createdAt,
			updatedAt: projectQAs.QAs.updatedAt,
			updatedBy: projectQAs.QAs.updatedBy,
		};
*/

		logger.info(`Project comments retrieved successfully.`);
		return { status: "success", message: `Project comments retrieved successfully.`, projectComments };
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
