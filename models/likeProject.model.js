const mongoose = require("mongoose");
const { Schema } = mongoose;
const { dbConnectionPrivate } = require("../config/db.config");
const { DateTime } = require("luxon");

const likeProjectSchema = new Schema(
	{
		likeProjectId: { type: String, unique: true },
		project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		createdAt: {
			type: Date,
			required: true,
			default: DateTime.now().toHTTP(),
		},
	},
	{
		collection: "likeProjects",
	}
);

const LikeProject = dbConnectionPrivate.model("LikeProject", likeProjectSchema);

module.exports = LikeProject;
