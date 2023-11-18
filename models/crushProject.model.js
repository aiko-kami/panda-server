const mongoose = require("mongoose");
const { Schema } = mongoose;
const { dbConnectionPrivate } = require("../config/db.config");
const { DateTime } = require("luxon");

const crushProjectSchema = new Schema(
	{
		crushProjectId: { type: String, unique: true },
		project: { type: Schema.Types.ObjectId, ref: "Project", unique: true },
		updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
