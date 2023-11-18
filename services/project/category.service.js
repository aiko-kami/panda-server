const { Category } = require("../../models");
const { logger, encryptTools } = require("../../utils");

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
			logger.error("Error while creating the category: Category already exists.");
			return { status: "error", message: "Category already exists." };
		}
		// Filter out empty strings from the subCategories array
		const filteredSubCategories = subCategories.filter((subCategory) => subCategory.trim() !== "");

		// Create a new category document
		const newCategory = new Category({
			name: categoryName,
			subCategories: filteredSubCategories,
		});

		// Save the category to the database
		const created = await newCategory.save();
		//Add encrypted ID
		const encryptedId = encryptTools.convertObjectIdToId(created._id.toString());
		const createdCategory = await Category.findOneAndUpdate({ _id: created._id }, { categoryId: encryptedId }, { new: true }).select("-_id -__v");

		logger.info(`Category created successfully. Category: ${createdCategory}`);
		return {
			status: "success",
			message: "Category created successfully.",
			data: { createdCategory },
		};
	} catch (error) {
		logger.error("Error while creating the category: ", error);
		return {
			status: "error",
			message: "An error occurred while creating the category.",
		};
	}
};

const updateCategory = async (categoryId, newName) => {
	try {
		// Check if a category with the given categoryId exists
		const existingCategory = await Category.findOne({ categoryId });
		if (!existingCategory) {
			logger.error("Error while updating the category: Category not found.");
			return { status: "error", message: "Category not found." };
		}

		// Check if the new name is the same as the existing name (no change needed)
		if (newName === existingCategory.name) {
			logger.error("Error while updating the category: Category name is unchanged.");
			return { status: "error", message: "Category name is unchanged." };
		}

		// Check if the new name already exists for another category in the collection (must be unique)
		const nameExists = await Category.findOne({ name: newName });
		if (nameExists) {
			logger.error("Error while updating the category: Category name already exists.");
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
			logger.error("Error while removing the category: Category not found.");
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
		logger.error(`Error while removing the category: ${error}`);
		return {
			status: "error",
			message: "An error occurred while removing the category.",
		};
	}
};

const addSubCategory = async (categoryId, subCategoryName) => {
	try {
		// Check if category exists
		const existingCategory = await Category.findOne({ categoryId });
		if (!existingCategory) {
			return { status: "error", message: "Category not found." };
		}
		// Check if sub-category does not already exists
		if (existingCategory.subCategories.includes(subCategoryName)) {
			logger.error("Error while creating the sub-category: Sub-category already present in the category.");
			return { status: "error", message: "Sub-category already present in the category." };
		}
		existingCategory.subCategories.push(subCategoryName);

		// Save the sub-category to the database
		await existingCategory.save();

		logger.info(`New sub-category created successfully. Category: ${existingCategory}`);
		return {
			status: "success",
			message: "New sub-category created successfully.",
			data: { existingCategory },
		};
	} catch (error) {
		logger.error("Error while creating the sub-category: ", error);
		return {
			status: "error",
			message: "An error occurred while creating the sub-category.",
		};
	}
};

const updateSubCategory = async (categoryId, subCategoryOldName, subCategoryNewName) => {
	try {
		// Check if category exists
		const existingCategory = await Category.findOne({ categoryId });
		if (!existingCategory) {
			return { status: "error", message: "Category not found." };
		}
		// Check if the sub-category to update exists in the category's subCategories array
		const subCategoryIndex = existingCategory.subCategories.indexOf(subCategoryOldName);

		if (subCategoryIndex === -1) {
			logger.error("Error while updating the sub-category: Sub-category not found in the category.");
			return { status: "error", message: "Sub-category not found in the category." };
		}

		if (existingCategory.subCategories.includes(subCategoryNewName)) {
			logger.error("Error while updating the sub-category: Sub-category new name already present in the category.");
			return { status: "error", message: "Sub-category new name already present in the category." };
		}

		// Update the sub-category name
		existingCategory.subCategories[subCategoryIndex] = subCategoryNewName;
		// Save the sub-category to the database
		await existingCategory.save();

		logger.info(`Sub-category updated successfully. Category: ${existingCategory}`);
		return {
			status: "success",
			message: "Sub-category updated successfully.",
			data: { existingCategory },
		};
	} catch (error) {
		logger.error("Error while updating the sub-category: ", error);
		return {
			status: "error",
			message: "An error occurred while updating the sub-category.",
		};
	}
};

const removeSubCategory = async (categoryId, subCategoryName) => {
	try {
		// Check if the category and sub-category exist
		// Check if category exists
		const existingCategory = await Category.findOne({ categoryId });
		if (!existingCategory) {
			return { status: "error", message: "Category not found." };
		}
		// Check if the sub-category to remove exists in the category's subCategories array
		const subCategoryIndex = existingCategory.subCategories.indexOf(subCategoryName);

		if (subCategoryIndex === -1) {
			return { status: "error", message: "Sub-category not found in the category" };
		}

		existingCategory.subCategories.splice(subCategoryIndex, 1);

		// Save the updated category
		await existingCategory.save();

		logger.info(`Sub-category removed successfully. Category: ${existingCategory.name} - Sub-category: ${subCategoryName}`);

		return {
			status: "success",
			message: "Sub-category removed successfully.",
			data: { removedSubCategory: subCategoryName },
		};
	} catch (error) {
		logger.error(`Error while removing the sub-category: ${error}`);
		return {
			status: "error",
			message: "An error occurred while removing the sub-category.",
		};
	}
};

const verifyCategoryAndSubCategoryExist = async (categoryId, subCategoryName) => {
	try {
		const existingCategory = await Category.findOne({ categoryId }).select("-__v");
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

		const existingCategory = await query;

		if (!existingCategory) {
			return { status: "error", message: "Category not found." };
		}

		return { status: "success", existingCategory };
	} catch (error) {
		logger.error(`Error while retrieving the category: ${error}`);
		return { status: "error", message: "An error occurred while retrieving the category." };
	}
};

const retrieveAllCategories = async () => {
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
