const Category = require("../../models/category.model");
const assert = require("assert");
const { logger } = require("../../utils");

/**
 * Create a new category if it does not already exist.
 * @param {string} name - The name of the category.
 * @returns {Promise} - A promise that resolves with the created category or rejects with an error.
 */
const createCategory = async (name) => {
	//String type validation
	const invalidType = typeof name !== "string";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	try {
		assert(name, "Category name required.");

		// Check if a category with the same name already exists
		const existingCategory = await Category.findOne({ name });

		if (existingCategory) {
			logger.error("Category already present in the database.");
			return { status: "error", message: "Category already present in the database." };
		}

		// Create a new category document
		const newCategory = new Category({
			name: name,
		});

		// Save the category to the database
		const createdCategory = await newCategory.save();

		logger.info(`New category stored in database. Category: ${createdCategory}`);
		return {
			status: "success",
			message: "New category stored in database.",
			data: { createdCategory },
		};
	} catch (error) {
		logger.error("Error while storing category in database: ", error);
		return {
			status: "error",
			message: "An error occurred while storing category in database.",
		};
	}
};

module.exports = {
	createCategory,
};
