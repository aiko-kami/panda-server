const Project = require("../../models/project.model");
const { logger } = require("../../utils");

/**
 * Create a new project.
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
			subCategory: projectData.subCategory,
			tagsIds: projectData.tagsIds,
			status: projectData.status,
			phase: projectData.phase,
			members: [{ userId: projectData.creatorId, role: "owner" }],
			location: projectData.location,
			talentsNeeded: projectData.talentsNeeded,
			startDate: projectData.startDate,
			objectives: projectData.objectives,
			creatorMotivation: projectData.creatorMotivation,
			visibility: projectData.visibility,
			attachments: projectData.attachments,
			updatedBy: projectData.creatorId,
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

const updateProject = async (projectId, updatedData, userId) => {
	// Find the project by projectId
	const project = await Project.findOne({ projectId });
	// Check if the project exists
	if (!project) {
		return { status: "error", message: "Project not found." };
	}

	try {
		// Update the project properties
		project.title = updatedData.title;
		project.goal = updatedData.goal;
		project.summary = updatedData.summary;
		project.description = updatedData.description;
		project.tagsIds = updatedData.tagsIds;
		project.location = updatedData.location;
		project.talentsNeeded = updatedData.talentsNeeded;
		project.startDate = updatedData.startDate;
		project.phase = updatedData.phase;
		project.objectives = updatedData.objectives;
		project.creatorMotivation = updatedData.creatorMotivation;
		project.visibility = updatedData.visibility;
		project.updatedBy = userId;

		// Save the updated project
		const updatedProject = await project.save();

		return {
			status: "success",
			message: "Project updated successfully.",
			data: { updatedProject },
		};
	} catch (error) {
		return {
			status: "error",
			message: "An error occurred while updating the project",
		};
	}
};

module.exports = {
	createProject,
	checkTitleAvailability,
	updateProject,
};
