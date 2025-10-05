const { categoryService } = require("../../services");
const { apiResponse, categoryValidation, commonValidation } = require("../../utils");

const createCategory = async (req, res) => {
	try {
		const { categoryName = "", description = "", colors = {}, cover = "", coverText = "", subCategories = [] } = req.body;

		// Validate input data for creating a category
		const validationInputsResult = categoryValidation.validateCategoryInputs(categoryName, description, cover, coverText);
		if (validationInputsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationInputsResult.message);
		}

		const validationColorsResult = commonValidation.validateColors(colors);
		if (validationColorsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationColorsResult.message);
		}

		for (const subCat of subCategories) {
			const validationSubCatInputsResult = categoryValidation.validateSubCategoryInputs(subCat.name, subCat.symbol);
			if (validationSubCatInputsResult.status !== "success") {
				return apiResponse.clientErrorResponse(res, validationSubCatInputsResult.message);
			}
			const validationSubCatColorsResult = commonValidation.validateColors(subCat.colors);
			if (validationSubCatColorsResult.status !== "success") {
				return apiResponse.clientErrorResponse(res, validationSubCatColorsResult.message);
			}
		}

		// Call the service to create the category
		const createdCategory = await categoryService.createCategory(categoryName, description, colors, cover, coverText, subCategories);
		if (createdCategory.status !== "success") {
			return apiResponse.serverErrorResponse(res, createdCategory.message);
		}

		return apiResponse.successResponseWithData(res, createdCategory.message, createdCategory);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const updateCategory = async (req, res) => {
	try {
		const { categoryId = "", categoryNewName = "", categoryNewDescription = "", categoryNewColors = {} } = req.body;

		// Validate input data for updating a category
		const validationIdResult = categoryValidation.validateCategoryId(categoryId);
		if (validationIdResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdResult.message);
		}

		const validationResult = categoryValidation.validateCategoryNameAndCategoryDescription(categoryNewName, categoryNewDescription);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const validationColorsResult = commonValidation.validateColors(categoryNewColors);
		if (validationColorsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationColorsResult.message);
		}

		// Call the service to update the category
		const updatedCategory = await categoryService.updateCategory(categoryId, categoryNewName, categoryNewDescription, categoryNewColors);
		if (updatedCategory.status !== "success") {
			return apiResponse.serverErrorResponse(res, updatedCategory.message);
		}

		return apiResponse.successResponseWithData(res, updatedCategory.message, updatedCategory);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const removeCategory = async (req, res) => {
	try {
		const { categoryId = "" } = req.body;

		// Validate input data for removing a category
		const validationResult = categoryValidation.validateCategoryId(categoryId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Call the service to remove the category
		const removedCategory = await categoryService.removeCategory(categoryId);
		if (removedCategory.status !== "success") {
			return apiResponse.serverErrorResponse(res, removedCategory.message);
		}

		return apiResponse.successResponseWithData(res, removedCategory.message, removedCategory);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

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

		return apiResponse.successResponseWithData(res, addedSubCategory.message, addedSubCategory);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

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

		return apiResponse.successResponseWithData(res, updatedSubCategory.message, updatedSubCategory);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

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

		return apiResponse.successResponseWithData(res, removedSubCategory.message, removedSubCategory);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveCategoryWithId = async (req, res) => {
	try {
		const { categoryId } = req.params;

		// Validate input data for creating a category
		const validationResult = categoryValidation.validateCategoryId(categoryId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Call the service to retrieve the category
		const retrievedCategory = await categoryService.retrieveCategoryById(categoryId, ["-_id", "name", "subCategories", "categoryId", "createdAt", "updatedAt"]);
		if (retrievedCategory.status !== "success") {
			return apiResponse.serverErrorResponse(res, retrievedCategory.message);
		}

		return apiResponse.successResponseWithData(res, retrievedCategory.message, retrievedCategory);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveCategoryWithLink = async (req, res) => {
	try {
		const { categoryLink } = req.params;

		// Validate input data for creating a category
		const validationResult = categoryValidation.validateCategoryId(categoryLink);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Call the service to retrieve the category
		const retrievedCategory = await categoryService.retrieveCategoryByLink(categoryLink, [
			"-_id",
			"name",
			"description",
			"link",
			"cover",
			"coverText",
			"colors",
			"subCategories",
			"categoryId",
			"createdAt",
			"updatedAt",
		]);
		if (retrievedCategory.status !== "success") {
			return apiResponse.serverErrorResponse(res, retrievedCategory.message);
		}

		return apiResponse.successResponseWithData(res, retrievedCategory.message, retrievedCategory);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveCategories = async (req, res) => {
	try {
		// Call the service to retrieve the categories
		const retrievedCategories = await categoryService.retrieveAllCategories();
		if (retrievedCategories.status !== "success") {
			return apiResponse.serverErrorResponse(res, retrievedCategories.message);
		}

		return apiResponse.successResponseWithData(res, retrievedCategories.message, retrievedCategories);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	createCategory,
	updateCategory,
	removeCategory,
	addSubCategory,
	updateSubCategory,
	removeSubCategory,
	retrieveCategoryWithId,
	retrieveCategoryWithLink,
	retrieveCategories,
};
