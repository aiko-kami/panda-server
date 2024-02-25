const mongoose = require("mongoose");
const { Schema } = mongoose;
const { dbConnectionPrivate } = require("../config/db.config");
const { DateTime } = require("luxon");
const config = require("../config");

const projectStatus = config.project_status;
const projectVisibility = config.project_visibility;
const projectMembersRoles = config.project_members_roles;

const memberSchema = new Schema({
	_id: false,
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	talent: String,
	role: {
		type: String,
		required: true,
		default: projectMembersRoles[0],
		enum: projectMembersRoles,
		message: "The value {VALUE} is not valid.",
	},
	startDate: { type: Date, default: DateTime.now().toHTTP() },
});

const statusChangeSchema = new Schema({
	_id: false,
	status: { type: String, required: true },
	reason: { type: String },
	updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
	timestamp: { type: Date, default: DateTime.now().toHTTP() },
});

const stepSchema = new Schema({
	_id: false,
	title: { type: String, required: true, unique: true, trim: true },
	details: { type: String },
	published: { type: Boolean, default: false },
});

const QASchema = new Schema({
	_id: false,
	question: { type: String, required: true, unique: true, trim: true },
	response: { type: String },
	published: { type: Boolean, default: false },
});

const projectSchema = new Schema(
	{
		projectId: { type: String, unique: true },
		draft: {
			title: { type: String, trim: true },
			goal: { type: String, trim: true },
			summary: { type: String, trim: true },
			description: { type: String },
			cover: {
				key: { type: String, default: "" },
				link: { type: String, default: "" },
			}, // Optional
			location: {
				city: { type: String },
				country: { type: String },
				onlineOnly: { type: Boolean, default: false },
			}, // Optional
			startDate: { type: Date }, // Optional
			phase: { type: String }, // Optional
			creatorMotivation: String, // Optional
			visibility: {
				type: String,
				default: projectVisibility[0],
				enum: projectVisibility,
				message: "The value {VALUE} is not valid.",
			}, // Optional
			tags: { type: [String] }, // Optional
			talentsNeeded: { type: [String] }, // Array of talents needed
			objectives: { type: [String] }, // Optional
			updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
		},
		title: { type: String, required: true, unique: true, trim: true },
		titleCapitalized: { type: String, required: true, unique: true, trim: true },
		goal: { type: String, required: true, trim: true },
		summary: { type: String, required: true, trim: true },
		description: { type: String, required: true },
		cover: {
			key: { type: String, default: "" },
			link: { type: String, default: "" },
		}, // Optional
		crush: { type: Boolean, default: false }, // Optional
		likes: { type: Number, default: 0 }, // Optional
		category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
		subCategory: { type: String }, // Optional
		location: {
			city: { type: String },
			country: { type: String },
			onlineOnly: { type: Boolean, default: false },
		}, // Optional
		startDate: Date, // Optional
		creatorMotivation: String, // Optional
		tags: [String], // Optional
		steps: {
			type: {
				stepsList: [stepSchema],
				updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
				createdAt: { type: Date, required: true, default: DateTime.now().toHTTP() },
				updatedAt: { type: Date, required: true },
			},
			required: false,
		}, // Optional
		QAs: {
			type: {
				QAsList: [QASchema],
				updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
				createdAt: { type: Date, required: true, default: DateTime.now().toHTTP() },
				updatedAt: { type: Date, required: true },
			},
			required: false,
		}, // Optional
		talentsNeeded: { type: [String], required: true },
		objectives: { type: [String] }, // Optional
		updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
		visibility: {
			type: String,
			required: true,
			default: projectVisibility[0],
			enum: projectVisibility,
			message: "The value {VALUE} is not valid.",
		},
		statusInfo: {
			currentStatus: {
				type: String,
				required: true,
				default: projectStatus[0],
				enum: projectStatus,
				message: "The value {VALUE} is not valid.",
			},
			reason: { type: String },
			statusHistory: [statusChangeSchema],
		},
		privateData: {
			phase: String, // Optional
			attachments: [String], // Array of file URLs - Optional
		},
		createdAt: {
			type: Date,
			required: true,
			default: DateTime.now().toHTTP(),
		},
		createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
		members: [memberSchema], // Optional
	},
	{
		collection: "projects",
		timestamps: true, // Automatically add createdAt and updatedAt timestamps
	}
);

const Project = dbConnectionPrivate.model("Project", projectSchema);

module.exports = Project;
