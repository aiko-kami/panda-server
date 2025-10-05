const { Project, ProjectStatus } = require("../../models");
const { logger, encryptTools, statusTools } = require("../../utils");
const { DateTime } = require("luxon");

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
			{ path: "members.user", select: "username profilePicture userId" },
			{ path: "category", select: "-_id name categoryId" },
		]);

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		// Update project status
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
			timestamp: DateTime.now().toHTTP(),
		});

		const updatedProject = await project.save();

		logger.info(`Project status updated successfully. Project ID: ${projectId} - Updater user ID: ${userIdUpdater} - Former project status: ${formerStatus} - New project status: ${newStatus}`);
		return { status: "success", message: "Project status updated successfully.", project: updatedProject };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const retrieveStatusById = async (projectStatusId, fields) => {
	try {
		// Convert id to ObjectId
		const objectIdStatusId = encryptTools.convertIdToObjectId(projectStatusId);
		if (objectIdStatusId.status == "error") {
			return { status: "error", message: objectIdStatusId.message };
		}

		const fieldsString = fields.join(" ");

		const search = { _id: objectIdStatusId };
		const projectStatusRetrieved = await ProjectStatus.findOne(search).select(fieldsString);
		if (!projectStatusRetrieved) {
			return {
				status: "error",
				message: "Project status not found.",
			};
		}
		let projectStatus = projectStatusRetrieved.toObject();
		return {
			status: "success",
			message: "Project status retrieved successfully.",
			projectStatus,
		};
	} catch (error) {
		logger.error("Error while retrieving project status from the database:", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the project status.",
		};
	}
};

const retrieveStatusByName = async (projectStatusName, fields) => {
	try {
		const fieldsString = fields.join(" ");

		const search = { status: projectStatusName };
		const projectStatusRetrieved = await ProjectStatus.findOne(search).select(fieldsString);
		if (!projectStatusRetrieved) {
			return {
				status: "error",
				message: "Project status not found.",
			};
		}
		let projectStatus = projectStatusRetrieved.toObject();
		return {
			status: "success",
			message: "Project status retrieved successfully.",
			projectStatus,
		};
	} catch (error) {
		logger.error("Error while retrieving project status from the database:", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the project status.",
		};
	}
};

const retrieveAllStatuses = async (fields) => {
	try {
		const fieldsString = fields.join(" ");

		const projectStatuses = await ProjectStatus.find().sort({ name: 1 }).select(fieldsString);
		if (!projectStatuses) {
			return { status: "error", message: "No project status found." };
		}

		return { status: "success", projectStatuses };
	} catch (error) {
		logger.error(`Error while retrieving the project statuses: ${error}`);
		return { status: "error", message: "An error occurred while retrieving the project statuses." };
	}
};

const createStatus = async (projectStatusName, projectStatusDescription, projectStatusColors) => {
	try {
		// Check if a project status with the same name already exists
		const existingProjectStatus = await ProjectStatus.findOne({ status: projectStatusName });
		if (existingProjectStatus) {
			logger.error("Error while creating the project status: Project status already exists.");
			return { status: "error", message: "Project status already exists." };
		}

		// Create a new project status document
		const newProjectStatus = new ProjectStatus({
			status: projectStatusName,
			description: projectStatusDescription,
			colors: projectStatusColors,
		});

		// Save the project status to the database
		const created = await newProjectStatus.save();
		//Add encrypted ID
		const encryptedId = encryptTools.convertObjectIdToId(created._id.toString());
		const createdProjectStatus = await ProjectStatus.findOneAndUpdate({ _id: created._id }, { projectStatusId: encryptedId }, { new: true }).select("-_id -__v");

		logger.info(`Project status created successfully. Project status: ${createdProjectStatus}`);
		return {
			status: "success",
			message: "Project status created successfully.",
			data: { createdProjectStatus },
		};
	} catch (error) {
		logger.error("Error while creating the project status: ", error);
		return {
			status: "error",
			message: "An error occurred while creating the project status.",
		};
	}
};

const editStatus = async (projectStatusId, newName, newDescription, newColors) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectStatusId = encryptTools.convertIdToObjectId(projectStatusId);
		if (objectIdProjectStatusId.status == "error") {
			return { status: "error", message: objectIdProjectStatusId.message };
		}

		// Check if a project status with the given projectStatusId exists
		const existingProjectStatus = await ProjectStatus.findOne({ _id: objectIdProjectStatusId });
		if (!existingProjectStatus) {
			logger.error("Error while updating the project status: Project status not found.");
			return { status: "error", message: "Project status not found." };
		}

		// Check if the new name already exists for another project status in the collection (must be unique)
		if (newName !== existingProjectStatus.status) {
			const nameExists = await ProjectStatus.findOne({
				status: newName,
				_id: { $ne: existingProjectStatus._id }, // exclude the current project status document
			});

			if (nameExists) {
				logger.error("Error while updating the project status: Project status name already exists.");
				return { status: "error", message: "Project status name already exists." };
			}
		}

		// Update the project status data
		existingProjectStatus.status = newName;
		existingProjectStatus.description = newDescription;
		existingProjectStatus.colors = newColors;
		await existingProjectStatus.save();

		logger.info(`Project status updated successfully. projectStatusId: ${projectStatusId}`);

		return {
			status: "success",
			message: "Project status updated successfully.",
			data: { updatedProjectStatus: existingProjectStatus },
		};
	} catch (error) {
		logger.error(`Error while updating project status: ${error}`);

		return {
			status: "error",
			message: "An error occurred while updating the project status.",
		};
	}
};

const removeStatus = async (projectStatusId) => {
	try {
		// Convert id to ObjectId
		const objectIdStatusId = encryptTools.convertIdToObjectId(projectStatusId);
		if (objectIdStatusId.status == "error") {
			return { status: "error", message: objectIdStatusId.message };
		}

		// Check if a project status with the given projectStatusId exists
		const existingProjectStatus = await ProjectStatus.findOne({ _id: objectIdStatusId });
		if (!existingProjectStatus) {
			logger.error("Error while removing the project status: Project status not found.");
			return { status: "error", message: "Project status not found." };
		}

		// Remove the project status from the database
		await existingProjectStatus.deleteOne();

		logger.info(`Project status removed successfully. projectStatusId: ${projectStatusId}`);

		return {
			status: "success",
			message: "Project status removed successfully.",
			data: { removedProjectStatus: existingProjectStatus },
		};
	} catch (error) {
		logger.error(`Error while removing the project status: ${error}`);
		return {
			status: "error",
			message: "An error occurred while removing the project status.",
		};
	}
};

module.exports = {
	updateStatus,
	retrieveStatusById,
	retrieveStatusByName,
	retrieveAllStatuses,
	createStatus,
	editStatus,
	removeStatus,
};
