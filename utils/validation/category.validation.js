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

const validateCategoryColors = (colors) => {
	const { colorBase, bgColor, bgColorHover } = colors || {};

	//String type validation
	if (typeof colorBase !== "string" || typeof bgColor !== "string" || typeof bgColorHover !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!colorBase.trim()) {
		return { status: "error", message: "Category color base is required." };
	}
	if (!bgColor.trim()) {
		return { status: "error", message: "Category background color is required." };
	}
	if (!bgColorHover.trim()) {
		return { status: "error", message: "Category background color hover is required." };
	}
	// If all validations passed
	return { status: "success", message: "All category color inputs are valid." };
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

const validateCategoryIdAndCategoryName = (categoryId, newName) => {
	//String type validation
	if (typeof categoryId !== "string" || typeof newName !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!categoryId) {
		return { status: "error", message: "Category Id is required." };
	}
	if (!newName) {
		return { status: "error", message: "Category name is required." };
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
		return { status: "error", message: "Category Id is required." };
	}
	// If all validations passed
	return { status: "success", message: "Category Id input is valid." };
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
	validateCategoryColors,
	validateSubCategoryInputs,
	validateCategoryIdAndCategoryName,
	validateCategoryId,
	validateCategoryIdAndSubCategoryName,
	validateCategoryIdAndSubCategoryOldAndNewNames,
};
