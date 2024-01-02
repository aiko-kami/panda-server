const { Project, Category } = require("../../models");
const { logger, encryptTools } = require("../../utils");

/**
 * Create a new project.
 * @param {string} name - The name of the project.
 * @returns {Promise} - A promise that resolves with the created project or rejects with an error.
 */
const createProject = async (projectData) => {
	try {
		const objectIdCategoryId = encryptTools.convertIdToObjectId(projectData.categoryId);
		if (objectIdCategoryId.status == "error") {
			return { status: "error", message: objectIdCategoryId.message };
		}

		const objectIdCreatorId = encryptTools.convertIdToObjectId(projectData.creatorId);
		if (objectIdCreatorId.status == "error") {
			return { status: "error", message: objectIdCreatorId.message };
		}

		const projectLocation = {
			city: projectData.locationCountry,
			country: projectData.locationCity,
			onlineOnly: projectData.locationOnlineOnly,
		};

		// Verify that title does not already exists in the database
		const titleCapitalized = projectData.title.toUpperCase();
		const existingTitle = await Project.findOne({ titleCapitalized });
		if (existingTitle) {
			return { status: "error", message: "Project title is not available." };
		}

		// Create a new project in the database
		const newProject = new Project({
			title: projectData.title,
			titleCapitalized: titleCapitalized,
			goal: projectData.goal,
			summary: projectData.summary,
			description: projectData.description,
			cover: projectData.cover,
			category: objectIdCategoryId,
			subCategory: projectData.subCategory,
			status: projectData.status,
			privateData: {},
			location: projectLocation,
			startDate: projectData.startDate !== "" ? projectData.startDate : undefined,
			creatorMotivation: projectData.creatorMotivation,
			visibility: projectData.visibility,
			updatedBy: objectIdCreatorId,
			tags: projectData.tags,
			members: [{ user: objectIdCreatorId, role: "owner" }],
			talentsNeeded: projectData.talentsNeeded,
			objectives: projectData.objectives,
		});

		// Save the project to the database
		const created = await newProject.save();

		//Add encrypted ID
		const encryptedId = encryptTools.convertObjectIdToId(created._id.toString());

		const project = await Project.findOneAndUpdate({ _id: created._id }, { projectId: encryptedId }, { new: true })
			.select("-_id -__v -draft -privateData -crush -likes -members -updatedBy")
			.populate([{ path: "category", select: "-_id name categoryId" }]);

		projectOutput = project.toObject();

		logger.info(`New project created successfully. Project ID: ${project.projectId} - Project status: ${projectData.status}`);
		return {
			status: "success",
			message: `New project created successfully. Project status: ${projectData.status}`,
			project: projectOutput,
		};
	} catch (error) {
		logger.error("Error while while creating the project: ", error);
		return {
			status: "error",
			message: "An error occurred while creating the project.",
		};
	}
};

const updateProjectDraft = async (projectId, updatedData, userIdUpdater) => {
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

		objectIdCategoryId = encryptTools.convertIdToObjectId(updatedData.categoryId);
		if (objectIdCategoryId.status == "error") {
			return { status: "error", message: objectIdCategoryId.message };
		}

		// Find the project by projectId
		const project = await Project.findOne({ _id: objectIdProjectId });

		// Check if the project exists
		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		// Check if the user updater is the project creator
		if (project.members[0].role !== "owner" || project.members[0].user.toString() !== objectIdUserIdUpdater.toString()) {
			return { status: "error", message: "Only the creator of the project can edit the draft of the project." };
		}

		// Check if the project status is draft
		if (project.status !== "draft") {
			return { status: "error", message: "Project status not draft." };
		}

		// Verify that title does not already exists in the database
		const titleCapitalized = updatedData.title.toUpperCase();
		const existingTitle = await Project.findOne({ $and: [{ projectId: { $ne: projectId } }, { titleCapitalized }] });
		if (existingTitle) {
			return { status: "error", message: "Project title is not available." };
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
			subCategory: "subCategory",
			locationCity: "location.city",
			locationCountry: "location.country",
			locationOnlineOnly: "location.onlineOnly",
			startDate: "startDate",
			creatorMotivation: "creatorMotivation",
			visibility: "visibility",
			tags: "tags",
			talentsNeeded: "talentsNeeded",
			objectIdProjectId: "updatedBy",
			status: "status",
		};

		// Iterate through the fieldMapping and check if the field exists in updatedData
		for (const key in fieldMapping) {
			const projectField = fieldMapping[key];
			if (updatedData.hasOwnProperty(key)) {
				// If the field exists in updatedData, update the corresponding field in updateFields
				updateFields[projectField] = updatedData[key];
			}
		}
		// Add the field in the list to update
		updateFields.category = objectIdCategoryId;

		// Save the updated project
		const updatedProject = await Project.findOneAndUpdate({ _id: objectIdProjectId }, { $set: updateFields }, { new: true })
			.select("-_id -__v -draft -privateData -crush -likes -members -updatedBy")
			.populate([{ path: "category", select: "-_id name categoryId" }]);

		projectOutput = updatedProject.toObject();

		logger.info(`Project updated successfully. Project ID: ${projectId} - Project status: ${projectOutput.status}`);
		return {
			status: "success",
			message: `Project updated successfully. Project status: ${projectOutput.status}`,
			project: updatedProject,
		};
	} catch (error) {
		logger.error("Error while updating the project: ", error);

		return {
			status: "error",
			message: "An error occurred while updating the project.",
		};
	}
};

