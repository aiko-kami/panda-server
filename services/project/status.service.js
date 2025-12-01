const { Project, Status } = require("../../models");
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

const updateProjectStatus = async (projectId, userIdUpdater, newStatusId, reason) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		const objectIdNewStatusId = encryptTools.convertIdToObjectId(newStatusId);
		if (objectIdNewStatusId.status == "error") {
			return { status: "error", message: objectIdNewStatusId.message };
		}

		const objectIdUserIdUpdater = encryptTools.convertIdToObjectId(userIdUpdater);
		if (objectIdUserIdUpdater.status == "error") {
			return { status: "error", message: objectIdUserIdUpdater.message };
		}

		// Retrieve project
		const project = await Project.findOne({ _id: objectIdProjectId }).populate([
			{ path: "members.user", select: "username profilePicture userId" },
			{ path: "category", select: "-_id name categoryId" },
			{ path: "category", select: "-_id name categoryId" },
			{ path: "statusInfo.currentStatus", select: "-_id status" },
		]);
		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		// Retrieve status from newStatusId
		const newStatus = await Status.findOne({ _id: objectIdNewStatusId });
		if (!newStatus) {
			return { status: "error", message: "newStatus not found." };
		}

		// Update project status
		const formerStatus = project.statusInfo.currentStatus.status;

		const statusUpdateValidated = statusTools.validateStatusUpdate(newStatus.status, formerStatus);
		if (statusUpdateValidated.status == "error") {
			return { status: "error", message: statusUpdateValidated.message };
		}

		// Update current status and reason
		project.statusInfo.currentStatus.status = objectIdNewStatusId;
		project.statusInfo.reason = reason;

		// Add the status change to the history
		project.statusInfo.statusHistory.push({
			status: objectIdNewStatusId,
			updatedBy: objectIdUserIdUpdater,
			reason: reason,
			timestamp: DateTime.now().toHTTP(),
		});

		const updatedProject = await project.save();

		logger.info(`Project status updated successfully. Project ID: ${projectId} - Updater user ID: ${userIdUpdater} - Former project status: ${formerStatus} - New project status: ${newStatus.status}`);
		return { status: "success", message: "Project status updated successfully.", project: updatedProject };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const retrieveStatusById = async (statusId, statusType, fields) => {
	try {
		// Convert id to ObjectId
		const objectIdStatusId = encryptTools.convertIdToObjectId(statusId);
		if (objectIdStatusId.status == "error") {
			return { status: "error", message: objectIdStatusId.message };
		}

		const fieldsString = fields.join(" ");

		const search = { _id: objectIdStatusId, type: statusType };
		const statusRetrieved = await Status.findOne(search).select(fieldsString);
		if (!statusRetrieved) {
			return {
				status: "error",
				message: "Status not found.",
			};
		}
		let status = statusRetrieved.toObject();
		return {
			status: "success",
			message: "Status retrieved successfully.",
			status,
		};
	} catch (error) {
		logger.error("Error while retrieving status from the database:", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the status.",
		};
	}
};

const retrieveStatusByName = async (statusName, statusType, fields) => {
	try {
		const fieldsString = fields.join(" ");

		const search = { status: statusName, type: statusType };
		const statusRetrieved = await Status.findOne(search).select(fieldsString);
		if (!statusRetrieved) {
			return {
				status: "error",
				message: "Status not found.",
			};
		}
		let status = statusRetrieved.toObject();
		return {
			status: "success",
			message: "Status retrieved successfully.",
			status,
		};
	} catch (error) {
		logger.error("Error while retrieving status from the database:", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the status.",
		};
	}
};

const retrieveAllStatuses = async (statusType, fields) => {
	try {
		const fieldsString = fields.join(" ");

		const statuses = await Status.find({ type: statusType }).sort({ name: 1 }).select(fieldsString);
		if (!statuses) {
			return { status: "error", message: "No status found." };
		}

		return { status: "success", statuses };
	} catch (error) {
		logger.error(`Error while retrieving the statuses: ${error}`);
		return { status: "error", message: "An error occurred while retrieving the statuses." };
	}
};

