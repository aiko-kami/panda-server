const { categoryService } = require("../../services");
const { apiResponse } = require("../../utils");

/**
 * Create new project category controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the created category or an error message.
 */

// Create project category
const createCategory = async (req, res) => {
	const { categoryName } = req.body;

	try {
		// Call the service to create the category
		const createdCategory = await categoryService.createCategory(categoryName);

		if (createdCategory.status !== "success") {
			return apiResponse.serverErrorResponse(res, createdCategory.message);
		}

		return apiResponse.successResponseWithData(
			res,
			"Category created successfully.",
			createdCategory
		);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, "An error occurred while creating the category.");
	}
};

/**
 * Update project category controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the updated category or an error message.
 */

// Update project category
const updateCategory = async (req, res) => {
	const { categoryId, categoryNewName } = req.body;

	try {
		// Call the service to create the category
		const updatedCategory = await categoryService.updateCategory(categoryId, categoryNewName);

		if (updatedCategory.status !== "success") {
			return apiResponse.serverErrorResponse(res, updatedCategory.message);
		}

		return apiResponse.successResponseWithData(
			res,
			"Category updated successfully",
			updatedCategory
		);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, "An error occurred while updating the category.");
	}
};

/**
 * Remove project category controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the removed category or an error message.
 */

// Remove project category
const removeCategory = async (req, res) => {
	const { categoryId } = req.body;

	try {
		// Call the service to create the category
		const removedCategory = await categoryService.removeCategory(categoryId);

		if (removedCategory.status !== "success") {
			return apiResponse.serverErrorResponse(res, removedCategory.message);
		}

		return apiResponse.successResponseWithData(
			res,
			"Category removed successfully.",
			removedCategory
		);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, "An error occurred while removing the category.");
	}
};

module.exports = {
	createCategory,
	updateCategory,
	removeCategory,
};
