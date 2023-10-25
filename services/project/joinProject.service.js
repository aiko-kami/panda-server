const { Project, JoinProject } = require("../../models");
const { logger } = require("../../utils");

const createJoinProject = async (joinProjectData) => {
	try {
		const project = await Project.findOne({ projectId: joinProjectData.projectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		let createdRequest;

		if (joinProjectData.requestType === "join project request") {
			// Check if the sender is already a member of the project
			const existingMemberIndex = project.members.findIndex((member) => member.userId === joinProjectData.userIdSender);
			if (existingMemberIndex !== -1) {
				return { status: "error", message: "User is already a member of the project." };
			}

			//Check if request does not already exist for the user and this project
			const existingRequest = await JoinProject.findOne({
				projectId: joinProjectData.projectId,
				userIdSender: joinProjectData.userIdSender,
				requestType: joinProjectData.requestType,
			});

			if (existingRequest) {
				return { status: "error", message: "A join request already exists for this user and project." };
			}

			// Create a new join project request
			const newJoinProject = new JoinProject({
				projectId: joinProjectData.projectId,
				userIdSender: joinProjectData.userIdSender,
				requestType: joinProjectData.requestType,
				talent: joinProjectData.talent,
				message: joinProjectData.message,
				updatedBy: joinProjectData.userIdSender,
				status: joinProjectData.joinProjectStatus,
			});

			// Save the new join project request
			createdRequest = await newJoinProject.save();
		} else if (joinProjectData.requestType === "join project invitation") {
			// Check if the sender is already a member of the project
			const existingMemberIndex = project.members.findIndex((member) => member.userId === joinProjectData.userIdReceiver);
			if (existingMemberIndex !== -1) {
				return { status: "error", message: "User is already a member of the project." };
			}

			//Check if invitation does not already exist for the user and this project
			const existingRequest = await JoinProject.findOne({
				projectId: joinProjectData.projectId,
				userIdReceiver: joinProjectData.userIdReceiver,
				requestType: joinProjectData.requestType,
			});

			if (existingRequest) {
				return { status: "error", message: "A join invitation already exists for this user and project." };
			}

			// Create a new join project invitation
			const newJoinProject = new JoinProject({
				projectId: joinProjectData.projectId,
				userIdSender: joinProjectData.userIdSender,
				userIdReceiver: joinProjectData.userIdReceiver,
				requestType: joinProjectData.requestType,
				talent: joinProjectData.talent,
				message: joinProjectData.message,
				updatedBy: joinProjectData.userIdSender,
				status: joinProjectData.joinProjectStatus,
			});

			// Save the new join project request
			createdRequest = await newJoinProject.save();
		}
		const joinProject = {
			projectId: createdRequest.projectId,
			userIdSender: createdRequest.userIdSender,
			userIdReceiver: createdRequest.userIdReceiver,
			requestType: createdRequest.requestType,
			talent: createdRequest.talent,
			message: createdRequest.message,
			updatedBy: createdRequest.updatedBy,
			status: createdRequest.status,
			joinProjectId: createdRequest.joinProjectId,
			createdAt: createdRequest.createdAt,
			updatedAt: createdRequest.updatedAt,
		};

		logger.info(
			`${joinProjectData.requestType} created successfully. Project ID: ${joinProjectData.projectId} - Sender User ID: ${joinProjectData.userIdSender} - Receiver User ID: ${
				joinProjectData.userIdReceiver || "N/A"
			} - ${joinProjectData.requestType} status: ${joinProjectData.joinProjectStatus}`
		);
		return { status: "success", message: `${joinProjectData.requestType} created successfully.`, joinProject };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const updateJoinProject = async (joinProjectData) => {
	try {
		//Check if request exists for the user and this project
		const existingJoinProject = await JoinProject.findOne({ joinProjectId: joinProjectData.joinProjectId });

		const capitalizedRequestType = joinProjectData.requestType.charAt(0).toUpperCase() + joinProjectData.requestType.slice(1);

		if (!existingJoinProject) {
			return { status: "error", message: `${capitalizedRequestType} not found.` };
		}

		if (existingJoinProject.userIdSender !== joinProjectData.userIdSender) {
			return { status: "error", message: `Only the sender of the ${joinProjectData.requestType} can update it.` };
		}

		if (existingJoinProject.status !== "draft") {
			return { status: "error", message: `You can only update draft ${joinProjectData.requestType}.` };
		}

		const project = await Project.findOne({ projectId: joinProjectData.projectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		let updatedJoinProject;

		if (joinProjectData.requestType === "join project request") {
			// Check if the sender is already a member of the project
			const existingMemberIndex = project.members.findIndex((member) => member.userId === joinProjectData.userIdSender);
			if (existingMemberIndex !== -1) {
				return { status: "error", message: "User is already a member of the project." };
			}

			// Update join project request
			existingJoinProject.projectId = joinProjectData.projectId;
			existingJoinProject.userIdSender = joinProjectData.userIdSender;
			existingJoinProject.requestType = joinProjectData.requestType;
			existingJoinProject.talent = joinProjectData.talent;
			existingJoinProject.message = joinProjectData.message;
			existingJoinProject.updatedBy = joinProjectData.userIdSender;
			existingJoinProject.status = joinProjectData.joinProjectStatus;

			// Save the updated join project request
			updatedJoinProject = await existingJoinProject.save();
		} else if (joinProjectData.requestType === "join project invitation") {
			// Check if the sender is already a member of the project
			const existingMemberIndex = project.members.findIndex((member) => member.userId === joinProjectData.userIdReceiver);
			if (existingMemberIndex !== -1) {
				return { status: "error", message: "User is already a member of the project." };
			}

			// Update join project request
			existingJoinProject.projectId = joinProjectData.projectId;
			existingJoinProject.userIdSender = joinProjectData.userIdSender;
			existingJoinProject.userIdReceiver = joinProjectData.userIdReceiver;
			existingJoinProject.requestType = joinProjectData.requestType;
			existingJoinProject.talent = joinProjectData.talent;
			existingJoinProject.message = joinProjectData.message;
			existingJoinProject.updatedBy = joinProjectData.userIdSender;
			existingJoinProject.status = joinProjectData.joinProjectStatus;

			// Save the updated join project
			updatedJoinProject = await existingJoinProject.save();
		}

		const joinProject = {
			projectId: updatedJoinProject.projectId,
			userIdSender: updatedJoinProject.userIdSender,
			userIdReceiver: updatedJoinProject.userIdReceiver,
			requestType: updatedJoinProject.requestType,
			talent: updatedJoinProject.talent,
			message: updatedJoinProject.message,
			updatedBy: updatedJoinProject.updatedBy,
			status: updatedJoinProject.status,
			joinProjectId: updatedJoinProject.joinProjectId,
			createdAt: updatedJoinProject.createdAt,
			updatedAt: updatedJoinProject.updatedAt,
		};

		logger.info(
			`${capitalizedRequestType} updated successfully. Project ID: ${joinProject.projectId} - Sender User ID: ${joinProject.userIdSender} - Receiver User ID: ${
				joinProject.userIdSender || "N/A"
			} - ${capitalizedRequestType} status: ${joinProject.status}`
		);
		return { status: "success", message: `${capitalizedRequestType} updated successfully.`, joinProject };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const updateStatusJoinProject = async (userIdUpdater, joinProjectId, newJoinProjectStatus, requestType) => {
	try {
		//Check if request exists for the user and this project
		const existingJoinProject = await JoinProject.findOne({ joinProjectId });

		const capitalizedRequestType = requestType.charAt(0).toUpperCase() + requestType.slice(1);

		if (!existingJoinProject) {
			return { status: "error", message: `${capitalizedRequestType} not found.` };
		}

		const project = await Project.findOne({ projectId: existingJoinProject.projectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		// Check if the sender is already a member of the project
		const existingMemberIndex = project.members.findIndex((member) => member.userId === existingJoinProject.userIdSender);
		if (existingMemberIndex !== -1) {
			return { status: "error", message: "User is already a member of the project." };
		}

		let updatedJoinProject;

		if (newJoinProjectStatus === "cancelled") {
			if (existingJoinProject.userIdSender !== userIdUpdater) {
				return { status: "error", message: `Only the sender of the ${requestType} can cancel it.` };
			}

			if (existingJoinProject.status !== "sent" && existingJoinProject.status !== "read") {
				return { status: "error", message: `You can only update sent ${requestType}.` };
			}

			existingJoinProject.status = newJoinProjectStatus;
			existingJoinProject.updatedBy = userIdUpdater;
			updatedJoinProject = await existingJoinProject.save();
		} else if (newJoinProjectStatus === "accepted") {
			if (requestType === "join project request") {
				if (existingJoinProject.status !== "sent" && existingJoinProject.status !== "read") {
					return { status: "error", message: `You can only update sent ${requestType}.` };
				}

				existingJoinProject.status = newJoinProjectStatus;
				existingJoinProject.updatedBy = userIdUpdater;
				updatedJoinProject = await existingJoinProject.save();
			} else if (requestType === "join project invitation") {
				if (existingJoinProject.userIdReceiver !== userIdUpdater) {
					return { status: "error", message: `Only the receiver of the ${requestType} can accept or refuse it.` };
				}

				if (existingJoinProject.status !== "sent" && existingJoinProject.status !== "read") {
					return { status: "error", message: `You can only update sent ${requestType}.` };
				}

				existingJoinProject.status = newJoinProjectStatus;
				existingJoinProject.updatedBy = userIdUpdater;
				updatedJoinProject = await existingJoinProject.save();
			}
		} else if (newJoinProjectStatus === "refused") {
			if (existingJoinProject.userIdReceiver !== userIdUpdater) {
				return { status: "error", message: `Only the receiver of the ${requestType} can accept or refuse it.` };
			}

			if (existingJoinProject.status !== "sent" && existingJoinProject.status !== "read") {
				return { status: "error", message: `You can only update sent ${requestType}.` };
			}

			existingJoinProject.status = newJoinProjectStatus;
			existingJoinProject.updatedBy = userIdUpdater;
			updatedJoinProject = await existingJoinProject.save();
		}

		const joinProject = {
			projectId: updatedJoinProject.projectId,
			userIdSender: updatedJoinProject.userIdSender,
			userIdReceiver: updatedJoinProject.userIdReceiver,
			requestType: updatedJoinProject.requestType,
			talent: updatedJoinProject.talent,
			message: updatedJoinProject.message,
			updatedBy: updatedJoinProject.updatedBy,
			status: updatedJoinProject.status,
			joinProjectId: updatedJoinProject.joinProjectId,
			createdAt: updatedJoinProject.createdAt,
			updatedAt: updatedJoinProject.updatedAt,
		};

		logger.info(
			`Status of ${capitalizedRequestType} updated successfully. Project ID: ${joinProject.projectId} - Sender User ID: ${joinProject.userIdSender} - Receiver User ID: ${
				joinProject.userIdReceiver || "N/A"
			} - ${capitalizedRequestType} new status: ${joinProject.status}`
		);
		return { status: "success", message: `Status of ${capitalizedRequestType} updated successfully.`, joinProject };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const removeJoinProject = async (userIdSender, joinProjectId, requestType) => {
	try {
		//Check if request exists for the user and this project
		const existingJoinProject = await JoinProject.findOne({ joinProjectId, requestType });

		const capitalizedRequestType = requestType.charAt(0).toUpperCase() + requestType.slice(1);

		if (!existingJoinProject) {
			return { status: "error", message: `${capitalizedRequestType} not found.` };
		}

		if (existingJoinProject.userIdSender !== userIdSender) {
			return { status: "error", message: `Only the sender of the ${requestType} can remove it.` };
		}

		if (existingJoinProject.status !== "draft") {
			return { status: "error", message: `You can only remove draft ${requestType}.` };
		}

		// Remove the join project request from the database
		await existingJoinProject.deleteOne();

		const joinProjectRemoved = { ...existingJoinProject.toObject() };
		delete joinProjectRemoved._id;

		logger.info(
			`${joinProjectRemoved.requestType} removed successfully. Project ID: ${joinProjectRemoved.projectId} - Sender User ID: ${joinProjectRemoved.userIdSender} - Receiver User ID: ${
				joinProjectRemoved.userIdReceiver || "N/A"
			}`
		);
		return { status: "success", message: `${joinProjectRemoved.requestType} removed successfully.`, joinProjectRemoved };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const retrieveMyJoinProjects = async (userIdSender, requestType, statusType) => {
	try {
		let query;
		if (statusType === "all") {
			query = { userIdSender, requestType };
		} else {
			query = { userIdSender, requestType, status: statusType };
		}

		const joinProject = await JoinProject.find(query).select("-_id -__v");

		const nbJoinProject = await JoinProject.countDocuments(query);

		if (joinProject.length === 0) {
			logger.info(`No ${requestType} found.`);
			return { status: "success", message: `No ${requestType} found.`, joinProject };
		} else if (joinProject.length === 1) {
			logger.info(`${nbJoinProject} ${requestType} retrieved successfully.`);
			return { status: "success", message: `${nbJoinProject} ${requestType} retrieved successfully.`, joinProject };
		} else logger.info(`${nbJoinProject} ${requestType}s retrieved successfully.`);
		return { status: "success", message: `${nbJoinProject} ${requestType}s retrieved successfully.`, joinProject };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const retrieveMyJoinProject = async (userIdSender, requestType, joinProjectId) => {
	try {
		const joinProject = await JoinProject.findOne({ joinProjectId, userIdSender, requestType }).select("-_id -__v");

		const capitalizedRequestType = requestType.charAt(0).toUpperCase() + requestType.slice(1);

		if (!joinProject) {
			return { status: "error", message: `${capitalizedRequestType} not found.` };
		}

		logger.info(
			`${capitalizedRequestType} retrieved successfully. Project ID: ${joinProject.projectId} - Sender User ID: ${joinProject.userIdSender} - Receiver User ID: ${
				joinProject.userIdReceiver || "N/A"
			} - ${capitalizedRequestType} status: ${joinProject.status}`
		);
		return { status: "success", message: `${capitalizedRequestType} retrieved successfully.`, joinProject };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const retrieveJoinProject = async (requestType, joinProjectId) => {
	try {
		const joinProject = await JoinProject.findOne({ joinProjectId, requestType }).select("-_id -__v");

		const capitalizedRequestType = requestType.charAt(0).toUpperCase() + requestType.slice(1);

		if (!joinProject) {
			return { status: "error", message: `${capitalizedRequestType} not found.` };
		}

		logger.info(
			`${capitalizedRequestType} retrieved successfully. Project ID: ${joinProject.projectId} - Sender User ID: ${joinProject.userIdSender} - Receiver User ID: ${
				joinProject.userIdReceiver || "N/A"
			} - ${capitalizedRequestType} status: ${joinProject.status}`
		);
		return { status: "success", message: `${capitalizedRequestType} retrieved successfully.`, joinProject };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

module.exports = {
	createJoinProject,
	updateJoinProject,
	updateStatusJoinProject,
	removeJoinProject,
	retrieveMyJoinProjects,
	retrieveMyJoinProject,
	retrieveJoinProject,
};
