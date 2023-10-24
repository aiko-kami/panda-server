const { categoryService } = require("../../services");
const { apiResponse, categoryValidation } = require("../../utils");

/**
 * Create new project category controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the created category or an error message.
 */
const createCategory = async (req, res) => {
	try {
		const { categoryName = "", subCategories = [] } = req.body;

		// Validate input data for creating a category
		const validationResult = categoryValidation.validateCategoryNameAndSubCategories(categoryName, subCategories);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Call the service to create the category
		const createdCategory = await categoryService.createCategory(categoryName, subCategories);

		if (createdCategory.status !== "success") {
			return apiResponse.serverErrorResponse(res, createdCategory.message);
		}

		return apiResponse.successResponseWithData(res, "Category created successfully.", createdCategory);
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
const updateCategory = async (req, res) => {
	try {
		const { categoryId = "", categoryNewName = "" } = req.body;

		// Validate input data for creating a category
		const validationResult = categoryValidation.validateCategoryIdAndCategoryName(categoryId, categoryNewName);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Call the service to create the category
		const updatedCategory = await categoryService.updateCategory(categoryId, categoryNewName);

		if (updatedCategory.status !== "success") {
			return apiResponse.serverErrorResponse(res, updatedCategory.message);
		}

		return apiResponse.successResponseWithData(res, "Category updated successfully.", updatedCategory);
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
const removeCategory = async (req, res) => {
	try {
		const { categoryId = "" } = req.body;

		// Validate input data for creating a category
		const validationResult = categoryValidation.validateCategoryId(categoryId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Call the service to create the category
		const removedCategory = await categoryService.removeCategory(categoryId);

		if (removedCategory.status !== "success") {
			return apiResponse.serverErrorResponse(res, removedCategory.message);
		}

		return apiResponse.successResponseWithData(res, "Category removed successfully.", removedCategory);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, "An error occurred while removing the category.");
	}
};

/**
 * Add sub-category controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the added sub-category or an error message.
 */
const addSubCategory = async (req, res) => {
	try {
		const { categoryId = "", subCategoryName = "" } = req.body;

		// Validate input data for creating a category
		const validationResult = categoryValidation.validateCategoryIdAndSubCategoryName(categoryId, subCategoryName);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Call the service to add the sub-category
		const addedSubCategory = await categoryService.addSubCategory(categoryId, subCategoryName);

		if (addedSubCategory.status !== "success") {
			return apiResponse.serverErrorResponse(res, addedSubCategory.message);
		}

		return apiResponse.successResponseWithData(res, "Sub-category added successfully.", addedSubCategory);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, "An error occurred while adding the sub-category.");
	}
};

/**
 * Update sub-category controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the updated sub-category or an error message.
 */
const updateSubCategory = async (req, res) => {
	try {
		const { categoryId = "", subCategoryOldName = "", subCategoryNewName = "" } = req.body;

		// Validate input data for creating a category
		const validationResult = categoryValidation.validateCategoryIdAndSubCategoryOldAndNewNames(categoryId, subCategoryOldName, subCategoryNewName);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Call the service to update the sub-category
		const updatedSubCategory = await categoryService.updateSubCategory(categoryId, subCategoryOldName, subCategoryNewName);

		if (updatedSubCategory.status !== "success") {
			return apiResponse.serverErrorResponse(res, updatedSubCategory.message);
		}

		return apiResponse.successResponseWithData(res, "Sub-category updated successfully.", updatedSubCategory);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, "An error occurred while updating the sub-category.");
	}
};

/**
 * Remove sub-category controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the removed sub-category or an error message.
 */
const removeSubCategory = async (req, res) => {
	try {
		const { categoryId = "", subCategoryName = "" } = req.body;

		// Validate input data for creating a category
		const validationResult = categoryValidation.validateCategoryIdAndSubCategoryName(categoryId, subCategoryName);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Call the service to remove the sub-category
		const removedSubCategory = await categoryService.removeSubCategory(categoryId, subCategoryName);

		if (removedSubCategory.status !== "success") {
			return apiResponse.serverErrorResponse(res, removedSubCategory.message);
		}

		return apiResponse.successResponseWithData(res, "Sub-category removed successfully.", removedSubCategory);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, "An error occurred while removing the sub-category.");
	}
};

const retrieveCategory = async (req, res) => {
	try {
		const { categoryId = "" } = req.body;

		// Validate input data for creating a category
		const validationResult = categoryValidation.validateCategoryId(categoryId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Call the service to retrieve the category
		const retrievedCategory = await categoryService.retrieveCategoryById(categoryId, "-_id -__v name subCategories categoryId createdAt updatedAt");
		if (retrievedCategory.status !== "success") {
			return apiResponse.serverErrorResponse(res, retrievedCategory.message);
		}

		return apiResponse.successResponseWithData(res, "Category retrieved successfully.", retrievedCategory);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, "An error occurred while retrieving the category.");
	}
};

const retrieveCategories = async (req, res) => {
	try {
		// Call the service to retrieve the categories
		const retrievedCategories = await categoryService.retrieveAllCategories();
		if (retrievedCategories.status !== "success") {
			return apiResponse.serverErrorResponse(res, retrievedCategories.message);
		}

		return apiResponse.successResponseWithData(res, "Categories retrieved successfully.", retrievedCategories);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, "An error occurred while retrieving the categories.");
	}
};

module.exports = {
	createCategory,
	updateCategory,
	removeCategory,
	addSubCategory,
	updateSubCategory,
	removeSubCategory,
	retrieveCategory,
	retrieveCategories,
};
