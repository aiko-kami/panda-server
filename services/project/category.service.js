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
			logger.error(
				"Error while storing category in database: Category already present in the database."
			);
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

const updateCategory = async (categoryId, newName) => {
	try {
		// Validate input data
		if (typeof categoryId !== "string" || newName !== "string") {
			return { status: "error", message: "Invalid type of data." };
		}

		assert(categoryId, "Category Id required.");
		assert(newName, "Category name required.");

		// Check if a category with the given categoryId exists
		const existingCategory = await Category.findOne({ categoryId });
		if (!existingCategory) {
			logger.error("Error while storing category in database: Category not found.");
			return { status: "error", message: "Category not found." };
		}

		// Check if the new name is the same as the existing name (no change needed)
		if (newName === existingCategory.name) {
			logger.error("Error while storing category in database: Category name is unchanged.");
			return { status: "error", message: "Category name is unchanged." };
		}

		// Check if the new name already exists in the collection (must be unique)
		const nameExists = await Category.findOne({ name: newName });
		if (nameExists) {
			logger.error("Error while storing category in database: Category name already exists.");
			return { status: "error", message: "Category name already exists." };
		}

		// Update the category's name
		existingCategory.name = newName;
		await existingCategory.save();

		logger.info(`Category updated successfully. categoryId: ${categoryId}`);

		return {
			status: "success",
			message: "Category updated successfully.",
			data: { updatedCategory: existingCategory },
		};
	} catch (error) {
		logger.error(`Error while updating category: ${error}`);

		return {
			status: "error",
			message: "An error occurred while updating the category.",
		};
	}
};

const removeCategory = async (categoryId) => {
	try {
		// Validate input data
		if (typeof categoryId !== "string") {
			return { status: "error", message: "Invalid type of data." };
		}
		assert(categoryId, "Category Id required.");

		// Check if a category with the given categoryId exists
		const existingCategory = await Category.findOne({ categoryId });

		console.log("🚀 ~ removeCategory ~ existingCategory:", existingCategory);

		if (!existingCategory) {
			logger.error("Error while storing category in database: Category not found.");
			return { status: "error", message: "Category not found." };
		}

		// Remove the category from the database
		await existingCategory.deleteOne();

		logger.info(`Category removed successfully. categoryId: ${categoryId}`);

		return {
			status: "success",
			message: "Category removed successfully.",
			data: { removedCategory: existingCategory },
		};
	} catch (error) {
		logger.error(`Error while removing category: ${error}`);

		return {
			status: "error",
			message: "An error occurred while removing the category.",
		};
	}
};

module.exports = {
	createCategory,
	updateCategory,
	removeCategory,
};
