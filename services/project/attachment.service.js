const { Project, Category } = require("../../models");
const { logger, encryptTools } = require("../../utils");
const userRightsService = require("./userRights.service");
const { DateTime } = require("luxon");

/**
 * Update project attachments.
 * @param {string} projectId - The ID of the project.
 * @returns {Promise} - A promise that resolves with the created project or rejects with an error.
 */

const updateAttachment = async (projectId, updatedData, userIdUpdater) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}
		const objectIdUserIdUpdater = encryptTools.convertIdToObjectId(userIdUpdater);
		if (objectIdUserIdUpdater.status == "error") {
			return { status: "error", message: objectIdUserIdUpdater.message };
		}

		// Find the project by projectId
		const project = await Project.findOne({ _id: objectIdProjectId });

		// Check if the project exists
		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		const projectWrongStatus = ["draft", "submitted", "archived", "cancelled", "rejected"];
		// Check the project status
		if (projectWrongStatus.includes(project.statusInfo.currentStatus)) {
			return { status: "error", message: `Project in status ${project.statusInfo.currentStatus.toUpperCase()} cannot be updated.` };
		}

		// Add a new attachment to the project
		const newAttachment = {
			title: updatedData.attachmentTitle,
			size: updatedData.attachmentSize,
			extension: updatedData.attachmentExtension,
			mimetype: updatedData.attachmentMimetype,
			filename: updatedData.attachmentKey,
			link: updatedData.attachmentLink,
			updatedBy: updatedData.attachmentUpdatedBy,
		};

		project.privateData.attachments.push(newAttachment);

		// Save the updated project
		const updatedProject = await project.save();
		logger.info(`Project attachment updated successfully. Project ID: ${projectId}`);
		return {
			status: "success",
			message: "Project attachment updated successfully.",
			updatedProject,
		};
	} catch (error) {
		logger.error("Error while updating the project attachment: ", error);

		return {
			status: "error",
			message: "An error occurred while updating the project attachment.",
		};
	}
};

module.exports = {
	updateAttachment,
};
