const { Project, JoinProject } = require("../../models");
const { logger } = require("../../utils");

/**
 * Add or remove a member from a project.
 * @param {string} projectId - The ID of the project.
 * @param {string} userIdUpdated - The ID of the member to update or remove.
 * @param {string} action - The action to perform ("update" or "remove").
 * @returns {Object} - The result of the update operation.
 */
const updateMemberFromProject = async (projectId, userIdUpdated, action) => {
	try {
		const project = await Project.findOne({ projectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		const existingMemberIndex = project.members.findIndex((member) => member.userId === userIdUpdated);

		if (action === "add") {
			if (existingMemberIndex !== -1) {
				return { status: "error", message: "Member already present in the project." };
			}

			// Complete actions to add a new member to the project
			//....
			// Set rights to the new user for the project. Maybe to do it in the controller?

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
			const ownerCount = project.members.filter((member) => member.role === "owner").length;
			if (isOwner && ownerCount === 1) {
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
		const project = await Project.findOne({ projectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		const existingMemberIndex = project.members.findIndex((member) => member.userId === memberId);

		if (existingMemberIndex === -1) {
			return { status: "error", message: "Member not found in the project." };
		}

		const formerRole = project.members[existingMemberIndex].role;

		if (formerRole === newRole) {
			return { status: "error", message: "New role must be different from the former one." };
		}

		// If member is the only owner of the project, cannot be updated to another role
		const isOwner = formerRole === "owner";
		// Count the number of owners in the project
		const ownerCount = project.members.filter((member) => member.role === "owner").length;
		if (isOwner && ownerCount === 1) {
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
		const project = await Project.findOne({ projectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		const existingMemberIndex = project.members.findIndex((member) => member.userId === memberId);

		if (existingMemberIndex === -1) {
			return { status: "error", message: "Member not found in the project." };
		}

		const formerStartDate = project.members[existingMemberIndex].startDate || "No start date defined";

		let dateObj = new Date(newStartDate);

		if (formerStartDate.toString() === dateObj.toString()) {
			return { status: "error", message: "New start date must be different from the former one." };
		}

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

const updateMemberTalent = async (projectId, memberId, newTalent) => {
	try {
		const project = await Project.findOne({ projectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		const existingMemberIndex = project.members.findIndex((member) => member.userId === memberId);

		if (existingMemberIndex === -1) {
			return { status: "error", message: "Member not found in the project." };
		}

		const formerTalent = project.members[existingMemberIndex].talent || "No talent defined";

		if (formerTalent === newTalent) {
			return { status: "error", message: "New talent must be different from the former one." };
		}

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
	updateMemberTalent,
};
