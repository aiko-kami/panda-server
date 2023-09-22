const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const v4 = require("uuid").v4;
const projectStatus = process.env.PROJECT_STATUS.split(", ");
const projectVisibility = process.env.PROJECT_VISIBILITY.split(", ");
const projectMembersRoles = process.env.PROJECT_MEMBERS_ROLES.split(", ");

const memberSchema = new mongoose.Schema({
	userId: {
		type: String,
		ref: "User",
	},
	talent: String,
	role: {
		type: String,
		required: true,
		default: projectMembersRoles[0],
		enum: projectMembersRoles,
		message: "The value {VALUE} is not valid.",
	},
	startDate: {
		type: Date,
		default: DateTime.now().toHTTP(),
	},
});

const projectSchema = new mongoose.Schema(
	{
		projectId: { type: String, default: v4, required: true, unique: true },
		draft: {
			title: { type: String, unique: true, trim: true },
			titleCapitalized: { type: String, unique: true, trim: true },

			goal: { type: String, trim: true },
			summary: { type: String, trim: true },
			description: { type: String },
			cover: { type: String }, // Optional
			phase: { type: String }, // Optional
			location: {
				city: { type: String },
				country: { type: String },
				onlineOnly: { type: Boolean, default: false },
			}, // Optional
			startDate: {
				type: Date,
			}, // Optional
			creatorMotivation: String, // Optional
			tags: { type: [String] }, // Optional
			talentsNeeded: {
				type: [String], // Array of talents needed
			},
			objectives: { type: [String] }, // Optional
			updatedBy: { type: String, required: true },
		},
		title: { type: String, required: true, unique: true, trim: true },
		titleCapitalized: { type: String, required: true, unique: true, trim: true },
		goal: { type: String, required: true, trim: true },
		summary: { type: String, required: true, trim: true },
		description: { type: String, required: true },
		cover: { type: String }, // Optional
		category: {
			type: String,
			required: true,
			ref: "Category",
		},
		subCategory: { type: String }, // Optional
		location: {
			city: { type: String },
			country: { type: String },
			onlineOnly: { type: Boolean, default: false },
		}, // Optional
		startDate: {
			type: Date,
		}, // Optional
		creatorMotivation: String, // Optional
		tags: { type: [String] }, // Optional
		talentsNeeded: {
			type: [String], // Array of talents needed
			required: true,
		},
		objectives: { type: [String] }, // Optional
		updatedBy: { type: String, required: true },
		updatedBy: { type: String, required: true },
		visibility: {
			type: String,
			required: true,
			default: projectVisibility[0],
			enum: projectVisibility,
			message: "The value {VALUE} is not valid.",
		},
		status: {
			type: String,
			required: true,
			default: projectStatus[0],
			enum: projectStatus,
			message: "The value {VALUE} is not valid.",
		},
		private: {
			phase: { type: String }, // Optional
			attachments: [String], // Array of file URLs - Optional
		},
		createdAt: {
			type: Date,
			required: true,
			default: DateTime.now().toHTTP(),
		},
		members: [memberSchema], // Optional
	},
	{
		collection: "projects",
		timestamps: true, // Automatically add createdAt and updatedAt timestamps
	}
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
