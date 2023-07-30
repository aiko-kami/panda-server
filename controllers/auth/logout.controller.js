const { userService, tokenService } = require("../../services");
const { apiResponse, validation } = require("../../utils");

// Logout user
const logout = async (req, res) => {
	const token = tokenService.generateToken(4, parseInt(process.env.JWT_ACCESS_SIGNUP_EXPIRATION));
	return apiResponse.successResponseWithData(res, "Operation success", { token });
};

module.exports = {
	logout,
};
