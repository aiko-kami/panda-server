const validateCategoryNameAndSubCategories = (categoryName, subCategories) => {
	//String type validation
	const invalidType = typeof categoryName !== "string" || !Array.isArray(subCategories) || !subCategories.every((subCat) => typeof subCat === "string");
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!categoryName) {
		return { status: "error", message: "Category name is required." };
	}
	// If all validations passed
	return { status: "success", message: "All category inputs are valid." };
};

const validateCategoryInputs = (categoryName, description, cover, coverText) => {
	//String type validation
	if (typeof categoryName !== "string" || typeof description !== "string" || typeof cover !== "string" || typeof coverText !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!categoryName) {
		return { status: "error", message: "Category name is required." };
	}
	if (!description) {
		return { status: "error", message: "Category description is required." };
	}
	if (!cover) {
		return { status: "error", message: "Category cover link is required." };
	}
	if (!coverText) {
		return { status: "error", message: "Category cover text link is required." };
	}
	// If all validations passed
	return { status: "success", message: "All category inputs are valid." };
};

const validateSubCategoryInputs = (subCategoryName, symbol) => {
	//String type validation
	if (typeof subCategoryName !== "string" || typeof symbol !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!subCategoryName) {
		return { status: "error", message: "Category name is required." };
	}
	if (!symbol) {
		return { status: "error", message: "Category symbol is required." };
	}
	// If all validations passed
	return { status: "success", message: "All category inputs are valid." };
};

const validateCategoryIdAndCategoryName = (categoryId, categoryName) => {
	//String type validation
	if (typeof categoryId !== "string" || typeof categoryName !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!categoryId) {
		return { status: "error", message: "Category ID is required." };
	}
	if (!categoryName) {
		return { status: "error", message: "Category name is required." };
	}
	// If all validations passed
	return { status: "success", message: "All category inputs are valid." };
};

const validateCategoryNameAndCategoryDescription = (categoryName, categoryDescription) => {
	//String type validation
	if (typeof categoryName !== "string" || typeof categoryDescription !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!categoryName) {
		return { status: "error", message: "Category name is required." };
	}
	if (!categoryDescription) {
		return { status: "error", message: "Category description is required." };
	}
	// If all validations passed
	return { status: "success", message: "All category inputs are valid." };
};

const validateCategoryId = (categoryId) => {
	//String type validation
	if (typeof categoryId !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!categoryId) {
		return { status: "error", message: "Category ID is required." };
	}
	// If all validations passed
	return { status: "success", message: "Category ID input is valid." };
};

const validateCategoryIdAndSubCategoryName = (categoryId, subCategoryName) => {
	//String type validation
	const invalidType = typeof categoryId !== "string" || typeof subCategoryName !== "string";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!categoryId) {
		return { status: "error", message: "Category ID is required." };
	}
	if (!subCategoryName) {
		return { status: "error", message: "Sub-category name is required." };
	}
	// If all validations passed
	return { status: "success", message: "All category inputs are valid." };
};

const validateCategoryIdAndSubCategoryOldAndNewNames = (categoryId, subCategoryOldName, subCategoryNewName) => {
	//String type validation
	const invalidType = typeof categoryId !== "string" || typeof subCategoryOldName !== "string" || typeof subCategoryNewName !== "string";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!categoryId) {
		return { status: "error", message: "Category ID is required." };
	}
	if (!subCategoryOldName) {
		return { status: "error", message: "Sub-category former name is required." };
	}
	if (!subCategoryNewName) {
		return { status: "error", message: "Sub-category new name is required." };
	}
	if (subCategoryNewName === subCategoryOldName) {
		return {
			status: "error",
			message: "Sub-category new name must be different from the former one.",
		};
	}
	// If all validations passed
	return { status: "success", message: "All category inputs are valid." };
};

module.exports = {
	validateCategoryNameAndSubCategories,
	validateCategoryInputs,
	validateSubCategoryInputs,
	validateCategoryIdAndCategoryName,
	validateCategoryNameAndCategoryDescription,
	validateCategoryId,
	validateCategoryIdAndSubCategoryName,
	validateCategoryIdAndSubCategoryOldAndNewNames,
};
