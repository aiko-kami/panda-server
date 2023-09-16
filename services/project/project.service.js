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
			category: projectData.categoryId,
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

		// Save the project to the database
		const project = await newProject.save();

		logger.info(`New project stored in database. Project ID: ${project.projectId}`);

		return {
			status: "success",
			message: "New project stored in the database.",
			project,
		};
	} catch (error) {
		logger.error("Error while storing the project in the database: ", error);

		return {
			status: "error",
			message: "An error occurred while storing the project in the database.",
		};
	}
};

const verifyTitleAvailability = async (title) => {
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
		// Define an object to store the fields that need to be updated
		const updateFields = {};

		// Define a mapping of fields between the updatedData object and the project object
		const fieldMapping = {
			title: "title",
			goal: "goal",
			summary: "summary",
			description: "description",
			startDate: "startDate",
			phase: "phase",
			creatorMotivation: "creatorMotivation",
			visibility: "visibility",
			tags: "tags",
			talentsNeeded: "talentsNeeded",
			objectives: "objectives",
			locationCity: "location.city",
			locationCountry: "location.country",
			locationOnlineOnly: "location.onlineOnly",
		};

		// Iterate through the fieldMapping and check if the field exists in updatedData
		for (const key in fieldMapping) {
			const projectField = fieldMapping[key];
			if (updatedData.hasOwnProperty(key)) {
				// If the field exists in updatedData, update the corresponding field in updateFields
				updateFields[projectField] = updatedData[key];
			}
		}

		// Update the project properties
		project.set(updateFields);
		project.updatedBy = userId;

		// Save the updated project
		const updatedProject = await project.save();
		logger.info(`Project updated successfully. Project ID: ${projectId}`);
		return {
			status: "success",
			message: "Project updated successfully.",
			updatedProject,
		};
	} catch (error) {
		logger.error("Error while updating the project: ", error);

		return {
			status: "error",
			message: "An error occurred while updating the project",
		};
	}
};

/**
 * Retrieve project data by project ID.
 * @param {string} projectId - The ID of the project to retrieve.
 * @returns {Object} - An object containing the retrieved project data or an error message.
 */
const retrieveProjectById = async (projectId, fields) => {
	try {
		// Use your Project model to find the project by ID
		const project = await Project.findOne({ projectId }).select(fields);

		if (!project) {
			return {
				status: "error",
				message: "Project not found.",
			};
		}

		return {
			status: "success",
			message: "Project retrieved successfully.",
			project,
		};
	} catch (error) {
		logger.error("Error while retrieving project from the database:", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the project from the database.",
		};
	}
};

module.exports = {
	createProject,
	verifyTitleAvailability,
	updateProject,
	retrieveProjectById,
};
