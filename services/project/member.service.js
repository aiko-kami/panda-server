const { Project } = require("../../models");
const { logger, encryptTools } = require("../../utils");

/**
 * Add or remove a member from a project.
 * @param {string} projectId - The ID of the project.
 * @param {string} userIdUpdated - The ID of the member to update or remove.
 * @param {string} action - The action to perform ("update" or "remove").
 * @returns {Object} - The result of the update operation.
 */
const updateMemberFromProject = async (projectId, userIdUpdater, userIdUpdated, action, talent) => {
	try {
		const objectIdUserIdUpdater = encryptTools.convertIdToObjectId(userIdUpdater);
		if (objectIdUserIdUpdater.status == "error") {
			return { status: "error", message: objectIdUserIdUpdater.message };
		}
		const objectIdUserIdUpdated = encryptTools.convertIdToObjectId(userIdUpdated);
		if (objectIdUserIdUpdated.status == "error") {
			return { status: "error", message: objectIdUserIdUpdated.message };
		}
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		if (objectIdUserIdUpdater.equals(objectIdUserIdUpdated)) {
			return { status: "error", message: "You cannot add or remove yourself as a project member." };
		}

		const project = await Project.findOne({ _id: objectIdProjectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		const existingMemberIndex = project.members.findIndex((member) => member.user.toString() === objectIdUserIdUpdated.toString());

		if (action === "add") {
			if (existingMemberIndex !== -1) {
				return { status: "error", message: "Member already present in the project." };
			}

			// Add a new member to the project
			const newMember = {
				user: objectIdUserIdUpdated,
				talent: talent,
				role: "member",
			};

			project.members.push(newMember);
			await project.save();

			logger.info(`Member added to the project successfully. Project ID: ${projectId} - Member ID: ${userIdUpdated}`);
			return { status: "success", message: "Member added to the project successfully." };
		}

		if (action === "remove") {
			if (existingMemberIndex === -1) {
				return { status: "error", message: "Member not found in the project." };
			}

			// If member is the only owner of the project, cannot be removed from the project
			const isOwner = project.members[existingMemberIndex].role === "owner";
			// Count the number of owners in the project
			if (isOwner) {
				return {
					status: "error",
					message: "There is no other project owner. The sole project owner cannot be removed from the project.",
				};
			}

			// Remove member from the list
			project.members.splice(existingMemberIndex, 1);

			// Save the updated project
			await project.save();

			logger.info(`Member removed from the project successfully. Project ID: ${projectId} - Member user ID: ${userIdUpdated}`);
			return { status: "success", message: "Member removed from the project successfully." };
		} else {
			throw new Error("Invalid action specified.");
		}
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const updateMemberRole = async (projectId, memberId, newRole) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		const objectIdMemberId = encryptTools.convertIdToObjectId(memberId);
		if (objectIdMemberId.status == "error") {
			return { status: "error", message: objectIdMemberId.message };
		}

		const project = await Project.findOne({ _id: objectIdProjectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		const existingMemberIndex = project.members.findIndex((member) => member.user.toString() === objectIdMemberId.toString());

		if (existingMemberIndex === -1) {
			return { status: "error", message: "Member not found in the project." };
		}

		const formerRole = project.members[existingMemberIndex].role;

		// If member is the only owner of the project, cannot be updated to another role
		const isOnlyOwner = formerRole === "owner" && project.members.filter((m) => m.role === "owner").length === 1;

		if (newRole !== "owner" && isOnlyOwner) {
			return {
				status: "error",
				message: "There is no other project owner. The sole project owner cannot be updated to another role.",
			};
		}

		// Update the member's role
		project.members[existingMemberIndex].role = newRole;

		// Save the updated project
		await project.save();

		logger.info(`Member's role updated successfully. Project ID: ${projectId} - Member user ID: ${memberId} - Former role: ${formerRole} - New role: ${newRole}`);
		return { status: "success", message: "Member's role updated successfully." };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const updateMemberstartDate = async (projectId, memberId, newStartDate) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		const objectIdMemberId = encryptTools.convertIdToObjectId(memberId);
		if (objectIdMemberId.status == "error") {
			return { status: "error", message: objectIdMemberId.message };
		}

		const project = await Project.findOne({ _id: objectIdProjectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		const existingMemberIndex = project.members.findIndex((member) => member.user.toString() === objectIdMemberId.toString());

		if (existingMemberIndex === -1) {
			return { status: "error", message: "Member not found in the project." };
		}

		const formerStartDate = project.members[existingMemberIndex].startDate || "No start date defined";

		let dateObj = new Date(newStartDate);

		// Update the member's start date
		project.members[existingMemberIndex].startDate = dateObj;

		// Save the updated project
		await project.save();

		logger.info(`Member's start date updated successfully. Project ID: ${projectId} - Member user ID: ${memberId} - Former start date: ${formerStartDate} - New start date: ${dateObj}`);
		return { status: "success", message: "Member's start date updated successfully." };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const removeMemberstartDate = async (projectId, memberId) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		const objectIdMemberId = encryptTools.convertIdToObjectId(memberId);
		if (objectIdMemberId.status == "error") {
			return { status: "error", message: objectIdMemberId.message };
		}

		const project = await Project.findOne({ _id: objectIdProjectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		const existingMemberIndex = project.members.findIndex((member) => member.user.toString() === objectIdMemberId.toString());

		if (existingMemberIndex === -1) {
			return { status: "error", message: "Member not found in the project." };
		}

		const formerStartDate = project.members[existingMemberIndex].startDate || "No start date defined";

		// Update the member's start date
		project.members[existingMemberIndex].startDate = null;

		// Save the updated project
		await project.save();

		logger.info(`Member's start date updated successfully. Project ID: ${projectId} - Member user ID: ${memberId} - Former start date: ${formerStartDate} - New start date: NULL`);
		return { status: "success", message: "Member's start date updated successfully." };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const updateMemberTalent = async (projectId, memberId, newTalent) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		const objectIdMemberId = encryptTools.convertIdToObjectId(memberId);
		if (objectIdMemberId.status == "error") {
			return { status: "error", message: objectIdMemberId.message };
		}

		const project = await Project.findOne({ _id: objectIdProjectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		const existingMemberIndex = project.members.findIndex((member) => member.user.toString() === objectIdMemberId.toString());

		if (existingMemberIndex === -1) {
			return { status: "error", message: "Member not found in the project." };
		}

		const formerTalent = project.members[existingMemberIndex].talent || "No talent defined";

		// Update the member's talent
		project.members[existingMemberIndex].talent = newTalent;

		// Save the updated project
		await project.save();

		logger.info(`Member's talent updated successfully. Project ID: ${projectId} - Member user ID: ${memberId} - Former talent: ${formerTalent} - New talent: ${newTalent}`);
		return { status: "success", message: "Member's talent updated successfully." };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

module.exports = {
	updateMemberFromProject,
	updateMemberRole,
	updateMemberstartDate,
	removeMemberstartDate,
	updateMemberTalent,
};
