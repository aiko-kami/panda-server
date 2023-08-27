const { apiResponse } = require("../../utils");

// Remove project category
const createProject = async (req, res) => {
	return apiResponse.successResponse(res, "Project created successfully.");
};

module.exports = {
	createProject,
};
