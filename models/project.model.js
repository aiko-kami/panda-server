const mongoose = require("mongoose");
const { Schema } = mongoose;
const { dbConnectionPrivate } = require("../config/db.config");
const { DateTime } = require("luxon");
const config = require("../config");

const projectStatus = config.project_status;
const projectVisibility = config.project_visibility;
const projectMembersRoles = config.project_members_roles;

const memberSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
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

const stepSchema = new Schema({
	_id: false,
	title: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	details: {
		type: String,
	},
	published: {
		type: Boolean,
		default: false,
	},
});

const QASchema = new Schema({
	_id: false,
	question: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	response: {
		type: String,
	},
	published: {
		type: Boolean,
		default: false,
	},
});

const projectSchema = new Schema(
	{
		projectId: { type: String, unique: true },
		draft: {
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
			updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
		},
		title: { type: String, required: true, unique: true, trim: true },
		titleCapitalized: { type: String, required: true, unique: true, trim: true },
		goal: { type: String, required: true, trim: true },
		summary: { type: String, required: true, trim: true },
		description: { type: String, required: true },
		cover: { type: String }, // Optional
		crush: { type: Boolean, default: false },
		likes: { type: Number, default: 0 },
		category: {
			type: Schema.Types.ObjectId,
			ref: "Category",
			required: true,
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
		steps: {
			stepsList: [stepSchema],
			updatedBy: {
				type: Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
			createdAt: {
				type: Date,
				required: true,
				default: DateTime.now().toHTTP(),
			},
			updatedAt: {
				type: Date,
				required: true,
			},
		}, // Optional
		QAs: {
			QA: [QASchema],
			updatedBy: {
				type: Schema.Types.ObjectId,
				ref: "User",
			},
			createdAt: {
				type: Date,
				default: DateTime.now().toHTTP(),
			},
			updatedAt: {
				type: Date,
			},
		}, // Optional
		talentsNeeded: {
			type: [String], // Array of talents needed
			required: true,
		},
		objectives: { type: [String] }, // Optional
		updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
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

const Project = dbConnectionPrivate.model("Project", projectSchema);

module.exports = Project;
