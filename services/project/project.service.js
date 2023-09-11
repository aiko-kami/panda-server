const { Project } = require("../../models");
const { logger } = require("../../utils");

/**
 * Create a new project.
 * @param {string} name - The name of the project.
 * @returns {Promise} - A promise that resolves with the created project or rejects with an error.
 */
const createProject = async (projectData) => {
	try {
		const projectLocation = {
			city: projectData.locationCountry,
			country: projectData.locationCity,
			onlineOnly: projectData.locationOnlineOnly,
		};

		// Create a new project in the database
		const newProject = new Project({
			title: projectData.title,
			titleCapitalized: projectData.title.toUpperCase(),
			goal: projectData.goal,
			summary: projectData.summary,
			description: projectData.description,
			category: projectData.categoryMongo_Id,
			subCategory: projectData.subCategory,
			status: projectData.status,
			phase: projectData.phase,
			location: projectLocation,
			startDate: projectData.startDate !== "" ? projectData.startDate : undefined,
			creatorMotivation: projectData.creatorMotivation,
			visibility: projectData.visibility,
			updatedBy: projectData.creatorId,
			tags: projectData.tags,
			members: [{ userId: projectData.creatorId, role: "owner" }],
			talentsNeeded: projectData.talentsNeeded,
			objectives: projectData.objectives,
			attachments: projectData.attachments,
		});

		console.log("🚀 ~ createProject ~ newProject:", newProject);

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
		const projectLocation = {
			city: updatedData.locationCountry,
			country: updatedData.locationCity,
			onlineOnly: updatedData.locationOnlineOnly,
		};

		// Update the project properties
		project.title = updatedData.title;
		project.titleCapitalized = updatedData.title.toUpperCase();
		project.goal = updatedData.goal;
		project.summary = updatedData.summary;
		project.description = updatedData.description;
		project.location = projectLocation;
		(project.startDate = updatedData.startDate !== "" ? updatedData.startDate : undefined),
			(project.phase = updatedData.phase);
		project.creatorMotivation = updatedData.creatorMotivation;
		project.visibility = updatedData.visibility;
		project.updatedBy = userId;
		project.tags = updatedData.tags;
		project.talentsNeeded = updatedData.talentsNeeded;
		project.objectives = updatedData.objectives;

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
