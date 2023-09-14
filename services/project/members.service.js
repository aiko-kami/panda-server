const { Project } = require("../../models");
const { logger } = require("../../utils");

/**
 * Add or remove a member from a project.
 * @param {string} projectId - The ID of the project.
 * @param {string} memberId - The ID of the member to update or remove.
 * @param {string} action - The action to perform ("update" or "remove").
 * @returns {Object} - The result of the update operation.
 */
const updateMemberFromProject = async (projectId, memberId, action) => {
	try {
		const project = await Project.findOne({ projectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		const existingMemberIndex = project.members.findIndex((member) => member.userId === memberId);

		if (existingMemberIndex === -1) {
			return { status: "error", message: "Member not found in the project." };
		}

		if (action === "add") {
			//Complete actions to add a member
			//....

			logger.info(
				`Member added to the project successfully. Project ID: ${projectId} - Member ID: ${memberId}`
			);
			return { status: "success", message: "Member added to the project successfully." };
		}

		if (action === "remove") {
			//If member is owner of the project, cannot be removed from the project
			const isOwner = project.members[existingMemberIndex].role === "owner";
			// Count the number of owners in the project
			const ownerCount = project.members.filter((member) => member.role === "owner").length;
			if (isOwner && ownerCount === 1) {
				return {
					status: "error",
					message:
						"There is no other project owner. The sole project owner cannot be removed from the project.",
				};
			}

			project.members.splice(existingMemberIndex, 1);

			// Save the updated project
			await project.save();

			logger.info(
				`Member removed from the project successfully. Project ID: ${projectId} - Member user ID: ${memberId}`
			);
			return { status: "success", message: "Member removed from the project successfully." };
		} else {
			throw new Error("Invalid action specified.");
		}
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const updateMemberRole = async (projectId, memberId, newRole) => {};
const updateMemberstartDate = async (projectId, memberId, newStartDate) => {};

module.exports = {
	updateMemberFromProject,
	updateMemberRole,
	updateMemberstartDate,
};
