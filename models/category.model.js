const mongoose = require("mongoose");
const { Schema } = mongoose;
const { dbConnectionPrivate } = require("../config/db.config");

const categorySchema = new Schema(
	{
		categoryId: { type: String, unique: true },
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		subCategories: {
			type: [String],
			required: true,
			trim: true,
		},
	},
	{
		collection: "categories",
		timestamps: true, // Automatically add createdAt and updatedAt timestamps
	}
);

const Category = dbConnectionPrivate.model("Category", categorySchema);

module.exports = Category;
