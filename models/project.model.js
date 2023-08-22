const mongoose = require("mongoose");
const Category = require("./category.model");
const { DateTime } = require("luxon");

const memberSchema = new mongoose.Schema({
	memberId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	role: String,
	startDate: {
		type: Date,
		default: DateTime.now().toHTTP(),
	},
});

const projectSchema = new mongoose.Schema(
	{
		projectId: { type: String, required: true, unique: true },
		title: { type: String, required: true, unique: true },
		goal: { type: String, required: true },
		summary: { type: String, required: true },
		description: { type: String, required: true },
		categoriesIds: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Category",
				},
			],
			required: true,
		},
		subCategoriesIds: { type: [String] }, // Optional
		tagsIds: { type: [String] }, // Optional
		status: {
			type: String,
			required: true,
			enum: ["draft", "submitted", "active", "on hold", "completed", "archived", "cancelled"],
			message: "The value {VALUE} is not valid.",
		},
		phase: { type: String }, // Optional
		members: [memberSchema], // Optional
		location: { city: { type: String }, country: { type: String } }, // Optional
		skillsNeeded: {
			type: [String], // Array of skills or talents needed
			required: true,
		},
		createdAt: {
			type: Date,
			default: DateTime.now().toHTTP(),
			required: true,
		},
		startDate: { type: Date }, // Optional
		projectObjectives: String, // Optional
		creatorMotivation: String, // Optional
		collaboratorsExpected: Number, // Optional
		applicationDeadline: Date, // Optional
		visibility: {
			// Optional
			type: String,
			enum: ["public", "private"],
			default: "public",
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
