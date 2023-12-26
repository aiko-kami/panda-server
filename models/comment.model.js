const mongoose = require("mongoose");
const { Schema } = mongoose;
const { dbConnectionPrivate } = require("../config/db.config");
const { DateTime } = require("luxon");

const commentSchema = new Schema(
	{
		commentId: { type: String, unique: true },
		project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
		author: { type: Schema.Types.ObjectId, ref: "User", required: true },
		content: { type: String, required: true },
		createdAt: {
			type: Date,
			required: true,
			default: DateTime.now().toHTTP(),
		},
		isAnswerTo: { type: Schema.Types.ObjectId, ref: "Comment" },
	},
	{
		collection: "comments",
		timestamps: true, // Automatically add createdAt and updatedAt timestamps
	}
);

const Comment = dbConnectionPrivate.model("Comment", commentSchema);

module.exports = Comment;
