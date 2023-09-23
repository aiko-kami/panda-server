const mongoose = require("mongoose");

const projectRightsSchema = new mongoose.Schema(
	{
		projectId: {
			type: String,
			ref: "Project", // Reference to the Project model
			required: true,
		},
		userId: {
			type: String,
			ref: "User", // Reference to the User model
			required: true,
		},
		permissions: {
			canEditTitle: { type: Boolean, default: false },
			canEditGoal: { type: Boolean, default: false },
			canEditSummary: { type: Boolean, default: false },
			canEditDescription: { type: Boolean, default: false },
			canEditCover: { type: Boolean, default: false },
			canEditTags: { type: Boolean, default: false },
			canEditLocation: { type: Boolean, default: false },
			canEditTalentsNeeded: { type: Boolean, default: false },
			canEditStartDate: { type: Boolean, default: false },
			canEditStatus: { type: Boolean, default: false },
			canEditPhase: { type: Boolean, default: false },
			canEditObjectives: { type: Boolean, default: false },
			canEditCreatorMotivation: { type: Boolean, default: false },
			canEditVisibility: { type: Boolean, default: false },
			canEditAttachments: { type: Boolean, default: false },
			canSeeJoinProjectRequests: { type: Boolean, default: false },
			canAnswerJoinProjectRequests: { type: Boolean, default: false },
			canSendJoinProjectInvitations: { type: Boolean, default: false },
			canEditMembers: { type: Boolean, default: false },
			canRemoveMembers: { type: Boolean, default: false },
			canEditRights: { type: Boolean, default: false },
			canEditMembers: { type: Boolean, default: false },
		},
		updatedBy: { type: String },
	},
	{
		collection: "projectRights",
		timestamps: true, // Automatically add createdAt and updatedAt timestamps
	}
);

const ProjectRights = mongoose.model("ProjectRights", projectRightsSchema);

module.exports = ProjectRights;
