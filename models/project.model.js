const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const memberSchema = new mongoose.Schema({
	memberId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User", // Ceci suppose que vous avez un modèle User pour stocker les détails des utilisateurs
		required: true,
	},
	role: String,
	startDate: {
		type: Date,
		default: DateTime.now().toHTTP(),
	},
	// Ajoutez d'autres champs ici si nécessaire
});

const projectSchema = new mongoose.Schema(
	{
		projectId: { type: String, required: true },
		title: { type: String, required: true },
		goal: { type: String, required: true },
		summary: { type: String, required: true },
		description: { type: String, required: true },
		categoriesIds: { type: [String], required: true },
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
		location: { type: String }, // Optional
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
			enum: ["public", "private"], // Only 'public' or 'private' allowed
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
