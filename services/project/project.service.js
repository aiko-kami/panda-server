const { Project, Category } = require("../../models");
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
			cover: projectData.cover,
			categoryId: projectData.categoryId,
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
		});

		// Save the project to the database
		const project = await newProject.save();

		logger.info(`New project created successfully. Project ID: ${project.projectId}`);

		return {
			status: "success",
			message: "New project created successfully.",
			project,
		};
	} catch (error) {
		logger.error("Error while while creating the project: ", error);

		return {
			status: "error",
			message: "An error occurred while creating the project.",
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
	try {
		// Find the project by projectId
		const project = await Project.findOne({ projectId });

		// Check if the project exists
		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		// Define an object to store the fields that need to be updated
		const updateFields = {};

		// Define a mapping of fields between the updatedData object and the project object
		const fieldMapping = {
			title: "title",
			goal: "goal",
			summary: "summary",
			description: "description",
			cover: "cover",
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
			message: "An error occurred while updating the project.",
		};
	}
};

/**
 * Retrieve project data by project ID.
 * @param {string} projectId - The ID of the project to retrieve.
 * @returns {Object} - An object containing the retrieved project data or an error message.
 */
const retrieveProjectById = async (projectId, fields, conditions) => {
	try {
		const search = { projectId, ...conditions };
		// Use your Project model to find the project by ID
		const project = await Project.findOne(search).select(fields);

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
			message: "An error occurred while retrieving the project.",
		};
	}
};

const retrieveLatestProjects = async (limit, fields, conditions) => {
	try {
		let query = Project.find(conditions).sort({ createdAt: -1 }).limit(limit);
		if (fields) {
			query = query.select(fields);
		}
		// select(`-_id -__v ${fields}`)
		const projects = await query;

		if (!projects) {
			return { status: "error", message: "No project found." };
		}
		return {
			status: "success",
			message: "New projects retrieved successfully.",
			projects,
		};
	} catch (error) {
		logger.error("Error while retrieving projects:", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the projects.",
		};
	}
};

const countNumberProjects = async () => {
	try {
		const nbPublicProject = await Project.countDocuments({ visibility: "public" }); // Count total number of projects
		const nbPublicSubmittedProject = await Project.countDocuments({ visibility: "public", status: "submitted" }); // Count documents with visibility set to "public" and status set to "submitted"
		const nbPublicOnHoldProject = await Project.countDocuments({ visibility: "public", status: "on hold" }); // Count documents with visibility set to "public" and status set to "on hold"
		const nbPublicCompletedProject = await Project.countDocuments({ visibility: "public", status: "completed" }); // Count documents with visibility set to "public" and status set to "completed"
		const nbPublicArchivedProject = await Project.countDocuments({ visibility: "public", status: "archived" }); // Count documents with visibility set to "public" and status set to "archived"
		const nbPublicCancelledProject = await Project.countDocuments({ visibility: "public", status: "cancelled" }); // Count documents with visibility set to "public" and status set to "cancelled"
		const nbPublicActiveProject = await Project.countDocuments({
			visibility: "public",
			status: "active",
		}); // Count documents with visibility set to "public" and status set to "active"

		return {
			status: "success",
			message: "Number of projects retrieved successfully.",
			count: [
				{ description: "Public projects", count: nbPublicProject },
				{ description: "Public projects with status Submitted", count: nbPublicSubmittedProject },
				{ description: "Public projects with status On hold", count: nbPublicOnHoldProject },
				{ description: "Public projects with status Completed", count: nbPublicCompletedProject },
				{ description: "Public projects with status Archived", count: nbPublicArchivedProject },
				{ description: "Public projects with status Cancelled", count: nbPublicCancelledProject },
				{ description: "Public projects with status Active", count: nbPublicActiveProject },
			],
		};
	} catch (error) {
		logger.error("Error while retrieving project:", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the project.",
		};
	}
};

const countNumberProjectsPerCategory = async () => {
	try {
		const categories = await Category.find({}, "name subCategories categoryId");

		const categoryCounts = [];

		for (const category of categories) {
			const categoryCount = {
				category: category.name,
				count: 0,
				subCategoryCounts: [],
			};

			for (const subCategory of category.subCategories) {
				const subCategoryCount = await Project.countDocuments({
					categoryId: category.categoryId,
					subCategory: subCategory,
					visibility: "public",
				});

				categoryCount.subCategoryCounts.push({
					subCategory,
					count: subCategoryCount,
				});

				categoryCount.count += subCategoryCount;
			}
			categoryCounts.push(categoryCount);
		}

		return {
			status: "success",
			message: "Number of projects retrieved successfully.",
			count: categoryCounts,
		};
	} catch (error) {
		logger.error("Error while retrieving project:", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the project.",
		};
	}
};

module.exports = {
	createProject,
	verifyTitleAvailability,
	updateProject,
	retrieveProjectById,
	retrieveLatestProjects,
	countNumberProjects,
	countNumberProjectsPerCategory,
};
