const Project = require("../../models/project.model");
const { logger } = require("../../utils");

/**
 * Create a new project if it does not already exist.
 * @param {string} name - The name of the project.
 * @returns {Promise} - A promise that resolves with the created project or rejects with an error.
 */
const createProject = async (projectData) => {
	try {
		// Create a new project in the database
		const newProject = new Project({
			title: projectData.title,
			titleCapitalized: projectData.title.toUpperCase(),
			goal: projectData.goal,
			summary: projectData.summary,
			description: projectData.description,
			category: projectData.categoryMongo_Id,
			subCategoryId: projectData.subCategoryId,
			tagsIds: projectData.tagsIds,
			status: projectData.status,
			phase: projectData.phase,
			members: projectData.members,
			location: projectData.location,
			talentsNeeded: projectData.talentsNeeded,
			startDate: projectData.startDate,
			objectives: projectData.objectives,
			creatorMotivation: projectData.creatorMotivation,
			visibility: projectData.visibility,
			attachments: projectData.attachments,
		});

		// Save the project to the database
		const createdProject = await newProject.save();

		logger.info(`New project stored in database. Project ID: ${createdProject.projectId}`);

		return {
			status: "success",
			message: "New project stored in the database.",
			data: { createdProject },
		};
	} catch (error) {
		logger.error("Error while storing the project in the database: ", error);

		return {
			status: "error",
			message: "An error occurred while storing the project in the database.",
		};
	}
};

const checkTitleAvailability = async (title) => {
	const titleCapitalized = title.toUpperCase();
	const existingTitle = await Project.findOne({ titleCapitalized });
	try {
		if (existingTitle) {
			return {
				status: "error",
				message: "Project title is not available.",
			};
		}
		return { status: "success", message: "Title is available." };
	} catch (error) {
		// Handle any errors that occur during the database query
		return { status: "error", message: "An error occurred while checking title availability." };
	}
};

module.exports = {
	createProject,
	checkTitleAvailability,
};
