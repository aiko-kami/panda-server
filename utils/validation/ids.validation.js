const config = require("../../config");

const validateIdsInputs = (ids) => {
	Object.values(ids).forEach((val) => {
		if (typeof val !== "string") {
			return { status: "error", message: "Invalid type of data." };
		}
	});

	// If all validations passed
	return { status: "success", message: "All Ids are valid." };
};

module.exports = {
	validateIdsInputs,
};
