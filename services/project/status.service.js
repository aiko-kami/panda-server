const { Project } = require("../../models");
const { logger, encryptTools, statusTools } = require("../../utils");

/**
 * Update status of a project.
 * @param {string} projectId - The ID of the project.
 * @param {string} userIdUpdater - The ID of the user performing the update.
 * @param {string} newStatus - The new status to be set to the project.
 * @returns {Object} - The result of the update operation.
 */
//Possible status: draft, submitted, active, on hold, completed, archived, cancelled

const updateStatus = async (projectId, userIdUpdater, newStatus, reason) => {
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

		// Retrieve project
		const project = await Project.findOne({ _id: objectIdProjectId }).populate([
			{ path: "members.user", select: "-_id username profilePicture userId" },
			{ path: "category", select: "-_id name categoryId" },
		]);

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		// Update project status
		////////////////////////////////////To be reviewed///////////////////
		const formerStatus = project.statusInfo.currentStatus;

		const statusUpdateValidated = statusTools.validateStatusUpdate(newStatus, formerStatus);
		if (statusUpdateValidated.status == "error") {
			return { status: "error", message: statusUpdateValidated.message };
		}

		// Update current status and reason
		project.statusInfo.currentStatus = newStatus;
		project.statusInfo.reason = reason;

		// Add the status change to the history
		project.statusInfo.statusHistory.push({
			status: newStatus,
			updatedBy: objectIdUserIdUpdater,
			reason: reason,
		});

		const updatedProject = await project.save();
		const projectOutput = await Project.populate(updatedProject, [
			{ path: "statusInfo.statusHistory.updatedBy", select: "-_id username profilePicture userId" },
			{ path: "updatedBy", select: "-_id username profilePicture userId" },
		]);

		console.log("🚀 ~ updateStatus ~ projectOutput:", JSON.stringify(projectOutput));
		console.log("🚀 ~ updateStatus ~ projectOutput.members:", projectOutput.statusInfo.statusHistory[1].updatedBy.profilePicture);

		if (projectOutput.updatedBy) {
			if (projectOutput.updatedBy.profilePicture.privacy !== "public") {
				projectOutput.updatedBy.profilePicture = undefined;
			}
		}

		for (let member of projectOutput.members) {
			if (member.user.profilePicture.privacy !== "public") {
				member.user.profilePicture = undefined;
			}
			member._id = undefined;
		}

		for (let statusHisto of projectOutput.statusInfo.statusHistory) {
			if (statusHisto.updatedBy.profilePicture.privacy !== "public") {
				console.log("🚀 ~ updateStatus ~ statusHisto:", statusHisto.updatedBy.profilePicture.privacy);
				statusHisto.updatedBy.profilePicture = undefined;
			}
		}

		logger.info(`Project status updated successfully. Project ID: ${projectId} - Updater user ID: ${userIdUpdater} - Former project status: ${formerStatus} - New project status: ${newStatus}`);
		return { status: "success", message: "Project status updated successfully.", project: projectOutput };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

module.exports = {
	updateStatus,
};
