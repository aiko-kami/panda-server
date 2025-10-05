const mongoose = require("mongoose");
const { Schema } = mongoose;
const { dbConnectionPrivate } = require("../config/db.config");

const projectStatusSchema = new Schema(
	{
		projectStatusId: { type: String, unique: true },
		status: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		colors: {
			colorBase: { type: String, required: true, default: "" },
			bgColor: { type: String, required: true, default: "" },
			bgColorHover: { type: String, required: true, default: "" },
		},
	},
	{
		collection: "projectStatuses",
		timestamps: true,
	}
);

const ProjectStatus = dbConnectionPrivate.model("ProjectStatus", projectStatusSchema);

module.exports = ProjectStatus;
