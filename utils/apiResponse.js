/**
 * Sends a success response with status code 200 (OK) and an optional message.
 *
 * @param {Object} res - The HTTP response object.
 * @param {string} msg - An optional message to include in the response.
 * @returns {Object} - The JSON response with status code 200 and a success message.
 */
const successResponse = (res, msg) => {
	const data = {
		status: 1,
		message: msg,
	};
	return res.status(200).json(data);
};

/**
 * Sends a success response with status code 200 (OK) with additional data.
 *
 * @param {Object} res - The HTTP response object.
 * @param {string} msg - An optional message to include in the response.
 * @param {any} data - Additional data to include in the response.
 * @returns {Object} - The JSON response with status code 200 and a success message, and the provided data.
 */
const successResponseWithData = (res, msg, data) => {
	const resData = {
		status: 1,
		message: msg,
		data: data,
	};
	return res.status(200).json(resData);
};

/**
 * Sends a client error response (e.g., user input errors, validation error, unauthorized access, etc.) with status code 400 (Bad Request) and a specified message.
 *
 * @param {Object} res - The HTTP response object.
 * @param {string} msg - The error message describing the client error.
 * @returns {Object} - The JSON response with status code 400 and the error message.
 */
const clientErrorResponse = (res, msg) => {
	const data = {
		status: 0,
		message: msg,
	};
	return res.status(400).json(data);
};

/**
 * Sends a server error response (e.g., internal server error, database connection failure, etc.) with status code 500 (Internal Server Error) and a specified message.
 *
 * @param {Object} res - The HTTP response object.
 * @param {string} msg - The error message describing the server error.
 * @returns {Object} - The JSON response with status code 500 and the error message.
 */
const serverErrorResponse = (res, msg) => {
	const data = {
		status: 0,
		message: msg,
	};
	return res.status(500).json(data);
};

/**
 * Sends a not found error response with status code 404 (Not Found) and a specified message.
 *
 * @param {Object} res - The HTTP response object.
 * @param {string} msg - The error message indicating that the requested resource was not found.
 * @returns {Object} - The JSON response with status code 404 and the error message.
 */
const notFoundResponse = (res, msg) => {
	const data = {
		status: 0,
		message: msg,
	};
	return res.status(404).json(data);
};

/**
 * Sends an unauthorized error response (user not allowed to access the requested resource) with status code 401 (Unauthorized) and a specified message.
 *
 * @param {Object} res - The HTTP response object.
 * @param {string} msg - The error message indicating unauthorized access.
 * @returns {Object} - The JSON response with status code 401 and the error message.
 */
const unauthorizedResponse = function (res, msg) {
	const data = {
		status: 0,
		message: msg,
	};
	return res.status(401).json(data);
};

module.exports = {
	successResponse,
	successResponseWithData,
	clientErrorResponse,
	serverErrorResponse,
	notFoundResponse,
	unauthorizedResponse,
};
