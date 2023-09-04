const { categoryValidation } = require("../../../utils");

const {
	validateCategoryNameAndSubCategories,
	validateCategoryIdAndCategoryName,
	validateCategoryId,
	validateCategoryIdAndSubCategoryName,
	validateCategoryIdAndSubCategoryOldAndNewNames,
} = categoryValidation;

//validateCategoryNameAndSubCategories

describe("validateCategoryNameAndSubCategories", () => {
	test("should return success when valid categoryName and subCategories are provided", () => {
		const categoryName = "Category 1";
		const subCategories = ["Subcategory 1", "Subcategory 2"];

		const result = validateCategoryNameAndSubCategories(categoryName, subCategories);

		expect(result).toEqual({
			status: "success",
		});
	});

	test("should return error when invalid data types are provided", () => {
		const categoryName = 123; // Invalid data type
		const subCategories = ["Subcategory 1", "Subcategory 2"];

		const result = validateCategoryNameAndSubCategories(categoryName, subCategories);

		expect(result).toEqual({
			status: "error",
			message: "Invalid type of data.",
		});
	});

	test("should return error when categoryName is missing", () => {
		const subCategories = ["Subcategory 1", "Subcategory 2"];

		const result = validateCategoryNameAndSubCategories("", subCategories);

		expect(result).toEqual({
			status: "error",
			message: "Category name required.",
		});
	});

	test("should return success when subCategories is an empty array", () => {
		const categoryName = "Category 1";
		const subCategories = [];

		const result = validateCategoryNameAndSubCategories(categoryName, subCategories);

		expect(result).toEqual({
			status: "success",
		});
	});
});

//validateCategoryIdAndCategoryName

describe("validateCategoryIdAndCategoryName", () => {
	test("should return success when valid categoryId and newName are provided", () => {
		const categoryId = "12345";
		const newName = "New Category";

		const result = validateCategoryIdAndCategoryName(categoryId, newName);

		expect(result).toEqual({
			status: "success",
		});
	});

	test("should return error when invalid data types are provided", () => {
		const categoryId = 123; // Invalid data type
		const newName = "New Category";

		const result = validateCategoryIdAndCategoryName(categoryId, newName);

		expect(result).toEqual({
			status: "error",
			message: "Invalid type of data.",
		});
	});

	test("should return error when categoryId is missing", () => {
		const newName = "New Category";

		const result = validateCategoryIdAndCategoryName("", newName);

		expect(result).toEqual({
			status: "error",
			message: "Category Id required.",
		});
	});

	test("should return error when newName is missing", () => {
		const categoryId = "12345";

		const result = validateCategoryIdAndCategoryName(categoryId, "");

		expect(result).toEqual({
			status: "error",
			message: "Category name required.",
		});
	});
});

//validateCategoryId

describe("validateCategoryId", () => {
	test("should return success when a valid categoryId is provided", () => {
		const categoryId = "12345";

		const result = validateCategoryId(categoryId);

		expect(result).toEqual({
			status: "success",
		});
	});

	test("should return error when an invalid data type is provided", () => {
		const categoryId = 123; // Invalid data type

		const result = validateCategoryId(categoryId);

		expect(result).toEqual({
			status: "error",
			message: "Invalid type of data.",
		});
	});

	test("should return error when categoryId is missing", () => {
		const result = validateCategoryId("");

		expect(result).toEqual({
			status: "error",
			message: "Category Id required.",
		});
	});
});

//validateCategoryIdAndSubCategoryName

describe("validateCategoryIdAndSubCategoryName", () => {
	test("should return success when valid categoryId and subCategoryName are provided", () => {
		const categoryId = "12345";
		const subCategoryName = "Subcategory 1";

		const result = validateCategoryIdAndSubCategoryName(categoryId, subCategoryName);

		expect(result).toEqual({
			status: "success",
		});
	});

	test("should return error when invalid data types are provided", () => {
		const categoryId = 123; // Invalid data type
		const subCategoryName = "Subcategory 1";

		const result = validateCategoryIdAndSubCategoryName(categoryId, subCategoryName);

		expect(result).toEqual({
			status: "error",
			message: "Invalid type of data.",
		});
	});

	test("should return error when categoryId is missing", () => {
		const subCategoryName = "Subcategory 1";

		const result = validateCategoryIdAndSubCategoryName("", subCategoryName);

		expect(result).toEqual({
			status: "error",
			message: "Category ID required.",
		});
	});

	test("should return error when subCategoryName is missing", () => {
		const categoryId = "12345";

		const result = validateCategoryIdAndSubCategoryName(categoryId, "");

		expect(result).toEqual({
			status: "error",
			message: "Sub-category name required.",
		});
	});
});

//validateCategoryIdAndSubCategoryOldAndNewNames

describe("validateCategoryIdAndSubCategoryOldAndNewNames", () => {
	test("should return success when valid inputs are provided", () => {
		const categoryId = "12345";
		const subCategoryOldName = "Subcategory 1";
		const subCategoryNewName = "New Subcategory";

		const result = validateCategoryIdAndSubCategoryOldAndNewNames(
			categoryId,
			subCategoryOldName,
			subCategoryNewName
		);

		expect(result).toEqual({
			status: "success",
		});
	});

	test("should return error when invalid data types are provided", () => {
		const categoryId = 123; // Invalid data type
		const subCategoryOldName = "Subcategory 1";
		const subCategoryNewName = "New Subcategory";

		const result = validateCategoryIdAndSubCategoryOldAndNewNames(
			categoryId,
			subCategoryOldName,
			subCategoryNewName
		);

		expect(result).toEqual({
			status: "error",
			message: "Invalid type of data.",
		});
	});

	test("should return error when categoryId is missing", () => {
		const subCategoryOldName = "Subcategory 1";
		const subCategoryNewName = "New Subcategory";

		const result = validateCategoryIdAndSubCategoryOldAndNewNames(
			"",
			subCategoryOldName,
			subCategoryNewName
		);

		expect(result).toEqual({
			status: "error",
			message: "Category ID required.",
		});
	});

	test("should return error when subCategoryOldName is missing", () => {
		const categoryId = "12345";
		const subCategoryNewName = "New Subcategory";

		const result = validateCategoryIdAndSubCategoryOldAndNewNames(
			categoryId,
			"",
			subCategoryNewName
		);

		expect(result).toEqual({
			status: "error",
			message: "Sub-category former name required.",
		});
	});

	test("should return error when subCategoryNewName is missing", () => {
		const categoryId = "12345";
		const subCategoryOldName = "Subcategory 1";

		const result = validateCategoryIdAndSubCategoryOldAndNewNames(
			categoryId,
			subCategoryOldName,
			""
		);

		expect(result).toEqual({
			status: "error",
			message: "Sub-category new name required.",
		});
	});

	test("should return error when subCategoryNewName is the same as subCategoryOldName", () => {
		const categoryId = "12345";
		const subCategoryOldName = "Subcategory 1";
		const subCategoryNewName = "Subcategory 1";

		const result = validateCategoryIdAndSubCategoryOldAndNewNames(
			categoryId,
			subCategoryOldName,
			subCategoryNewName
		);

		expect(result).toEqual({
			status: "error",
			message: "Sub-category new name must be different from the former one.",
		});
	});
});
