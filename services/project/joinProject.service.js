const { Project, JoinProject } = require("../../models");
const { logger, encryptTools } = require("../../utils");

const createJoinProject = async (joinProjectData) => {
	try {
		const objectIdUserIdSender = encryptTools.convertIdToObjectId(joinProjectData.userIdSender);
		if (objectIdUserIdSender.status == "error") {
			return { status: "error", message: objectIdUserIdSender.message };
		}
		const objectIdProjectId = encryptTools.convertIdToObjectId(joinProjectData.projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		const project = await Project.findOne({ _id: objectIdProjectId });
		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		let createdRequest;

		if (joinProjectData.requestType === "join project request") {
			// Check if the sender is already a member of the project
			const existingMemberIndex = project.members.findIndex((member) => member.user.toString() === objectIdUserIdSender.toString());
			if (existingMemberIndex !== -1) {
				return { status: "error", message: "User is already a member of the project." };
			}

			//Check if request does not already exist for the user and this project
			const existingRequest = await JoinProject.findOne({
				project: objectIdProjectId,
				sender: objectIdUserIdSender,
				requestType: joinProjectData.requestType,
			});

			if (existingRequest) {
				return { status: "error", message: "A join request already exists for this user and project." };
			}

			// Create a new join project request
			const newJoinProject = new JoinProject({
				project: objectIdProjectId,
				sender: objectIdUserIdSender,
				requestType: joinProjectData.requestType,
				talent: joinProjectData.talent,
				message: joinProjectData.message,
				updatedBy: objectIdUserIdSender,
				status: joinProjectData.joinProjectStatus,
			});

			// Save the new join project request
			created = await newJoinProject.save();

			//Add encrypted ID
			const encryptedId = encryptTools.convertObjectIdToId(created._id.toString());
			createdRequest = await JoinProject.findOneAndUpdate({ _id: created._id }, { joinProjectId: encryptedId }, { new: true }).select("-_id -__v");
		} else if (joinProjectData.requestType === "join project invitation") {
			const objectIduserIdReceiver = encryptTools.convertIdToObjectId(joinProjectData.userIdReceiver);
			if (objectIduserIdReceiver.status == "error") {
				return { status: "error", message: objectIduserIdReceiver.message };
			}

			// Check if the sender is already a member of the project
			const existingMemberIndex = project.members.findIndex((member) => member.user.toString() === objectIduserIdReceiver.toString());
			if (existingMemberIndex !== -1) {
				return { status: "error", message: "User is already a member of the project." };
			}

			//Check if invitation does not already exist for the user and this project
			const existingRequest = await JoinProject.findOne({
				project: objectIdProjectId,
				receiver: objectIduserIdReceiver,
				requestType: joinProjectData.requestType,
			});

			if (existingRequest) {
				return { status: "error", message: "A join invitation already exists for this user and project." };
			}

			// Create a new join project invitation
			const newJoinProject = new JoinProject({
				project: objectIdProjectId,
				sender: objectIdUserIdSender,
				receiver: objectIduserIdReceiver,
				requestType: joinProjectData.requestType,
				talent: joinProjectData.talent,
				message: joinProjectData.message,
				updatedBy: objectIdUserIdSender,
				status: joinProjectData.joinProjectStatus,
			});

			// Save the new join project request
			created = await newJoinProject.save();

			//Add encrypted ID
			const encryptedId = encryptTools.convertObjectIdToId(created._id.toString());
			createdRequest = await JoinProject.findOneAndUpdate({ _id: created._id }, { joinProjectId: encryptedId }, { new: true }).select("-_id -__v");
		}

		let createdReceiver;
		if (createdRequest.receiver) {
			createdReceiver = encryptTools.convertObjectIdToId(createdRequest.receiver.toString());
		}

		const joinProject = {
			projectId: encryptTools.convertObjectIdToId(createdRequest.project.toString()),
			userIdSender: encryptTools.convertObjectIdToId(createdRequest.sender.toString()),
			userIdReceiver: createdReceiver,
			requestType: createdRequest.requestType,
			talent: createdRequest.talent,
			message: createdRequest.message,
			updatedBy: encryptTools.convertObjectIdToId(createdRequest.updatedBy.toString()),
			status: createdRequest.status,
			joinProjectId: createdRequest.joinProjectId,
			createdAt: createdRequest.createdAt,
			updatedAt: createdRequest.updatedAt,
		};

		const capitalizedRequestType = joinProjectData.requestType.charAt(0).toUpperCase() + joinProjectData.requestType.slice(1);
		logger.info(
			`${capitalizedRequestType} created successfully. JoinProject ID: ${joinProject.joinProjectId} - Project ID: ${joinProject.projectId} - Sender User ID: ${
				joinProject.userIdSender
			} - Receiver User ID: ${joinProject.userIdReceiver || "N/A"} - ${capitalizedRequestType} status: ${joinProject.status}`
		);
		return { status: "success", message: `${capitalizedRequestType} created successfully.`, joinProject };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const updateJoinProject = async (joinProjectData) => {
	try {
		const objectIdJoinProjectId = encryptTools.convertIdToObjectId(joinProjectData.joinProjectId);
		if (objectIdJoinProjectId.status == "error") {
			return { status: "error", message: objectIdJoinProjectId.message };
		}
		const objectIdUserIdSender = encryptTools.convertIdToObjectId(joinProjectData.userIdSender);
		if (objectIdUserIdSender.status == "error") {
			return { status: "error", message: objectIdUserIdSender.message };
		}
		const objectIdProjectId = encryptTools.convertIdToObjectId(joinProjectData.projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		//Check if request exists for the user and this project
		const existingJoinProject = await JoinProject.findOne({ _id: objectIdJoinProjectId });

		const capitalizedRequestType = joinProjectData.requestType.charAt(0).toUpperCase() + joinProjectData.requestType.slice(1);

		if (!existingJoinProject) {
			return { status: "error", message: `${capitalizedRequestType} not found.` };
		}

		if (existingJoinProject.sender.toString() !== objectIdUserIdSender.toString()) {
			return { status: "error", message: `Only the sender of the ${joinProjectData.requestType} can update it.` };
		}

		if (existingJoinProject.status !== "draft") {
			return { status: "error", message: `You can only update draft ${joinProjectData.requestType}.` };
		}

		const project = await Project.findOne({ _id: objectIdProjectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		let updatedJoinProject;

		if (joinProjectData.requestType === "join project request") {
			// Check if the sender is already a member of the project
			const existingMemberIndex = project.members.findIndex((member) => member.user.toString() === objectIdUserIdSender.toString());
			if (existingMemberIndex !== -1) {
				return { status: "error", message: "User is already a member of the project." };
			}

			// Update join project request
			existingJoinProject.project = objectIdProjectId;
			existingJoinProject.sender = objectIdUserIdSender;
			existingJoinProject.requestType = joinProjectData.requestType;
			existingJoinProject.talent = joinProjectData.talent;
			existingJoinProject.message = joinProjectData.message;
			existingJoinProject.updatedBy = objectIdUserIdSender;
			existingJoinProject.status = joinProjectData.joinProjectStatus;

			// Save the updated join project request
			updatedJoinProject = await existingJoinProject.save();
		} else if (joinProjectData.requestType === "join project invitation") {
			const objectIduserIdReceiver = encryptTools.convertIdToObjectId(joinProjectData.userIdReceiver);
			if (objectIduserIdReceiver.status == "error") {
				return { status: "error", message: objectIduserIdReceiver.message };
			}

			// Check if the sender is already a member of the project
			const existingMemberIndex = project.members.findIndex((member) => member.user.toString() === objectIduserIdReceiver.toString());
			if (existingMemberIndex !== -1) {
				return { status: "error", message: "User is already a member of the project." };
			}

			// Update join project request
			existingJoinProject.project = objectIdProjectId;
			existingJoinProject.sender = objectIdUserIdSender;
			existingJoinProject.receiver = objectIduserIdReceiver;
			existingJoinProject.requestType = joinProjectData.requestType;
			existingJoinProject.talent = joinProjectData.talent;
			existingJoinProject.message = joinProjectData.message;
			existingJoinProject.updatedBy = objectIdUserIdSender;
			existingJoinProject.status = joinProjectData.joinProjectStatus;

			// Save the updated join project
			updatedJoinProject = await existingJoinProject.save();
		}

		let createdReceiver;
		if (updatedJoinProject.receiver) {
			createdReceiver = encryptTools.convertObjectIdToId(updatedJoinProject.receiver.toString());
		}

		const joinProject = {
			projectId: encryptTools.convertObjectIdToId(updatedJoinProject.project.toString()),
			userIdSender: encryptTools.convertObjectIdToId(updatedJoinProject.sender.toString()),
			userIdReceiver: createdReceiver,
			requestType: updatedJoinProject.requestType,
			talent: updatedJoinProject.talent,
			message: updatedJoinProject.message,
			updatedBy: encryptTools.convertObjectIdToId(updatedJoinProject.updatedBy.toString()),
			status: updatedJoinProject.status,
			joinProjectId: updatedJoinProject.joinProjectId,
			createdAt: updatedJoinProject.createdAt,
			updatedAt: updatedJoinProject.updatedAt,
		};

		logger.info(
			`${capitalizedRequestType} updated successfully. JoinProject ID: ${joinProject.joinProjectId} - Project ID: ${joinProject.projectId} - Sender User ID: ${
				joinProject.userIdSender
			} - Receiver User ID: ${joinProject.userIdSender || "N/A"} - ${capitalizedRequestType} status: ${joinProject.status}`
		);
		return { status: "success", message: `${capitalizedRequestType} updated successfully.`, joinProject };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const updateStatusJoinProject = async (userIdUpdater, joinProjectId, newJoinProjectStatus, requestType) => {
	try {
		const objectIdJoinProjectId = encryptTools.convertIdToObjectId(joinProjectId);
		if (objectIdJoinProjectId.status == "error") {
			return { status: "error", message: objectIdJoinProjectId.message };
		}

		//Check if join project exists for the user and the project
		const existingJoinProject = await JoinProject.findOne({ _id: objectIdJoinProjectId });

		const capitalizedRequestType = requestType.charAt(0).toUpperCase() + requestType.slice(1);

		if (!existingJoinProject) {
			return { status: "error", message: `${capitalizedRequestType} not found.` };
		}

		const ObjectIdUserIdUpdater = encryptTools.convertIdToObjectId(userIdUpdater);
		if (ObjectIdUserIdUpdater.status == "error") {
			return { status: "error", message: ObjectIdUserIdUpdater.message };
		}

		const project = await Project.findOne({ _id: existingJoinProject.project });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		// In case of join project request, check if the sender is already a member of the project
		if (requestType === "join project request") {
			const existingMemberIndex = project.members.findIndex((member) => member.user.toString() === existingJoinProject.sender.toString());
			if (existingMemberIndex !== -1) {
				return { status: "error", message: "User is already a member of the project." };
			}
		}

		// In case of join project invitation, check if the receiver is already a member of the project
		if (requestType === "join project invitation") {
			const existingMemberIndex = project.members.findIndex((member) => member.user.toString() === existingJoinProject.receiver.toString());
			if (existingMemberIndex !== -1) {
				return { status: "error", message: "User is already a member of the project." };
			}
		}

		let updatedJoinProject;

		if (newJoinProjectStatus === "cancelled") {
			if (existingJoinProject.sender.toString() !== ObjectIdUserIdUpdater.toString()) {
				return { status: "error", message: `Only the sender of the ${requestType} can cancel it.` };
			}

			if (existingJoinProject.status !== "sent" && existingJoinProject.status !== "read") {
				return { status: "error", message: `You can only update sent ${requestType}.` };
			}

			existingJoinProject.status = newJoinProjectStatus;
			existingJoinProject.updatedBy = ObjectIdUserIdUpdater;
			updatedJoinProject = await existingJoinProject.save();
		} else if (newJoinProjectStatus === "accepted") {
			if (requestType === "join project request") {
				if (existingJoinProject.status !== "sent" && existingJoinProject.status !== "read") {
					return { status: "error", message: `You can only update sent ${requestType}.` };
				}

				existingJoinProject.status = newJoinProjectStatus;
				existingJoinProject.updatedBy = ObjectIdUserIdUpdater;
				updatedJoinProject = await existingJoinProject.save();
			} else if (requestType === "join project invitation") {
				if (existingJoinProject.receiver.toString() !== ObjectIdUserIdUpdater.toString()) {
					return { status: "error", message: `Only the receiver of the ${requestType} can accept or refuse it.` };
				}

				if (existingJoinProject.status !== "sent" && existingJoinProject.status !== "read") {
					return { status: "error", message: `You can only update sent ${requestType}.` };
				}

				existingJoinProject.status = newJoinProjectStatus;
				existingJoinProject.updatedBy = ObjectIdUserIdUpdater;
				updatedJoinProject = await existingJoinProject.save();
			}
		} else if (newJoinProjectStatus === "refused") {
			if (existingJoinProject.receiver.toString() !== ObjectIdUserIdUpdater.toString()) {
				return { status: "error", message: `Only the receiver of the ${requestType} can accept or refuse it.` };
			}

			if (existingJoinProject.status !== "sent" && existingJoinProject.status !== "read") {
				return { status: "error", message: `You can only update sent ${requestType}.` };
			}

			existingJoinProject.status = newJoinProjectStatus;
			existingJoinProject.updatedBy = ObjectIdUserIdUpdater;
			updatedJoinProject = await existingJoinProject.save();
		}

		let createdReceiver;

		if (updatedJoinProject.receiver) {
			createdReceiver = encryptTools.convertObjectIdToId(updatedJoinProject.receiver.toString());
		}

		const joinProject = {
			projectId: encryptTools.convertObjectIdToId(updatedJoinProject.project.toString()),
			userIdSender: encryptTools.convertObjectIdToId(updatedJoinProject.sender.toString()),
			userIdReceiver: createdReceiver,
			requestType: updatedJoinProject.requestType,
			talent: updatedJoinProject.talent,
			message: updatedJoinProject.message,
			updatedBy: encryptTools.convertObjectIdToId(updatedJoinProject.updatedBy.toString()),
			status: updatedJoinProject.status,
			joinProjectId: updatedJoinProject.joinProjectId,
			createdAt: updatedJoinProject.createdAt,
			updatedAt: updatedJoinProject.updatedAt,
		};

		logger.info(
			`Status of ${capitalizedRequestType} updated successfully. JoinProject ID: ${joinProject.joinProjectId} - Project ID: ${joinProject.projectId} - Sender User ID: ${
				joinProject.userIdSender
			} - Receiver User ID: ${joinProject.userIdReceiver || "N/A"} - ${capitalizedRequestType} new status: ${joinProject.status}`
		);
		return { status: "success", message: `Status of ${capitalizedRequestType} updated successfully.`, joinProject };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const removeJoinProject = async (userIdSender, joinProjectId, requestType) => {
	try {
		const objectIdJoinProjectId = encryptTools.convertIdToObjectId(joinProjectId);
		if (objectIdJoinProjectId.status == "error") {
			return { status: "error", message: objectIdJoinProjectId.message };
		}
		const objectIdUserIdSender = encryptTools.convertIdToObjectId(userIdSender);
		if (objectIdUserIdSender.status == "error") {
			return { status: "error", message: objectIdUserIdSender.message };
		}

		//Check if request exists for the user and this project
		const existingJoinProject = await JoinProject.findOne({ _id: objectIdJoinProjectId, requestType });

		const capitalizedRequestType = requestType.charAt(0).toUpperCase() + requestType.slice(1);

		if (!existingJoinProject) {
			return { status: "error", message: `${capitalizedRequestType} not found.` };
		}

		if (existingJoinProject.sender.toString() !== objectIdUserIdSender.toString()) {
			return { status: "error", message: `Only the sender of the ${requestType} can remove it.` };
		}

		if (existingJoinProject.status !== "draft") {
			return { status: "error", message: `You can only remove draft ${requestType}.` };
		}

		// Remove the join project request from the database
		await existingJoinProject.deleteOne();

		let retrievedReceiver;
		if (existingJoinProject.receiver) {
			retrievedReceiver = encryptTools.convertObjectIdToId(existingJoinProject.receiver.toString());
		}

		const joinProjectRemoved = {
			projectId: encryptTools.convertObjectIdToId(existingJoinProject.project.toString()),
			userIdSender: encryptTools.convertObjectIdToId(existingJoinProject.sender.toString()),
			userIdReceiver: retrievedReceiver,
			requestType: existingJoinProject.requestType,
			talent: existingJoinProject.talent,
			message: existingJoinProject.message,
			updatedBy: encryptTools.convertObjectIdToId(existingJoinProject.updatedBy.toString()),
			status: existingJoinProject.status,
			joinProjectId: existingJoinProject.joinProjectId,
			createdAt: existingJoinProject.createdAt,
			updatedAt: existingJoinProject.updatedAt,
		};

		logger.info(
			`${capitalizedRequestType} removed successfully. JoinProject ID: ${joinProjectRemoved.joinProjectId} - Project ID: ${joinProjectRemoved.projectId} - Sender User ID: ${
				joinProjectRemoved.userIdSender
			} - Receiver User ID: ${joinProjectRemoved.userIdReceiver || "N/A"}`
		);
		return { status: "success", message: `${capitalizedRequestType} removed successfully.`, joinProjectRemoved };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const retrieveMyJoinProjects = async (userIdSender, requestType, statusType) => {
	try {
		const objectIdUserIdSender = encryptTools.convertIdToObjectId(userIdSender);
		if (objectIdUserIdSender.status == "error") {
			return { status: "error", message: objectIdUserIdSender.message };
		}

		let query;
		if (statusType === "all") {
			query = { sender: objectIdUserIdSender, requestType };
		} else {
			query = { sender: objectIdUserIdSender, requestType, status: statusType };
		}

		const existingJoinProjects = await JoinProject.find(query).select("-_id -__v");

		const joinProjects = existingJoinProjects.map((jp) => {
			const container = {};
			let retrievedReceiver;

			if (jp.receiver) {
				retrievedReceiver = encryptTools.convertObjectIdToId(jp.receiver.toString());
			}
			container.projectId = encryptTools.convertObjectIdToId(jp.project.toString());
			container.userIdSender = encryptTools.convertObjectIdToId(jp.sender.toString());
			container.userIdReceiver = retrievedReceiver;
			container.requestType = jp.requestType;
			container.talent = jp.talent;
			container.message = jp.message;
			container.updatedBy = encryptTools.convertObjectIdToId(jp.updatedBy.toString());
			container.status = jp.status;
			container.joinProjectId = jp.joinProjectId;
			container.createdAt = jp.createdAt;
			container.updatedAt = jp.updatedAt;

			return container;
		});

		const nbJoinProject = joinProjects.length;

		if (!joinProjects || nbJoinProject === 0) {
			logger.info(`No ${requestType} found.`);
			return { status: "success", message: `No ${requestType} found.`, joinProjects };
		} else if (nbJoinProject === 1) {
			logger.info(`${nbJoinProject} ${requestType} retrieved successfully.`);
			return { status: "success", message: `${nbJoinProject} ${requestType} retrieved successfully.`, joinProjects };
		} else logger.info(`${nbJoinProject} ${requestType}s retrieved successfully.`);
		return { status: "success", message: `${nbJoinProject} ${requestType}s retrieved successfully.`, joinProjects };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const retrieveMyJoinProject = async (userIdSender, requestType, joinProjectId) => {
	try {
		const objectIdJoinProjectId = encryptTools.convertIdToObjectId(joinProjectId);
		if (objectIdJoinProjectId.status == "error") {
			return { status: "error", message: objectIdJoinProjectId.message };
		}
		const objectIdUserIdSender = encryptTools.convertIdToObjectId(userIdSender);
		if (objectIdUserIdSender.status == "error") {
			return { status: "error", message: objectIdUserIdSender.message };
		}

		const existingJoinProject = await JoinProject.findOne({ _id: objectIdJoinProjectId, sender: objectIdUserIdSender, requestType }).select("-_id -__v");

		const capitalizedRequestType = requestType.charAt(0).toUpperCase() + requestType.slice(1);

		if (!existingJoinProject) {
			return { status: "error", message: `${capitalizedRequestType} not found.` };
		}

		let retrievedReceiver;

		if (existingJoinProject.receiver) {
			retrievedReceiver = encryptTools.convertObjectIdToId(existingJoinProject.receiver.toString());
		}

		const joinProject = {
			projectId: encryptTools.convertObjectIdToId(existingJoinProject.project.toString()),
			userIdSender: encryptTools.convertObjectIdToId(existingJoinProject.sender.toString()),
			userIdReceiver: retrievedReceiver,
			requestType: existingJoinProject.requestType,
			talent: existingJoinProject.talent,
			message: existingJoinProject.message,
			updatedBy: encryptTools.convertObjectIdToId(existingJoinProject.updatedBy.toString()),
			status: existingJoinProject.status,
			joinProjectId: existingJoinProject.joinProjectId,
			createdAt: existingJoinProject.createdAt,
			updatedAt: existingJoinProject.updatedAt,
		};

		logger.info(
			`${capitalizedRequestType} retrieved successfully. JoinProject ID: ${joinProject.joinProjectId} - Project ID: ${joinProject.projectId} - Sender User ID: ${
				joinProject.userIdSender
			} - Receiver User ID: ${joinProject.userIdReceiver || "N/A"} - ${capitalizedRequestType} status: ${joinProject.status}`
		);
		return { status: "success", message: `${capitalizedRequestType} retrieved successfully.`, joinProject };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const retrieveJoinProject = async (requestType, joinProjectId) => {
	try {
		const objectIdJoinProjectId = encryptTools.convertIdToObjectId(joinProjectId);
		if (objectIdJoinProjectId.status == "error") {
			return { status: "error", message: objectIdJoinProjectId.message };
		}

		const existingJoinProject = await JoinProject.findOne({ _id: objectIdJoinProjectId, requestType }).select("-_id -__v");

		const capitalizedRequestType = requestType.charAt(0).toUpperCase() + requestType.slice(1);

		if (!existingJoinProject) {
			return { status: "error", message: `${capitalizedRequestType} not found.` };
		}

		let retrievedReceiver;

		if (existingJoinProject.receiver) {
			retrievedReceiver = encryptTools.convertObjectIdToId(existingJoinProject.receiver.toString());
		}

		const joinProject = {
			projectId: encryptTools.convertObjectIdToId(existingJoinProject.project.toString()),
			userIdSender: encryptTools.convertObjectIdToId(existingJoinProject.sender.toString()),
			userIdReceiver: retrievedReceiver,
			requestType: existingJoinProject.requestType,
			talent: existingJoinProject.talent,
			message: existingJoinProject.message,
			updatedBy: encryptTools.convertObjectIdToId(existingJoinProject.updatedBy.toString()),
			status: existingJoinProject.status,
			joinProjectId: existingJoinProject.joinProjectId,
			createdAt: existingJoinProject.createdAt,
			updatedAt: existingJoinProject.updatedAt,
		};

		logger.info(
			`${capitalizedRequestType} retrieved successfully. JoinProject ID: ${joinProject.joinProjectId} - Project ID: ${joinProject.projectId} - Sender User ID: ${
				joinProject.userIdSender
			} - Receiver User ID: ${joinProject.userIdReceiver || "N/A"} - ${capitalizedRequestType} status: ${joinProject.status}`
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
