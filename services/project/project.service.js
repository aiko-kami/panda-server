const { Project, Category, Status } = require("../../models");
const { logger, encryptTools } = require("../../utils");
const userRightsService = require("./userRights.service");
const { DateTime } = require("luxon");

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

		const objectIdStatusId = encryptTools.convertIdToObjectId(projectData.statusId);
		if (objectIdStatusId.status == "error") {
			return { status: "error", message: objectIdStatusId.message };
		}

		const objectIdCreatorId = encryptTools.convertIdToObjectId(projectData.creatorId);
		if (objectIdCreatorId.status == "error") {
			return { status: "error", message: objectIdCreatorId.message };
		}

		// Converts the project title into a URL-friendly format by replacing '&' and '/' with '-', removing spaces and setting to lowercase
		const projectLink = projectData.title.replace(/\s&\s/g, "-").replace(/\//g, "-").replace(/\s+/g, "-").toLowerCase();

		const projectLocation = {
			city: projectData.locationCity,
			country: projectData.locationCountry,
			onlineOnly: projectData.locationOnlineOnly,
		};

		const projectStatus = {
			currentStatus: objectIdStatusId,
			reason: projectData.statusReason,
			statusHistory: [
				{
					status: objectIdStatusId,
					reason: projectData.statusReason,
					updatedBy: objectIdCreatorId,
					timestamp: DateTime.now().toHTTP(),
				},
			],
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
			link: projectLink,
			goal: projectData.goal,
			summary: projectData.summary,
			description: projectData.description,
			category: objectIdCategoryId,
			subCategory: projectData.subCategory,
			statusInfo: projectStatus,
			privateData: {},
			location: projectLocation,
			startDate: projectData.startDate !== "" ? projectData.startDate : undefined,
			creatorMotivation: projectData.creatorMotivation,
			visibility: projectData.visibility,
			createdBy: objectIdCreatorId,
			updatedBy: objectIdCreatorId,
			tags: projectData.tags,
			members: [{ user: objectIdCreatorId, role: "owner" }],
			talentsNeeded: projectData.talentsNeeded,
			objectives: projectData.objectives,
			steps: { stepsList: [] },
			QAs: { QAsList: [] },
			objectives: projectData.objectives,
			createdAt: DateTime.now().toHTTP(),
		});

		// Save the project to the database
		const created = await newProject.save();

		//Add encrypted ID
		const encryptedId = encryptTools.convertObjectIdToId(created._id.toString());

		const project = await Project.findOneAndUpdate({ _id: created._id }, { projectId: encryptedId }, { new: true })
			.select("-_id -__v -draft -privateData -crush -likes -members -updatedBy")
			.populate([{ path: "category", select: "-_id name categoryId" }]);

		projectOutput = project.toObject();

		logger.info(`New project created successfully. Project ID: ${project.projectId}`);
		return {
			status: "success",
			message: `New project created successfully.`,
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
		const project = await Project.findOne({ _id: objectIdProjectId }).populate([{ path: "statusInfo.currentStatus", select: "-_id status colors description" }]);

		// Check if the project exists
		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		// Check if the user updater is the creator of project
		if (project.createdBy.toString() !== objectIdUserIdUpdater.toString()) {
			return { status: "error", message: "Only the creator of the project can update it." };
		}

		// Check if the project status is draft
		if (project.statusInfo.currentStatus.status !== "draft") {
			return { status: "error", message: "Project status is not DRAFT. You can only update draft project." };
		}

		// Verify that title does not already exists in the database
		if (updatedData.title) {
			const titleCapitalized = updatedData.title.toUpperCase();
			const existingTitle = await Project.findOne({ $and: [{ projectId: { $ne: projectId } }, { titleCapitalized }] });

			if (existingTitle) {
				return { status: "error", message: "Project title is not available." };
			}
		}

		// Define an object to store the fields that need to be updated
		const updateFields = {};

		// Define a mapping of fields between the updatedData object and the project object
		const fieldMapping = {
			title: "title",
			goal: "goal",
			summary: "summary",
			description: "description",
			subCategory: "subCategory",
			locationCity: "location.city",
			locationCountry: "location.country",
			locationOnlineOnly: "location.onlineOnly",
			startDate: "startDate",
			creatorMotivation: "creatorMotivation",
			visibility: "visibility",
			tags: "tags",
			talentsNeeded: "talentsNeeded",
			objectIdUserIdUpdater: "updatedBy",
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

		if (updatedData.title) {
			// Converts the project title into a URL-friendly format by replacing '&' and '/' with '-', removing spaces and setting to lowercase
			const projectLink = updatedData.title.replace(/\s&\s/g, "-").replace(/\//g, "-").replace(/\s+/g, "-").toLowerCase();
			updateFields.link = projectLink;
			updateFields.titleCapitalized = updatedData.title.toUpperCase();
		}

		// Save the updated project
		const updatedProject = await Project.findOneAndUpdate({ _id: objectIdProjectId }, { $set: updateFields }, { new: true })
			.select("-_id -__v -draft -privateData -crush -likes -updatedBy")
			.populate([
				{ path: "category", select: "-_id name categoryId" },
				{ path: "members.user", select: "username profilePicture userId" },
				{ path: "statusInfo.currentStatus", select: "-_id status colors description" },
			]);

		logger.info(`Project updated successfully. Project ID: ${projectId} - Project status: ${updatedProject.statusInfo.currentStatus.status}`);
		return {
			status: "success",
			message: `Project updated successfully. Project status: ${updatedProject.statusInfo.currentStatus.status}`,
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
		const project = await Project.findOne({ _id: objectIdProjectId }).populate([{ path: "statusInfo.currentStatus", select: "-_id status colors description" }]);

		// Check if the project exists
		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		// Check if the user updater is the project creator
		if (project.members[0].role !== "owner" || project.members[0].user.toString() !== objectIdUserIdUpdater.toString()) {
			return { status: "error", message: "Only the creator of the project can remove the draft of the project." };
		}

		// Check the project status
		if (project.statusInfo.currentStatus.status !== "draft") {
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
		const project = await Project.findOne({ _id: objectIdProjectId })
			.select("-__v -draft -privateData -crush -likes -updatedBy")
			.populate([
				{ path: "category", select: "-_id name categoryId" },
				{ path: "tags", select: "-_id tagId name description link" },
				{ path: "members.user", select: "username profilePicture userId email" },
				{ path: "statusInfo.currentStatus", select: "-_id status colors description" },
			]);

		// Check if the project exists
		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		// Check if the project status
		if (project.statusInfo.currentStatus.status !== "submitted") {
			return { status: "error", message: "Project status not submitted." };
		}

		// Update the project status
		if (projectApproval.approval === "approved") {
			project.statusInfo.currentStatus.status = "active";
		} else if (projectApproval.approval === "rejected") {
			project.statusInfo.currentStatus.status = "rejected";
			project.statusInfo.reason = projectApproval.reason;
		}

		// Save the updated project
		const updatedProject = await project.save();

		logger.info(`Project approval set successfully. Project ID: ${projectId}`);
		return { status: "success", message: "Project approval set successfully.", project: updatedProject };
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
		const project = await Project.findOne({ _id: objectIdProjectId }).populate([{ path: "statusInfo.currentStatus", select: "-_id status colors description" }]);

		// Check if the project exists
		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		const projectWrongStatus = ["draft", "submitted", "archived", "cancelled", "rejected"];
		// Check the project status
		if (projectWrongStatus.includes(project.statusInfo.currentStatus.status)) {
			return { status: "error", message: `Project in status ${project.statusInfo.currentStatus.status.toUpperCase()} cannot be updated.` };
		}

		// In case of title update, verify that title does not already exists in the database
		if (updatedData.title) {
			const titleCapitalized = updatedData.title.toUpperCase();
			const existingTitle = await Project.findOne({ $and: [{ projectId: { $ne: projectId } }, { titleCapitalized }] });
			if (existingTitle) {
				return { status: "error", message: "Project title is not available." };
			}
		}

		// Define an object to store the fields that need to be updated
		const updateFields = {};

		// Define a mapping of fields between the updatedData object and the project object
		const fieldMapping = {
			title: "title",
			goal: "goal",
			summary: "summary",
			description: "description",
			coverKey: "cover.key",
			coverLink: "cover.link",
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

		if (updatedData.title) {
			// Converts the project title into a URL-friendly format by replacing '&' and '/' with '-', removing spaces and setting to lowercase
			const projectLink = updatedData.title.replace(/\s&\s/g, "-").replace(/\//g, "-").replace(/\s+/g, "-").toLowerCase();
			updateFields.link = projectLink;
			updateFields.titleCapitalized = updatedData.title.toUpperCase();
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

const updateProjectCategorySubCategory = async (projectId, categoryId, subCategory, userIdUpdater) => {
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

		//If category is updated
		let objectIdCategoryId = "";
		if (categoryId) {
			objectIdCategoryId = encryptTools.convertIdToObjectId(categoryId);
			if (objectIdCategoryId.status == "error") {
				return { status: "error", message: objectIdCategoryId.message };
			}

			project.category = objectIdCategoryId;
		}

		//If sub-category is updated
		if (subCategory) {
			project.subCategory = subCategory;
		}

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

const updateProjectDraftSection = async (projectId, updatedData, userIdUpdater) => {
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
		const project = await Project.findOne({ _id: objectIdProjectId }).populate([{ path: "statusInfo.currentStatus", select: "-_id status colors description" }]);

		// Check if the project exists
		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		const projectWrongStatus = ["draft", "submitted", "archived", "cancelled", "rejected"];
		// Check the project status
		if (projectWrongStatus.includes(project.statusInfo.currentStatus.status)) {
			return { status: "error", message: `Project in status ${project.statusInfo.currentStatus.status.toUpperCase()} cannot be updated.` };
		}

		// In case of title update, verify that title does not already exists in the database
		if (updatedData.title) {
			const titleCapitalized = updatedData.title.toUpperCase();

			const existingTitle = await Project.findOne({ $and: [{ projectId: { $ne: projectId } }, { titleCapitalized }] });
			if (existingTitle) {
				return { status: "error", message: "Project title is not available." };
			}
		}

		// Define an object to store the fields that need to be updated
		const updateFields = {};

		// Define a mapping of fields between the updatedData object and the project object
		const fieldMapping = {
			title: "draft.title",
			goal: "draft.goal",
			summary: "draft.summary",
			description: "draft.description",
			locationCity: "draft.location.city",
			locationCountry: "draft.location.country",
			locationOnlineOnly: "draft.location.onlineOnly",
			startDate: "draft.startDate",
			phase: "draft.phase",
			creatorMotivation: "draft.creatorMotivation",
			visibility: "draft.visibility",
			tags: "draft.tags",
			talentsNeeded: "draft.talentsNeeded",
			objectives: "draft.objectives",
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
		project.draft.updatedBy = objectIdUserIdUpdater;

		// Save the updated project
		const updatedProject = await project.save();
		logger.info(`Project draft section updated successfully. Project ID: ${projectId}`);
		return {
			status: "success",
			message: "Project draft section updated successfully.",
			updatedProject,
		};
	} catch (error) {
		logger.error("Error while updating the project draft section: ", error);

		return {
			status: "error",
			message: "An error occurred while updating the project draft section.",
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
			return { status: "error", message: "Project not found." };
		}

		const fieldsString = fields.join(" ");

		const search = { _id: objectIdProjectId, ...conditions };
		const projectRetrieved = await Project.findOne(search)
			.select(fieldsString)
			.populate([
				{ path: "category", select: "-_id categoryId name link colors subCategories" },
				{ path: "tags", select: "-_id tagId name description link" },
				{ path: "updatedBy", select: "username profilePicture userId" },
				{ path: "steps.updatedBy", select: "username profilePicture userId" },
				{ path: "steps.stepsList.status", select: "-_id status colors" },
				{ path: "members.user", select: "username profilePicture userId" },
				{ path: "statusInfo.currentStatus", select: "-_id status colors description" },
				{ path: "statusInfo.statusHistory.status", select: "-_id status colors" },
				{ path: "statusInfo.statusHistory.updatedBy", select: "username profilePicture userId" },
				{ path: "privateData.attachments.updatedBy", select: "username profilePicture userId" },
			]); // Populate fields

		if (!projectRetrieved) {
			return {
				status: "error",
				message: "Project not found.",
			};
		}
		let project = projectRetrieved.toObject();

		if (!fields.includes("category")) {
			delete project.category;
		}
		if (!fields.includes("updatedBy")) {
			delete project.updatedBy;
		}
		if (!fields.includes("steps")) {
			delete project.steps;
		}
		if (!fields.includes("members")) {
			delete project.members;
		}
		if (!fields.includes("statusInfo")) {
			delete project.statusInfo;
		}
		if (!fields.includes("privateData")) {
			delete project.privateData;
		}

		if (fields.includes("subCategory") && project.subCategory && project.category && Array.isArray(project.category.subCategories)) {
			const subCategoryName = project.subCategory;
			const matchedSub = project.category.subCategories.find((sc) => sc.name === subCategoryName);

			project.subCategoryDetails = matchedSub || null;

			delete project.category.subCategories;
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

const retrieveProjectByLink = async (projectLink, fields, conditions) => {
	try {
		const fieldsString = fields.join(" ");

		const search = { link: projectLink, ...conditions };
		const project = await Project.findOne(search)
			.select(fieldsString)
			.populate([
				{ path: "category", select: "-_id categoryId name link colors subCategories" },
				{ path: "tags", select: "-_id tagId name description link" },
				{ path: "createdBy", select: "-_id username profilePicture userId" },
				{ path: "updatedBy", select: "-_id username profilePicture userId" },
				{ path: "steps.updatedBy", select: "-_id username profilePicture userId" },
				{ path: "QAs.updatedBy", select: "-_id username profilePicture userId" },
				{ path: "steps.stepsList.status", select: "-_id statusId status colors description" },
				{ path: "members.user", select: "-_id username profilePicture userId" },
				{ path: "statusInfo.currentStatus", select: "-_id statusId status colors description" },
				{ path: "statusInfo.statusHistory.status", select: "-_id status colors" },
				{ path: "statusInfo.statusHistory.updatedBy", select: "-_id username profilePicture userId" },
				{ path: "privateData.attachments.updatedBy", select: "-_id username profilePicture userId" },
			])
			.lean();

		if (!project) {
			return {
				status: "error",
				message: "Project not found.",
			};
		}

		if (!fields.includes("category")) {
			delete project.category;
		}
		if (!fields.includes("tags")) {
			delete project.tags;
		}
		if (!fields.includes("updatedBy")) {
			delete project.updatedBy;
		}
		if (!fields.includes("steps")) {
			delete project.steps;
		}
		if (!fields.includes("QAs")) {
			delete project.QAs;
		}

		if (!fields.includes("members")) {
			delete project.members;
		}
		if (!fields.includes("statusInfo")) {
			delete project.statusInfo;
		}
		if (!fields.includes("privateData")) {
			delete project.privateData;
		}

		if (fields.includes("subCategory") && project.subCategory && project.category && Array.isArray(project.category.subCategories)) {
			const subCategoryName = project.subCategory;
			const matchedSub = project.category.subCategories.find((sc) => sc.name === subCategoryName);

			project.subCategoryDetails = matchedSub || null;

			delete project.category.subCategories;
		}

		if (fields.includes("QAs") && project.QAs) {
			delete project.QAs._id;
		}

		if (fields.includes("talentsNeeded") && project.talentsNeeded) {
			delete project.talentsNeeded._id;
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

const retrieveProjects = async (fields, conditions, limit) => {
	try {
		let query = Project.find(conditions).sort({ createdAt: -1 }).limit(limit);
		if (fields) {
			const fieldsString = fields.join(" ");

			query = query.select(fieldsString).populate([
				{ path: "category", select: "-_id name categoryId" },
				{ path: "tags", select: "-_id tagId name description link" },
				{ path: "updatedBy", select: "username profilePicture userId" },
				{ path: "steps.updatedBy", select: "username profilePicture userId" },
				{ path: "members.user", select: "username profilePicture userId" },
				{ path: "statusInfo.currentStatus", select: "-_id status colors description" },
				{ path: "statusInfo.statusHistory.updatedBy", select: "username profilePicture userId" },
			]); // Populate fields
		}
		// select(`-_id -__v ${fields}`)
		const projectsRetrieved = await query;

		if (!projectsRetrieved || projectsRetrieved.length === 0) {
			logger.info(`No project found.`);
			return { status: "success", message: "No project found." };
		}

		let projects = projectsRetrieved.map((project) => {
			let modifiedProject = project.toObject();

			if (!fields.includes("category")) {
				delete modifiedProject.category;
			}
			if (!fields.includes("tags")) {
				delete modifiedProject.tags;
			}
			if (!fields.includes("updatedBy")) {
				delete modifiedProject.updatedBy;
			}
			if (!fields.includes("steps")) {
				delete modifiedProject.steps;
			}
			if (!fields.includes("members")) {
				delete modifiedProject.members;
			}
			if (!fields.includes("statusInfo")) {
				delete modifiedProject.statusInfo;
			}

			return modifiedProject;
		});

		const nbProjects = projects.length;

		if (nbProjects === 1) {
			logger.info(`${nbProjects} project retrieved successfully.`);
			return { status: "success", message: `${nbProjects} project retrieved successfully.`, projects };
		} else logger.info(`${nbProjects} projects retrieved successfully.`);
		return { status: "success", message: `${nbProjects} projects retrieved successfully.`, projects };
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
		const nbPublicSubmittedProject = await Project.countDocuments({ visibility: "public", "statusInfo.currentStatus.status": "submitted" }); // Count documents with visibility set to "public" and status set to "submitted"
		const nbPublicOnHoldProject = await Project.countDocuments({ visibility: "public", "statusInfo.currentStatus.status": "on hold" }); // Count documents with visibility set to "public" and status set to "on hold"
		const nbPublicCompletedProject = await Project.countDocuments({ visibility: "public", "statusInfo.currentStatus.status": "completed" }); // Count documents with visibility set to "public" and status set to "completed"
		const nbPublicArchivedProject = await Project.countDocuments({ visibility: "public", "statusInfo.currentStatus.status": "archived" }); // Count documents with visibility set to "public" and status set to "archived"
		const nbPublicCancelledProject = await Project.countDocuments({ visibility: "public", "statusInfo.currentStatus.status": "cancelled" }); // Count documents with visibility set to "public" and status set to "cancelled"
		const nbPublicActiveProject = await Project.countDocuments({
			visibility: "public",
			"statusInfo.currentStatus.status": "active",
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

const canUpdateProject = async (projectData) => {
	try {
		const { projectId, userId, permission, projectWrongStatus, attachmentTitle, attachmentKey } = projectData;
		const update = permission.substring(7).toLowerCase();

		const objectIdUserIdUpdater = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserIdUpdater.status == "error") {
			return { status: "error", message: objectIdUserIdUpdater.message };
		}

		// Retrieve the updated project
		const projectRetrieved = await retrieveProjectById(projectId, ["-_id", "cover", "statusInfo", "createdBy", "privateData.attachments"]);
		if (projectRetrieved.status !== "success") {
			return { status: "error", message: projectRetrieved.message };
		}

		// Check the project status
		const projectStatus = projectRetrieved.project.statusInfo.currentStatus.status;
		if (projectWrongStatus.includes(projectStatus)) {
			return { status: "success", message: `Project in status ${projectStatus.toUpperCase()} cannot be updated.`, userCanEdit: false };
		}

		if (permission === "canEditCover" && projectStatus === "draft") {
			if (projectRetrieved.project.createdBy.toString() !== objectIdUserIdUpdater.toString()) {
				return { status: "success", message: "Only the creator of the project can update it.", userCanEdit: false };
			} else {
				return { status: "success", message: `User can edit the ${update} of the project.`, userCanEdit: true, project: projectRetrieved.project };
			}
		}

		// Retrieve Project Rights of the user
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userId);
		if (rightsCheckResult.status !== "success") {
			return { status: "error", message: rightsCheckResult.message };
		}

		// Check if the user has canEditCover permission
		if (!rightsCheckResult.projectRights.permissions[permission]) {
			return { status: "success", message: `You do not have permission to update the ${update} for this project.`, userCanEdit: false };
		}

		// Verify that attachment title does not already exists in the list of attachments
		if (attachmentTitle) {
			const newTitleCapitalized = attachmentTitle.toUpperCase();
			const isTitleAlreadyPresent = projectRetrieved.project.privateData.attachments.findIndex((element) => {
				return element.title.toUpperCase() === newTitleCapitalized;
			});
			if (isTitleAlreadyPresent !== -1) {
				return { status: "success", message: "Attachment title is not available.", userCanEdit: false };
			}
		}

		// Verify that attachment title does not already exists in the list of attachments
		if (attachmentKey) {
			const isKeyPresent = projectRetrieved.project.privateData.attachments.findIndex((element) => {
				return element.key === attachmentKey;
			});
			if (isKeyPresent === -1) {
				return { status: "success", message: "Attachment not found.", userCanEdit: false };
			}
		}

		logger.info(`User can edit the ${update} of the project.`);
		return { status: "success", message: `User can edit the ${update} of the project.`, userCanEdit: true, project: projectRetrieved.project };
	} catch (error) {
		logger.error("Error while while checking if the user can update the project: ", error);
		return {
			status: "error",
			message: "An error occurred while checking if the user can update the project.",
		};
	}
};

const updateObjective = async (projectId, userIdUpdater, objective, action) => {
	try {
		const objectIdUserIdUpdater = encryptTools.convertIdToObjectId(userIdUpdater);
		if (objectIdUserIdUpdater.status == "error") {
			return { status: "error", message: objectIdUserIdUpdater.message };
		}
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		const project = await Project.findOne({ _id: objectIdProjectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		// Verify if objective already exists
		const existingObjectiveIndex = project.objectives.findIndex((obj) => obj.toLowerCase() === objective.toLowerCase());

		if (action === "add") {
			if (existingObjectiveIndex !== -1) {
				return { status: "error", message: "Objective already present in the project." };
			}

			// Max objectives limit
			const MAX_OBJECTIVES = 20;

			if (project.objectives.length >= MAX_OBJECTIVES) {
				return {
					status: "error",
					message: `You cannot add more than ${MAX_OBJECTIVES} objectives to a project.`,
				};
			}

			// Add new objective
			project.objectives.push(objective);

			await project.save();

			logger.info(`Objective added to the project successfully. Project ID: ${projectId} - Objective: ${objective}`);
			return { status: "success", message: "Objective added successfully." };
		}

		if (action === "remove") {
			if (existingObjectiveIndex === -1) {
				return { status: "error", message: "Objective not found in the project." };
			}

			// Remove Objective from the list
			project.objectives.splice(existingObjectiveIndex, 1);

			// Save the updated project
			await project.save();

			logger.info(`Objective removed from the project successfully. Project ID: ${projectId} - Objective: ${objective}`);
			return { status: "success", message: "Objective removed successfully." };
		} else {
			throw new Error("Invalid action specified.");
		}
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

module.exports = {
	createProject,
	updateProjectDraft,
	removeProjectDraft,
	processProjectApproval,
	updateProject,
	updateProjectCategorySubCategory,
	updateProjectDraftSection,
	retrieveProjectById,
	retrieveProjectByLink,
	retrieveProjects,
	countNumberProjects,
	countNumberProjectsPerCategory,
	canUpdateProject,
	updateObjective,
};
