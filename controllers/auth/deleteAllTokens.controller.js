const { tokenService } = require("../../services");
const { apiResponse } = require("../../utils");

const deleteAllTokens = async (req, res) => {
	try {
		const result = await tokenService.deleteAllTokens();
		return apiResponse.successResponse(res, result.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, "An error occurred while deleting the tokens.");
	}
};

module.exports = {
	deleteAllTokens,
};
