const Category = require("../../models/category.model");
const { logger } = require("../../utils");

/**
 * Create a new category if it does not already exist.
 * @param {string} name - The name of the category.
 * @returns {Promise} - A promise that resolves with the created category or rejects with an error.
 */
const createCategory = async (categoryName, subCategories = []) => {
	//String type validation
	const invalidType = typeof categoryName !== "string" || typeof subCategories !== "object";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!categoryName) {
		return { status: "error", message: "Category name required." };
	}

	try {
		// Check if a category with the same name already exists
		const existingCategory = await Category.findOne({ name: categoryName });

		if (existingCategory) {
			logger.error(
				"Error while storing category in database: Category already present in the database."
			);
			return { status: "error", message: "Category already present in the database." };
		}

		// Create a new category document
		const newCategory = new Category({
			name: categoryName,
			subCategories,
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
		if (typeof categoryId !== "string" || typeof newName !== "string") {
			return { status: "error", message: "Invalid type of data." };
		}
		if (!categoryId) {
			return { status: "error", message: "Category Id required." };
		}
		if (!newName) {
			return { status: "error", message: "Category name required." };
		}

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
		if (!categoryId) {
			return { status: "error", message: "Category Id required." };
		}

		// Check if a category with the given categoryId exists
		const existingCategory = await Category.findOne({ categoryId });

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

const verifyCategoryAndSubCategoryExist = async (categoryId, subCategoryName) => {
	try {
		const existingCategory = await Category.findOne({ categoryId });

		if (!existingCategory) {
			return { status: "error", message: "Category not found." };
		}

		if (!existingCategory.subCategories.includes(subCategoryName)) {
			return { status: "error", message: "Sub-category not found." };
		}

		return { status: "success", category: existingCategory };
	} catch (error) {
		logger.error(`Error while checking category/sub-category: ${error}`);
		return { status: "error", message: "An error occurred while checking category/sub-category." };
	}
};

const addSubCategory = async (categoryId, subCategoryName) => {
	//String type validation
	const invalidType = typeof categoryId !== "string" || typeof subCategoryName !== "string";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!categoryId) {
		return { status: "error", message: "Category ID required." };
	}
	if (!subCategoryName) {
		return { status: "error", message: "Sub-category name required." };
	}

	try {
		// Check if category exists
		const category = await Category.findOne({ categoryId });

		if (!category) {
			return { status: "error", message: "Category not found." };
		}
		// Check if sub-category does not already exists
		if (category.subCategories.includes(subCategoryName)) {
			logger.error(
				"Error while storing sub-category in database: Sub-category already present in the category."
			);
			return { status: "error", message: "Sub-category already present in the category." };
		}
		category.subCategories.push(subCategoryName);

		// Save the sub-category to the database
		await category.save();

		logger.info(`New sub-category stored in database. Category: ${category}`);
		return {
			status: "success",
			message: "New sub-category stored in database.",
			data: { category },
		};
	} catch (error) {
		logger.error("Error while storing sub-category in database: ", error);
		return {
			status: "error",
			message: "An error occurred while storing sub-category in database.",
		};
	}
};

const updateSubCategory = async (categoryId, subCategoryOldName, subCategoryNewName) => {
	//String type validation
	const invalidType =
		typeof categoryId !== "string" ||
		typeof subCategoryOldName !== "string" ||
		typeof subCategoryNewName !== "string";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!categoryId) {
		return { status: "error", message: "Category ID required." };
	}
	if (!subCategoryOldName) {
		return { status: "error", message: "Sub-category former name required." };
	}
	if (!subCategoryNewName) {
		return { status: "error", message: "Sub-category new name required." };
	}
	if (subCategoryNewName === subCategoryOldName) {
		return {
			status: "error",
			message: "New sub-category name must be different from the former one.",
		};
	}

	try {
		// Check if category exists
		const category = await Category.findOne({ categoryId });

		if (!category) {
			return { status: "error", message: "Category not found." };
		}
		// Check if the sub-category to update exists in the category's subCategories array
		const subCategoryIndex = category.subCategories.indexOf(subCategoryOldName);

		if (subCategoryIndex === -1) {
			return { status: "error", message: "Sub-category not found in the category" };
		}

		// Update the sub-category name
		category.subCategories[subCategoryIndex] = subCategoryNewName;
		// Save the sub-category to the database
		await category.save();

		logger.info(`Sub-category updated in database. Category: ${category}`);
		return {
			status: "success",
			message: "Sub-category updated in database.",
			data: { category },
		};
	} catch (error) {
		logger.error("Error while updating sub-category in database: ", error);
		return {
			status: "error",
			message: "An error occurred while updating sub-category.",
		};
	}
};

const removeSubCategory = async (categoryId, subCategoryName) => {
	try {
		// Validate input data
		if (typeof categoryId !== "string" || typeof subCategoryName !== "string") {
			return { status: "error", message: "Invalid type of data." };
		}
		if (!categoryId) {
			return { status: "error", message: "Category Id required." };
		}
		if (!subCategoryName) {
			return { status: "error", message: "Sub-category name required." };
		}

		// Check if the category and sub-category exist
		const existingCategory = await verifyCategoryAndSubCategoryExist(categoryId, subCategoryName);

		if (existingCategory.status !== "success") {
			return { status: "error", message: existingCategory.message };
		}
		const subCategoryIndex = existingCategory.category.subCategories.indexOf(subCategoryName);

		existingCategory.category.subCategories.splice(subCategoryIndex, 1);

		// Save the updated category
		await existingCategory.category.save();

		logger.info(
			`Sub-category removed successfully. Sub-category: ${subCategoryName} - Category: ${existingCategory.category.name}`
		);

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
	verifyCategoryAndSubCategoryExist,
	addSubCategory,
	updateSubCategory,
	removeSubCategory,
};
