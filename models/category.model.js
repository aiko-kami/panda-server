const mongoose = require("mongoose");
const { Schema } = mongoose;
const { dbConnectionPrivate } = require("../config/db.config");

const subCategorySchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	link: {
		type: String,
		required: true,
		trim: true,
	},
	symbol: {
		type: String,
	},
	colors: {
		colorBase: { type: String, required: true, default: "" },
		bgColor: { type: String, required: true, default: "" },
		bgColorHover: { type: String, required: true, default: "" },
	},
});

const categorySchema = new Schema(
	{
		categoryId: { type: String, unique: true },
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		link: {
			type: String,
			required: true,
			trim: true,
		},
		cover: {
			key: { type: String, default: "" },
			link: { type: String, default: "" },
		},
		coverText: {
			key: { type: String, default: "" },
			link: { type: String, default: "" },
		},
		colors: {
			colorBase: { type: String, required: true, default: "" },
			bgColor: { type: String, required: true, default: "" },
			bgColorHover: { type: String, required: true, default: "" },
		},
		subCategories: [subCategorySchema],
	},
	{
		collection: "categories",
		timestamps: true, // Automatically add createdAt and updatedAt timestamps
	}
);

const Category = dbConnectionPrivate.model("Category", categorySchema);

module.exports = Category;
