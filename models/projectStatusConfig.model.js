const mongoose = require("mongoose");
const { Schema } = mongoose;
const { dbConnectionPrivate } = require("../config/db.config");
const config = require("../config");

const projectStatus = config.project_status;

const projectStatusConfigSchema = new Schema(
	{
		status: {
			type: String,
			required: true,
			unique: true,
			default: projectStatus[0],
			enum: projectStatus,
			message: "The value {VALUE} is not valid.",
		},
		colors: {
			colorBase: { type: String, required: true, default: "" },
			bgColor: { type: String, required: true, default: "" },
			bgColorHover: { type: String, required: true, default: "" },
		},
	},
	{
		collection: "projectStatusConfigs",
		timestamps: true,
	}
);

const ProjectStatusConfig = dbConnectionPrivate.model("ProjectStatusConfig", projectStatusConfigSchema);

module.exports = ProjectStatusConfig;
