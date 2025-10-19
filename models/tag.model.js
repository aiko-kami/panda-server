const mongoose = require("mongoose");
const { Schema } = mongoose;
const { dbConnectionPrivate } = require("../config/db.config");

const tagSchema = new Schema(
	{
		tagId: { type: String, unique: true },
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		nameCapitalized: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		description: {
			type: String,
		},
		link: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
	},
	{
		collection: "tags",
	}
);

const Tag = dbConnectionPrivate.model("Tag", tagSchema);

module.exports = Tag;
