const { userService, tokenService } = require("../../services");
const { apiResponse, validation } = require("../../utils");

// Login user
const login = async (req, res) => {
	const token = tokenService.generateToken(
		4,
		parseInt(process.env.JWT_ACCESS_LOGIN_EXPIRATION_MINUTES)
	);
	return apiResponse.successResponseWithData(res, "Operation success", { token });
};

module.exports = {
	login,
};
