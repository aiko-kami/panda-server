const apiResponse = require("../../utils/apiResponses");
const { userService, tokenService } = require("../../services");

// Login user
const login = async (req, res) => {
	const token = tokenService.generateToken(4, parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES));
	return apiResponse.successResponseWithData(res, "Operation success", token);
};

// Logout user
const logout = async (req, res) => {
	const token = tokenService.generateToken(4, parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES));
	return apiResponse.successResponseWithData(res, "Operation success", token);
};

// Signup user
const signup = async (req, res) => {
	const token = tokenService.generateToken(4, parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES));
	return apiResponse.successResponseWithData(res, "Operation success", token);
};

module.exports = {
	login,
	logout,
	signup,
};
