const mongoose = require("mongoose");
const { Schema } = mongoose;
const { dbConnectionPrivate } = require("../config/db.config");
const config = require("../config");

const projectStepStatus = config.project_step_status;

const projectStepConfigSchema = new Schema(
	{
		status: {
			type: String,
			required: true,
			unique: true,
			default: projectStepStatus[0],
			enum: projectStepStatus,
			message: "The value {VALUE} is not valid.",
		},
		colors: {
			colorBase: { type: String, required: true, default: "" },
			bgColor: { type: String, required: true, default: "" },
			bgColorHover: { type: String, required: true, default: "" },
		},
	},
	{
		collection: "projectStepConfigs",
		timestamps: true,
	}
);

const ProjectStepConfig = dbConnectionPrivate.model("ProjectStepConfig", projectStepConfigSchema);

module.exports = ProjectStepConfig;
