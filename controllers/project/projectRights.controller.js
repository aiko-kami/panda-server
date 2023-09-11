const { categoryService } = require("../../services");
const { apiResponse, categoryValidation } = require("../../utils");

/**
 * Edit user's right to update a project controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the created category or an error message.
 */
const updateUserProjectRights = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { updatedPermissions, userIdUpdated } = req.body;
		const { projectId } = req.params;
	} catch (error) {
		return apiResponse.serverErrorResponse(res, "An error occurred while creating the category.");
	}
};

module.exports = {
	updateUserProjectRights,
};
