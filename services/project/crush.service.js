const { Project, CrushProject } = require("../../models");
const { logger } = require("../../utils");

/**
 * Update status of a project.
 * @param {string} projectId - The ID of the project.
 * @param {string} userIdUpdater - The ID of the user performing the update.
 * @param {string} newStatus - The new status to be set to the project.
 * @returns {Object} - The result of the update operation.
 */
//Possible status: draft, submitted, active, on hold, completed, archived, cancelled

const updateCrush = async (projectId, userIdUpdater, updateType) => {
	try {
		const project = await Project.findOne({ projectId });

		console.log("🚀 ~ updateCrush ~ project:", project);

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		const isCrushSet = project.crush;

		if (updateType === "add") {
			if (isCrushSet) {
				return { status: "error", message: `Project is already a crush.` };
			}

			// Update the project status
			project.crush = true;

			// Save the updated project
			await project.save();

			logger.info(`Project crush set successfully. Project ID: ${projectId} - Updater user ID: ${userIdUpdater} - Former project crush: ${isCrushSet} - New project crush: ${project.crush}`);

			const crushProject = await CrushProject.findOne({ projectId });
			if (crushProject) {
				return { status: "error", message: "Project is already a crush in crushProjects." };
			}

			// Create a new crush project
			const newCrushProject = new CrushProject({
				projectId,
				updatedBy: userIdUpdater,
			});

			// Save the new crush project
			createdCrush = await newCrushProject.save();
			logger.info(`Project crush created successfully. Crush project: ${createdCrush}`);

			return { status: "success", message: "Project crush set successfully." };
		}

		if (updateType === "remove") {
			if (!isCrushSet) {
				return { status: "error", message: `Project is already not a crush.` };
			}

			// Update the project status
			project.crush = false;

			// Save the updated project
			await project.save();

			logger.info(`Project crush removed successfully. Project ID: ${projectId} - Updater user ID: ${userIdUpdater} - Former project crush: ${isCrushSet} - New project crush: ${project.crush}`);

			const existingCrushProject = await CrushProject.findOne({ projectId });
			if (!existingCrushProject) {
				return { status: "error", message: "Project is already not a crush." };
			}

			// Remove crush project
			await existingCrushProject.deleteOne();

			logger.info(`Project crush removed successfully. Crush project: ${existingCrushProject}`);

			return { status: "success", message: "Project crush removed successfully." };
		}
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

module.exports = {
	updateCrush,
};