const createStatus = async (statusName, statusDescription, statusColors, statusType) => {
	try {
		// Check if a status with the same name already exists for this type
		const existingStatus = await Status.findOne({ status: statusName, type: statusType });
		if (existingStatus) {
			logger.error("Error while creating the status: Status already exists.");
			return { status: "error", message: "Status already exists." };
		}

		// Create a new status document
		const newStatus = new Status({
			status: statusName,
			description: statusDescription,
			colors: statusColors,
			type: statusType,
		});

		// Save the status to the database
		const created = await newStatus.save();
		//Add encrypted ID
		const encryptedId = encryptTools.convertObjectIdToId(created._id.toString());

		const createdStatus = await Status.findOneAndUpdate({ _id: created._id }, { statusId: encryptedId }, { new: true }).select("-_id -__v");

		logger.info(`Status created successfully. Status: ${createdStatus}`);
		return {
			status: "success",
			message: "Status created successfully.",
			data: { createdStatus },
		};
	} catch (error) {
		logger.error("Error while creating the status: ", error);
		return {
			status: "error",
			message: "An error occurred while creating the status.",
		};
	}
};

const editStatus = async (statusId, newName, newDescription, newColors, statusType) => {
	try {
		// Convert id to ObjectId
		const objectIdStatusId = encryptTools.convertIdToObjectId(statusId);
		if (objectIdStatusId.status == "error") {
			return { status: "error", message: objectIdStatusId.message };
		}

		// Check if a status with the given statusId exists
		const existingStatus = await Status.findOne({ _id: objectIdStatusId, type: statusType });
		if (!existingStatus) {
			logger.error("Error while updating the status: Status not found.");
			return { status: "error", message: "Status not found." };
		}

		// Check if the new name already exists for another status for this type in the collection (must be unique)
		if (newName !== existingStatus.status) {
			const nameExists = await Status.findOne({
				status: newName,
				type: statusType,
				_id: { $ne: existingStatus._id }, // exclude the current status document
			});
			if (nameExists) {
				logger.error("Error while updating the status: Status name already exists.");
				return { status: "error", message: "Status name already exists." };
			}
		}

		// Update the status data
		existingStatus.status = newName;
		existingStatus.description = newDescription;
		existingStatus.colors = newColors;
		await existingStatus.save();

		// Update data before returning it in the response
		delete existingStatus._id;
		logger.info(`Status updated successfully. statusId: ${statusId}`);

		return {
			status: "success",
			message: "Status updated successfully.",
			data: { updatedStatus: existingStatus },
		};
	} catch (error) {
		logger.error(`Error while updating status: ${error}`);

		return {
			status: "error",
			message: "An error occurred while updating the status.",
		};
	}
};

const removeStatus = async (statusId, statusType) => {
	try {
		// Convert id to ObjectId
		const objectIdStatusId = encryptTools.convertIdToObjectId(statusId);
		if (objectIdStatusId.status == "error") {
			return { status: "error", message: objectIdStatusId.message };
		}

		// Check if a status with the given statusId and statusType exists
		const existingStatus = await Status.findOne({ _id: objectIdStatusId, statusType: statusType }, "-_id");
		if (!existingStatus) {
			logger.error("Error while removing the status: Status not found.");
			return { status: "error", message: "Status not found." };
		}

		// Remove the status from the database
		await existingStatus.deleteOne();

		logger.info(`Status removed successfully. statusId: ${statusId}`);

		return {
			status: "success",
			message: "Status removed successfully.",
			data: { removedStatus: existingStatus },
		};
	} catch (error) {
		logger.error(`Error while removing the status: ${error}`);
		return {
			status: "error",
			message: "An error occurred while removing the status.",
		};
	}
};

module.exports = {
	updateProjectStatus,
	retrieveStatusById,
	retrieveStatusByName,
	retrieveAllStatuses,
	createStatus,
	editStatus,
	removeStatus,
};