const removeProjectDraft = async (projectId, userIdUpdater) => {
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

		// Check if the user updater is the project creator
		if (project.members[0].role !== "owner" || project.members[0].user.toString() !== objectIdUserIdUpdater.toString()) {
			return { status: "error", message: "Only the creator of the project can remove the draft of the project." };
		}

		// Check if the project status
		if (project.status !== "draft") {
			return { status: "error", message: "Project status not draft." };
		}

		// Remove project draft
		await project.deleteOne();

		logger.info(`Project removed successfully. Project ID: ${projectId}`);
		return { status: "success", message: "Project removed successfully." };
	} catch (error) {
		logger.error("Error while removing the project: ", error);

		return {
			status: "error",
			message: "An error occurred while removing the project.",
		};
	}
};

const processProjectApproval = async (projectId, projectApproval, adminUserId) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		// Find the project by projectId
		const project = await Project.findOne({ _id: objectIdProjectId });

		// Check if the project exists
		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		// Check if the user updater is the project creator
		if (project.members[0].role !== "owner" || project.members[0].user.toString() !== objectIdUserIdUpdater.toString()) {
			return { status: "error", message: "Only the creator of the project can remove the draft of the project." };
		}

		// Check if the project status
		if (project.status !== "submitted") {
			return { status: "error", message: "Project status not submitted." };
		}

		// Update the project status
		if (projectApproval.approval === "approved") {
			project.status = "active";
		} else if (projectApproval.approval === "rejected") {
			project.status = "rejected";
			project.statusReason = projectApproval.reason;
		}

		// Save the updated project
		await project.save();

		logger.info(`Project approval set successfully. Project ID: ${projectId}`);
		return { status: "success", message: "Project approval set successfully." };
	} catch (error) {
		logger.error("Error while setting the project approval: ", error);

		return {
			status: "error",
			message: "An error occurred while setting the project approval.",
		};
	}
};

const updateProject = async (projectId, updatedData, userIdUpdater) => {
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

		// Verify that title does not already exists in the database
		const titleCapitalized = updatedData.title.toUpperCase();
		const existingTitle = await Project.findOne({ $and: [{ projectId: { $ne: projectId } }, { titleCapitalized }] });
		if (existingTitle) {
			return { status: "error", message: "Project title is not available." };
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
			phase: "privateData.phase",
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
		project.updatedBy = objectIdUserIdUpdater;

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
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		const fieldsString = fields.join(" ");

		const search = { _id: objectIdProjectId, ...conditions };
		// Use your Project model to find the project by ID
		const projectRetrieved = await Project.findOne(search)
			.select(fieldsString)
			.populate([
				{ path: "category", select: "-_id name categoryId" },
				{ path: "updatedBy", select: "-_id username profilePicture" },
				{ path: "steps.updatedBy", select: "-_id username profilePicture" },
				{ path: "members.user", select: "username profilePicture" },
			]); // Populate the 'category' and 'members.user' fields

		if (!projectRetrieved) {
			return {
				status: "error",
				message: "Project not found.",
			};
		}
		let project = projectRetrieved.toObject();

		if (!fields.includes("category")) {
			project.category = undefined;
		}
		if (fields.includes("updatedBy" && project.updatedBy)) {
			if (project.updatedBy) {
				if (project.updatedBy.profilePicture.privacy !== "public") {
					project.updatedBy.profilePicture = undefined;
				}
			}
		} else {
			project.updatedBy = undefined;
		}
		if (fields.includes("steps")) {
			if (project.steps.updatedBy) {
				if (project.steps.updatedBy.profilePicture.privacy !== "public") {
					project.steps.updatedBy.profilePicture = undefined;
				}
			}
		} else {
			project.steps = undefined;
		}
		if (fields.includes("members")) {
			for (let member of project.members) {
				if (member.user.profilePicture.privacy !== "public") {
					member.user.profilePicture = undefined;
				}
				member._id = undefined;
			}
		} else {
			project.members = undefined;
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
			const fieldsString = fields.join(" ");

			query = query.select(fieldsString).populate([{ path: "category", select: "-_id name categoryId" }]); // Populate the 'category' and 'members.user' fields
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
				// Convert id to ObjectId
				const objectIdCategoryId = encryptTools.convertIdToObjectId(category.categoryId);
				if (objectIdCategoryId.status == "error") {
					return { status: "error", message: objectIdCategoryId.message };
				}

				const subCategoryCount = await Project.countDocuments({
					category: objectIdCategoryId,
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
	updateProjectDraft,
	removeProjectDraft,
	processProjectApproval,
	updateProject,
	retrieveProjectById,
	retrieveLatestProjects,
	countNumberProjects,
	countNumberProjectsPerCategory,
};
