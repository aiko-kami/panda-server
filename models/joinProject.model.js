const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const v4 = require("uuid").v4;
const config = require("../config");
const joinProjectStatus = config.join_project_status;

const joinProjectSchema = new mongoose.Schema(
	{
		joinProjectId: { type: String, default: v4, required: true, unique: true },
		projectId: { type: String, required: true },
		userIdSender: { type: String, required: true }, // Either a user or a project member depending on the requestType
		userIdReceiver: { type: String }, // In case of join project invitation, the ID of the user for whom is the invitation
		requestType: {
			type: String,
			required: true,
			enum: ["joinRequest", "joinInvitation"], // joinRequest = user sent request to join the project - joinInvitation = project member sent invitation to a user to join the project
			message: "The value {VALUE} is not valid.",
		},
		role: { type: String }, // role of the future project member
		message: { type: String },
		updatedBy: { type: String, required: true },
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

const JoinProject = mongoose.model("JoinProject", joinProjectSchema);

module.exports = JoinProject;