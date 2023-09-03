const validateCategoryNameAndSubCategories = (categoryName, subCategories) => {
	//String type validation
	const invalidType = typeof categoryName !== "string" || typeof subCategories !== "object";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!categoryName) {
		return { status: "error", message: "Category name required." };
	}
	// If all validations passed
	return { status: "success" };
};

const validateCategoryIdAndCategoryName = (categoryId, newName) => {
	//String type validation
	if (typeof categoryId !== "string" || typeof newName !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!categoryId) {
		return { status: "error", message: "Category Id required." };
	}
	if (!newName) {
		return { status: "error", message: "Category name required." };
	}
	// If all validations passed
	return { status: "success" };
};

const validateCategoryId = (categoryId) => {
	//String type validation
	if (typeof categoryId !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!categoryId) {
		return { status: "error", message: "Category Id required." };
	}
	// If all validations passed
	return { status: "success" };
};

const validateCategoryIdAndSubCategoryName = (categoryId, subCategoryName) => {
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
	// If all validations passed
	return { status: "success" };
};

const validateCategoryIdAndSubCategoryOldAndNewNames = (
	categoryId,
	subCategoryOldName,
	subCategoryNewName
) => {
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
			message: "Sub-category new name must be different from the former one.",
		};
	}
	// If all validations passed
	return { status: "success" };
};

module.exports = {
	validateCategoryNameAndSubCategories,
	validateCategoryIdAndCategoryName,
	validateCategoryId,
	validateCategoryIdAndSubCategoryName,
	validateCategoryIdAndSubCategoryOldAndNewNames,
};
