const mongoose = require("mongoose");
const { Schema } = mongoose;
const { dbConnectionPrivate } = require("../config/db.config");
const { DateTime } = require("luxon");
const config = require("../config");
const joinProjectStatus = config.join_project_status;

const joinProjectSchema = new Schema(
	{
		joinProjectId: { type: String, unique: true },
		project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
		sender: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Either a user or a project member depending on the requestType
		receiver: { type: Schema.Types.ObjectId, ref: "User" }, // In case of join project invitation, the ID of the user for whom is the invitation
		requestType: {
			type: String,
			required: true,
			enum: ["join project request", "join project invitation"], // request = user sent request to join the project - invitation = project member sent invitation to a user to join the project
			message: "The value {VALUE} is not valid.",
		},
		talent: { type: String }, // talent of the future project member
		message: { type: String },
		updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
		status: {
			type: String,
			required: true,
			default: joinProjectStatus[0],
			enum: joinProjectStatus,
			message: "The value {VALUE} is not valid.",
		},
		createdAt: {
			type: Date,
			required: true,
			default: DateTime.now().toHTTP(),
		},
	},
	{
		collection: "joinProjects",
		timestamps: true, // Automatically add createdAt and updatedAt timestamps
	}
);

const JoinProject = dbConnectionPrivate.model("JoinProject", joinProjectSchema);

module.exports = JoinProject;
