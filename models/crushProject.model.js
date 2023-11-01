const mongoose = require("mongoose");
const { dbConnectionPrivate } = require("../config/db.config");
const { DateTime } = require("luxon");
const v4 = require("uuid").v4;

const crushProjectSchema = new mongoose.Schema(
	{
		projectId: { type: String, required: true, unique: true },
		updatedBy: { type: String, required: true },
		createdAt: {
			type: Date,
			required: true,
			default: DateTime.now().toHTTP(),
		},
	},
	{
		collection: "crushProjects",
		timestamps: true, // Automatically add createdAt and updatedAt timestamps
	}
);

const CrushProject = dbConnectionPrivate.model("CrushProject", crushProjectSchema);

module.exports = CrushProject;
