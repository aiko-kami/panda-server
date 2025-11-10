const mongoose = require("mongoose");
const { Schema } = mongoose;
const { dbConnectionPrivate } = require("../config/db.config");

const projectRightsSchema = new Schema(
	{
		project: {
			type: Schema.Types.ObjectId,
			ref: "Project", // Reference to the Project model
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User", // Reference to the User model
			required: true,
		},
		permissions: {
			canEditTitle: { type: Boolean, default: false },
			canEditCategory: { type: Boolean, default: false },
			canEditSubCategory: { type: Boolean, default: false },
			canEditSummary: { type: Boolean, default: false },
			canEditDescription: { type: Boolean, default: false },
			canEditGoal: { type: Boolean, default: false },
			canEditCover: { type: Boolean, default: false },
			canEditTags: { type: Boolean, default: false },
			canEditStatus: { type: Boolean, default: false },
			canEditVisibility: { type: Boolean, default: false },
			canEditLocation: { type: Boolean, default: false },
			canEditSteps: { type: Boolean, default: false },
			canEditQAs: { type: Boolean, default: false },
			canEditRights: { type: Boolean, default: false },
			canEditMembers: { type: Boolean, default: false },
			canRemoveMembers: { type: Boolean, default: false },
			canEditTalentsNeeded: { type: Boolean, default: false },
			canViewJoinProjectRequests: { type: Boolean, default: false },
			canEditJoinProjectRequests: { type: Boolean, default: false },
			canViewJoinProjectInvitations: { type: Boolean, default: false },
			canEditJoinProjectInvitations: { type: Boolean, default: false },
			canViewAttachments: { type: Boolean, default: false },
			canAddAttachments: { type: Boolean, default: false },
			canEditAttachments: { type: Boolean, default: false },
			canRemoveAttachments: { type: Boolean, default: false },
			canEditStartDate: { type: Boolean, default: false },
			canEditPhase: { type: Boolean, default: false },
			canEditObjectives: { type: Boolean, default: false },
			canEditCreatorMotivation: { type: Boolean, default: false },

			canEditSectionGeneral: { type: Boolean, default: false },
			canEditSectionMembers: { type: Boolean, default: false },
			canEditSectionRights: { type: Boolean, default: false },
			canEditSectionStatus: { type: Boolean, default: false },
			canEditSectionLocation: { type: Boolean, default: false },
			canEditSectionAttachments: { type: Boolean, default: false },
			canEditSectionSteps: { type: Boolean, default: false },
			canEditSectionQAs: { type: Boolean, default: false },
			canEditSectionDetails: { type: Boolean, default: false },
		},
		updatedBy: {
			type: Schema.Types.ObjectId,
			ref: "User", // Reference to the User model
		},
	},
	{
		collection: "projectRights",
		timestamps: true, // Automatically add createdAt and updatedAt timestamps
	}
);

const ProjectRights = dbConnectionPrivate.model("ProjectRights", projectRightsSchema);

module.exports = ProjectRights;
