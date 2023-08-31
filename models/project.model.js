const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const v4 = require("uuid").v4;

const memberSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	role: String,
	startDate: {
		type: Date,
		default: DateTime.now().toHTTP(),
	},
});

const projectSchema = new mongoose.Schema(
	{
		projectId: { type: String, default: v4, required: true, unique: true },
		title: { type: String, required: true, unique: true, trim: true },
		titleCapitalized: { type: String, required: true, unique: true, trim: true },

		goal: { type: String, required: true, trim: true },
		summary: { type: String, required: true, trim: true },
		description: { type: String, required: true },
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		subCategoryId: { type: String }, // Optional
		tagsIds: { type: [String] }, // Optional
		status: {
			type: String,
			required: true,
			default: "draft",
			enum: ["draft", "submitted", "active", "on hold", "completed", "archived", "cancelled"],
			message: "The value {VALUE} is not valid.",
		},
		phase: { type: String }, // Optional
		members: [memberSchema], // Optional
		location: { city: { type: String }, country: { type: String } }, // Optional
		talentsNeeded: {
			type: [String], // Array of talents needed
			required: true,
		},
		createdAt: {
			type: Date,
			default: DateTime.now().toHTTP(),
			required: true,
		},
		startDate: { type: Date }, // Optional
		objectives: { type: [String] }, // Optional
		creatorMotivation: String, // Optional
		visibility: {
			// Optional
			type: String,
			enum: ["public", "private"],
			default: "public",
			required: true,
		},
		attachments: [String], // Array of file URLs - Optional
	},
	{
		timestamps: true, // Automatically add createdAt and updatedAt timestamps
	},
	{
		collection: "projects",
	}
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
