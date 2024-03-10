const { Project } = require("../../models");
const { logger, encryptTools, filterTools } = require("../../utils");
const projectService = require("./project.service");

/**
 * Update project attachments.
 * @param {string} projectId - The ID of the project.
 * @returns {Promise} - A promise that resolves with the created project or rejects with an error.
 */

const addAttachment = async (projectId, userId) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}
		const objectIdUserIdUpdater = encryptTools.convertIdToObjectId(userId);
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
			key: updatedData.attachmentKey,
			link: updatedData.attachmentLink,
			updatedBy: objectIdUserIdUpdater,
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

const updateAttachment = async (projectId, attachmentFormerKey, updatedData, userIdUpdater) => {
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

		// Find the index of the attachment with the attachmentFormerKey
		const attachmentIndex = project.privateData.attachments.findIndex((attachment) => attachment.key === attachmentFormerKey);

		// Check if attachment with the former key exists
		if (attachmentIndex === -1) {
			return { status: "error", message: "Attachment not found." };
		}

		// Update the attachment with updatedAttachment data
		project.privateData.attachments[attachmentIndex] = {
			title: updatedData.attachmentTitle,
			size: updatedData.attachmentSize,
			extension: updatedData.attachmentExtension,
			mimetype: updatedData.attachmentMimetype,
			key: updatedData.attachmentKey,
			link: updatedData.attachmentLink,
			updatedBy: objectIdUserIdUpdater,
		};

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

const deleteAttachment = async (projectId, attachmentKey, userIdUpdater) => {
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

		// Find the index of the attachment with the attachmentFormerKey
		const attachmentIndex = project.privateData.attachments.findIndex((attachment) => attachment.key === attachmentKey);

		// Check if attachment with the former key exists
		if (attachmentIndex === -1) {
			return { status: "error", message: "Attachment not found." };
		}

		// Remove the attachment with the specified attachmentKey
		project.privateData.attachments.splice(attachmentIndex, 1);

		// Save the updated project
		const updatedProject = await project.save();
		logger.info(`Project attachment removed successfully. Project ID: ${projectId}`);
		return {
			status: "success",
			message: "Project attachment removed successfully.",
			updatedProject,
		};
	} catch (error) {
		logger.error("Error while removing the project attachment: ", error);

		return {
			status: "error",
			message: "An error occurred while removing the project attachment.",
		};
	}
};

const retrieveAttachments = async (projectId, userId) => {
	try {
		// Convert id to ObjectId
		const objectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserId.status == "error") {
			return { status: "error", message: objectIdUserId.message };
		}

		const projectData = await projectService.retrieveProjectById(projectId, ["-_id", "privateData", "members", "projectId"]);
		if (projectData.status !== "success") {
			return { status: "error", message: projectData.message };
		}

		if (!projectData.project.privateData.attachments || projectData.project.privateData.attachments.length === 0) {
			logger.info(`No attachment found for this project.`);
			return { status: "success", message: "No attachment found for this project." };
		}

		//Verify user is member of the project
		const projectMembers = projectData.project.members;
		// Find the user in the project's members
		const isUserProjectMember = projectMembers.find((member) => encryptTools.convertIdToObjectId(member.user.userId).toString() === objectIdUserId.toString());

		// If user is not member of the project, return error
		if (!isUserProjectMember) {
			return { status: "error", message: "Data only available for the members of the project." };
		}

		// Filter on useful data only
		delete projectData.project.members;
		projectData.project.privateData.attachments.forEach((attachment) => {
			delete attachment.key;
		});

		//Filter users public data from projects
		const projectFiltered = filterTools.filterProjectOutputFields(projectData.project, userId);
		if (projectFiltered.status !== "success") {
			return { status: "error", message: projectFiltered.message };
		}

		const attachments = projectFiltered.project.privateData.attachments;
		const nbAttachments = attachments.length;

		if (nbAttachments === 1) {
			logger.info(`${nbAttachments} project attachment retrieved successfully.`);
			return { status: "success", message: `${nbAttachments} project attachment retrieved successfully.`, attachments };
		} else logger.info(`${nbAttachments} project attachments retrieved successfully.`);
		return { status: "success", message: `project ${nbAttachments} project attachments retrieved successfully.`, attachments };
	} catch (error) {
		logger.error("Error while retrieving the project attachments: ", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the project attachments.",
		};
	}
};

const retrieveAttachment = async (projectId, userId, attachmentTitle) => {
	try {
		// Convert id to ObjectId
		const objectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserId.status == "error") {
			return { status: "error", message: objectIdUserId.message };
		}

		const projectData = await projectService.retrieveProjectById(projectId, ["-_id", "privateData", "members", "projectId"]);
		if (projectData.status !== "success") {
			return { status: "error", message: projectData.message };
		}

		//Verify user is member of the project
		const projectMembers = projectData.project.members;
		// Find the user in the project's members
		const isUserProjectMember = projectMembers.find((member) => encryptTools.convertIdToObjectId(member.user.userId).toString() === objectIdUserId.toString());

		// If user is not member of the project, return error
		if (!isUserProjectMember) {
			return { status: "error", message: "Data only available for the members of the project." };
		}

		//Filter users public data from projects
		const projectFiltered = filterTools.filterProjectOutputFields(projectData.project, userId);
		if (projectFiltered.status !== "success") {
			return { status: "error", message: projectFiltered.message };
		}

		// Filter on useful data only
		const attachment = projectFiltered.project.privateData.attachments.find((attachment) => attachment.title === attachmentTitle);
		if (!attachment) {
			return { status: "error", message: "Project attachment not found." };
		}

		delete attachment.key;

		return {
			status: "success",
			message: "Project attachment retrieved successfully.",
			attachment,
		};
	} catch (error) {
		logger.error("Error while retrieving the project attachment: ", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the project attachment.",
		};
	}
};

module.exports = {
	addAttachment,
	updateAttachment,
	deleteAttachment,
	retrieveAttachments,
	retrieveAttachment,
};
