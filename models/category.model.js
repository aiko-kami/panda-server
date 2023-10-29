const mongoose = require("mongoose");
const { dbConnectionPrivate } = require("../config/db.config");
const v4 = require("uuid").v4;

const categorySchema = new mongoose.Schema(
	{
		categoryId: { type: String, default: v4, required: true, unique: true },
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
