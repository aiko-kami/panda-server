const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
	{
		categoryId: { type: String, required: true, unique: true },
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
