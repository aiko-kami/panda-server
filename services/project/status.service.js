const { Project } = require("../../models");
const { logger } = require("../../utils");

/**
 * Update status of a project.
 * @param {string} projectId - The ID of the project.
 * @param {string} userIdUpdater - The ID of the user performing the update.
 * @param {string} newStatus - The new status to be set to the project.
 * @returns {Object} - The result of the update operation.
 */
const updateStatus = async (projectId, userIdUpdater, newStatus) => {
	try {
		const project = await Project.findOne({ projectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		const formerStatus = project.status;

		if (formerStatus === newStatus) {
			return { status: "error", message: "New status must be different from the former one." };
		}

		// Update the member's role
		project.status = newStatus;

		// Save the updated project
		await project.save();

		logger.info(`Project status updated successfully. Project ID: ${projectId} - Updater user ID: ${userIdUpdater} - Former project status: ${formerStatus} - New project status: ${newStatus}`);
		return { status: "success", message: "Project status updated successfully." };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

module.exports = {
	updateStatus,
};
