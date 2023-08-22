const { categoryService } = require("../../services");
const { apiResponse } = require("../../utils");

/**
 * Create a new project category controller.
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

		return apiResponse.successResponse(res, "Category created successfully", createdCategory);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, "An error occurred while creating the category");
	}
};

module.exports = {
	createCategory,
};
