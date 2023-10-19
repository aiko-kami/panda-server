const { Project, JoinProject } = require("../../models");
const { logger } = require("../../utils");

/**
 * Add or remove a member from a project.
 * @param {string} projectId - The ID of the project.
 * @param {string} userIdUpdated - The ID of the member to update or remove.
 * @param {string} action - The action to perform ("update" or "remove").
 * @returns {Object} - The result of the update operation.
 */

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
				role: joinProjectData.role,
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
				role: joinProjectData.role,
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
			role: createdRequest.role,
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
		//Check if request does not already exist for the user and this project
		const existingRequest = await JoinProject.findOne({ joinProjectId: joinProjectData.joinProjectId });

		if (!existingRequest) {
			return { status: "error", message: "Join project not found." };
		}

		const project = await Project.findOne({ projectId: joinProjectData.projectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		let updatedRequest;

		if (joinProjectData.requestType === "join project request") {
			// Check if the sender is already a member of the project
			const existingMemberIndex = project.members.findIndex((member) => member.userId === joinProjectData.userIdSender);
			if (existingMemberIndex !== -1) {
				return { status: "error", message: "User is already a member of the project." };
			}

			// Update join project request
			existingRequest.projectId = joinProjectData.projectId;
			existingRequest.userIdSender = joinProjectData.userIdSender;
			existingRequest.requestType = joinProjectData.requestType;
			existingRequest.role = joinProjectData.role;
			existingRequest.message = joinProjectData.message;
			existingRequest.updatedBy = joinProjectData.userIdSender;
			existingRequest.status = joinProjectData.joinProjectStatus;

			// Save the updated join project request
			const updatedRequest = await existingRequest.save();
		} else if (joinProjectData.requestType === "join project invitation") {
			// Check if the sender is already a member of the project
			const existingMemberIndex = project.members.findIndex((member) => member.userId === joinProjectData.userIdReceiver);
			if (existingMemberIndex !== -1) {
				return { status: "error", message: "User is already a member of the project." };
			}

			// Update join project request
			existingRequest.projectId = joinProjectData.projectId;
			existingRequest.userIdSender = joinProjectData.userIdSender;
			existingRequest.userIdReceiver = joinProjectData.userIdReceiver;
			existingRequest.requestType = joinProjectData.requestType;
			existingRequest.role = joinProjectData.role;
			existingRequest.message = joinProjectData.message;
			existingRequest.updatedBy = joinProjectData.userIdSender;
			existingRequest.status = joinProjectData.joinProjectStatus;

			// Save the updated join project request
			const updatedRequest = await existingRequest.save();
		}

		const joinProject = {
			projectId: updatedRequest.projectId,
			userIdSender: updatedRequest.userIdSender,
			userIdReceiver: updatedRequest.userIdReceiver,
			requestType: updatedRequest.requestType,
			role: updatedRequest.role,
			message: updatedRequest.message,
			updatedBy: updatedRequest.updatedBy,
			status: updatedRequest.status,
			joinProjectId: updatedRequest.joinProjectId,
			createdAt: updatedRequest.createdAt,
			updatedAt: updatedRequest.updatedAt,
		};

		logger.info(
			`${joinProjectData.requestType} updated successfully. Project ID: ${joinProjectData.projectId} - Sender User ID: ${joinProjectData.userIdSender} - Receiver User ID: ${
				userIdReceiver || "N/A"
			} - ${joinProjectData.requestType} status: ${joinProjectData.joinProjectStatus}`
		);
		return { status: "success", message: `${joinProjectData.requestType} updated successfully.`, joinProject };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const removeJoinProject = async (userIdSender, joinProjectId, requestType) => {
	try {
		//Check if request exists for the user and this project
		const existingRequest = await JoinProject.findOne({ joinProjectId, requestType });

		if (!existingRequest) {
			return { status: "error", message: "Join project not found." };
		}

		if (existingRequest.userIdSender !== userIdSender) {
			return { status: "error", message: "Only the sender of the join project can remove it." };
		}

		if (existingRequest.status !== "draft") {
			return { status: "error", message: "You can only remove draft join project." };
		}

		// Remove the join project request from the database
		await existingRequest.deleteOne();

		logger.info(
			`${existingRequest.requestType} removed successfully. Project ID: ${existingRequest.projectId} - Sender User ID: ${existingRequest.userIdSender} - Receiver User ID: ${
				existingRequest.userIdReceiver || "N/A"
			}`
		);
		return { status: "success", message: `${existingRequest.requestType} removed successfully.`, existingRequest };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const retrieveJoinProjects = async (joinProjectData) => {
	try {
		//Check if request does not already exist for the user and this project
		const existingRequest = await JoinProject.findOne({ joinProjectId: joinProjectData.joinProjectId });

		if (!existingRequest) {
			return { status: "error", message: "Join project not found." };
		}

		const project = await Project.findOne({ projectId: joinProjectData.projectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		let updatedRequest;

		if (joinProjectData.requestType === "join project request") {
			// Check if the sender is already a member of the project
			const existingMemberIndex = project.members.findIndex((member) => member.userId === joinProjectData.userIdSender);
			if (existingMemberIndex !== -1) {
				return { status: "error", message: "User is already a member of the project." };
			}

			// Update join project request
			existingRequest.projectId = joinProjectData.projectId;
			existingRequest.userIdSender = joinProjectData.userIdSender;
			existingRequest.requestType = joinProjectData.requestType;
			existingRequest.role = joinProjectData.role;
			existingRequest.message = joinProjectData.message;
			existingRequest.updatedBy = joinProjectData.userIdSender;
			existingRequest.status = joinProjectData.joinProjectStatus;

			// Save the updated join project request
			const updatedRequest = await existingRequest.save();
		} else if (joinProjectData.requestType === "join project invitation") {
			// Check if the sender is already a member of the project
			const existingMemberIndex = project.members.findIndex((member) => member.userId === joinProjectData.userIdReceiver);
			if (existingMemberIndex !== -1) {
				return { status: "error", message: "User is already a member of the project." };
			}

			// Update join project request
			existingRequest.projectId = joinProjectData.projectId;
			existingRequest.userIdSender = joinProjectData.userIdSender;
			existingRequest.userIdReceiver = joinProjectData.userIdReceiver;
			existingRequest.requestType = joinProjectData.requestType;
			existingRequest.role = joinProjectData.role;
			existingRequest.message = joinProjectData.message;
			existingRequest.updatedBy = joinProjectData.userIdSender;
			existingRequest.status = joinProjectData.joinProjectStatus;

			// Save the updated join project request
			const updatedRequest = await existingRequest.save();
		}

		const joinProject = {
			projectId: updatedRequest.projectId,
			userIdSender: updatedRequest.userIdSender,
			userIdReceiver: updatedRequest.userIdReceiver,
			requestType: updatedRequest.requestType,
			role: updatedRequest.role,
			message: updatedRequest.message,
			updatedBy: updatedRequest.updatedBy,
			status: updatedRequest.status,
			joinProjectId: updatedRequest.joinProjectId,
			createdAt: updatedRequest.createdAt,
			updatedAt: updatedRequest.updatedAt,
		};

		logger.info(
			`${joinProjectData.requestType} updated successfully. Project ID: ${joinProjectData.projectId} - Sender User ID: ${joinProjectData.userIdSender} - Receiver User ID: ${
				userIdReceiver || "N/A"
			} - ${joinProjectData.requestType} status: ${joinProjectData.joinProjectStatus}`
		);
		return { status: "success", message: `${joinProjectData.requestType} updated successfully.`, joinProject };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const retrieveJoinProject = async (joinProjectData) => {
	try {
		//Check if request does not already exist for the user and this project
		const existingRequest = await JoinProject.findOne({ joinProjectId: joinProjectData.joinProjectId });

		if (!existingRequest) {
			return { status: "error", message: "Join project not found." };
		}

		const project = await Project.findOne({ projectId: joinProjectData.projectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		let updatedRequest;

		if (joinProjectData.requestType === "join project request") {
			// Check if the sender is already a member of the project
			const existingMemberIndex = project.members.findIndex((member) => member.userId === joinProjectData.userIdSender);
			if (existingMemberIndex !== -1) {
				return { status: "error", message: "User is already a member of the project." };
			}

			// Update join project request
			existingRequest.projectId = joinProjectData.projectId;
			existingRequest.userIdSender = joinProjectData.userIdSender;
			existingRequest.requestType = joinProjectData.requestType;
			existingRequest.role = joinProjectData.role;
			existingRequest.message = joinProjectData.message;
			existingRequest.updatedBy = joinProjectData.userIdSender;
			existingRequest.status = joinProjectData.joinProjectStatus;

			// Save the updated join project request
			const updatedRequest = await existingRequest.save();
		} else if (joinProjectData.requestType === "join project invitation") {
			// Check if the sender is already a member of the project
			const existingMemberIndex = project.members.findIndex((member) => member.userId === joinProjectData.userIdReceiver);
			if (existingMemberIndex !== -1) {
				return { status: "error", message: "User is already a member of the project." };
			}

			// Update join project request
			existingRequest.projectId = joinProjectData.projectId;
			existingRequest.userIdSender = joinProjectData.userIdSender;
			existingRequest.userIdReceiver = joinProjectData.userIdReceiver;
			existingRequest.requestType = joinProjectData.requestType;
			existingRequest.role = joinProjectData.role;
			existingRequest.message = joinProjectData.message;
			existingRequest.updatedBy = joinProjectData.userIdSender;
			existingRequest.status = joinProjectData.joinProjectStatus;

			// Save the updated join project request
			const updatedRequest = await existingRequest.save();
		}

		const joinProject = {
			projectId: updatedRequest.projectId,
			userIdSender: updatedRequest.userIdSender,
			userIdReceiver: updatedRequest.userIdReceiver,
			requestType: updatedRequest.requestType,
			role: updatedRequest.role,
			message: updatedRequest.message,
			updatedBy: updatedRequest.updatedBy,
			status: updatedRequest.status,
			joinProjectId: updatedRequest.joinProjectId,
			createdAt: updatedRequest.createdAt,
			updatedAt: updatedRequest.updatedAt,
		};

		logger.info(
			`${joinProjectData.requestType} updated successfully. Project ID: ${joinProjectData.projectId} - Sender User ID: ${joinProjectData.userIdSender} - Receiver User ID: ${
				userIdReceiver || "N/A"
			} - ${joinProjectData.requestType} status: ${joinProjectData.joinProjectStatus}`
		);
		return { status: "success", message: `${joinProjectData.requestType} updated successfully.`, joinProject };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

module.exports = {
	createJoinProject,
	updateJoinProject,
	removeJoinProject,
	retrieveJoinProjects,
	retrieveJoinProject,
};
