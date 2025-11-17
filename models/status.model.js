const mongoose = require("mongoose");
const { Schema } = mongoose;
const { dbConnectionPrivate } = require("../config/db.config");

const statusSchema = new Schema(
	{
		statusId: { type: String, unique: true },
		status: {
			type: String,
			required: true,
		},
		// Type of status (project status, join porject status...)
		type: {
			type: String,
			required: true,
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
		collection: "statuses",
		timestamps: true,
	}
);

const Status = dbConnectionPrivate.model("Status", statusSchema);

module.exports = Status;
