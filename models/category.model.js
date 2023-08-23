const mongoose = require("mongoose");
const v4 = require("uuid").v4;

const categorySchema = new mongoose.Schema(
	{
		categoryId: { type: String, default: v4(), required: true, unique: true },
		name: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{
		collection: "categories",
	}
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;