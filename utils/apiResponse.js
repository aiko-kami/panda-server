// Function to send a success response (status 200) without additional data.
const successResponse = function (res, msg) {
	var data = {
		status: 1,
		message: msg,
	};
	return res.status(200).json(data);
};

// Function to send a success response (status 200) with additional data.
const successResponseWithData = function (res, msg, data) {
	var resData = {
		status: 1,
		message: msg,
		data: data,
	};
	return res.status(200).json(resData);
};

// Function to send a client error response (e.g., validation error, unauthorized access, etc.).
const clientErrorResponse = function (res, msg) {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(400).json(data);
};

// Function to send a client validation error response with additional data (e.g., user input errors).
const validationErrorWithData = function (res, msg, data) {
	var resData = {
		status: 0,
		message: msg,
		data: data,
	};
	return res.status(400).json(resData);
};

// Function to send a server error response (e.g., internal server error, database connection failure, etc.).
const serverErrorResponse = function (res, msg) {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(500).json(data);
};

// Function to send a response when the requested resource is not found (e.g., 404 Not Found).
const notFoundResponse = function (res, msg) {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(404).json(data);
};

// Function to send an unauthorized response when the user is not allowed to access the requested resource.
const unauthorizedResponse = function (res, msg) {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(401).json(data);
};

module.exports = {
	successResponse,
	successResponseWithData,
	clientErrorResponse,
	validationErrorWithData,
	serverErrorResponse,
	notFoundResponse,
	unauthorizedResponse,
};