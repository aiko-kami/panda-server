const { Category } = require("../../models");
const { logger } = require("../../utils");

/**
 * Create a new category if it does not already exist.
 * @param {string} name - The name of the category.
 * @returns {Promise} - A promise that resolves with the created category or rejects with an error.
 */
const createCategory = async (categoryName, subCategories) => {
	try {
		// Check if a category with the same name already exists
		const existingCategory = await Category.findOne({ name: categoryName });

		if (existingCategory) {
			logger.error("Error while storing category in database: Category already exists in the database.");
			return { status: "error", message: "Category already exists in the database." };
		}
		// Filter out empty strings from the subCategories array
		const filteredSubCategories = subCategories.filter((subCategory) => subCategory.trim() !== "");

		// Create a new category document
		const newCategory = new Category({
			name: categoryName,
			subCategories: filteredSubCategories,
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

const addSubCategory = async (categoryId, subCategoryName) => {
	try {
		// Check if category exists
		const category = await Category.findOne({ categoryId });

		if (!category) {
			return { status: "error", message: "Category not found." };
		}
		// Check if sub-category does not already exists
		if (category.subCategories.includes(subCategoryName)) {
			logger.error("Error while storing sub-category in database: Sub-category already present in the category.");
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

		if (category.subCategories.includes(subCategoryNewName)) {
			return { status: "error", message: "Sub-category new name already present in the category" };
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
		// Check if the category and sub-category exist
		// Check if category exists
		const category = await Category.findOne({ categoryId });

		if (!category) {
			return { status: "error", message: "Category not found." };
		}
		// Check if the sub-category to remove exists in the category's subCategories array
		const subCategoryIndex = category.subCategories.indexOf(subCategoryName);

		if (subCategoryIndex === -1) {
			return { status: "error", message: "Sub-category not found in the category" };
		}

		category.subCategories.splice(subCategoryIndex, 1);

		// Save the updated category
		await category.save();

		logger.info(`Sub-category removed successfully. Sub-category: ${subCategoryName} - Category: ${category.name}`);

		return {
			status: "success",
			message: "Category removed successfully.",
			data: { removedSubCategory: subCategoryName },
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
		const existingCategory = await Category.findOne({ categoryId }).select("-_id -__v");

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

const retrieveCategoryById = async (categoryId, fields) => {
	try {
		let query = Category.findOne({ categoryId });
		if (fields) {
			query = query.select(fields);
		}

		const categoryRetrieved = await query;

		if (!categoryRetrieved) {
			return { status: "error", message: "Category not found." };
		}

		return { status: "success", categoryRetrieved };
	} catch (error) {
		logger.error(`Error while retrieving the category: ${error}`);
		return { status: "error", message: "An error occurred while retrieving the category." };
	}
};

const retrieveAllCategories = async (fields) => {
	try {
		const categories = await Category.find().sort({ name: 1 }).select("-_id -__v");

		if (!categories) {
			return { status: "error", message: "No category found." };
		}

		return { status: "success", categories };
	} catch (error) {
		logger.error(`Error while retrieving the categories: ${error}`);
		return { status: "error", message: "An error occurred while retrieving the categories." };
	}
};

module.exports = {
	createCategory,
	updateCategory,
	removeCategory,
	addSubCategory,
	updateSubCategory,
	removeSubCategory,
	verifyCategoryAndSubCategoryExist,
	retrieveCategoryById,
	retrieveAllCategories,
};
