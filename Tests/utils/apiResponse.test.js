const { apiResponse } = require("../../utils");

const {
	successResponse,
	successResponseWithData,
	clientErrorResponse,
	serverErrorResponse,
	notFoundResponse,
	unauthorizedResponse,
} = apiResponse;

// Mock the Express response object
const mockResponse = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

//successResponse

test("Testing successResponse function with a custom message", () => {
	const res = mockResponse();
	const msg = "Success message";
	successResponse(res, msg);

	expect(res.status).toHaveBeenCalledWith(200);
	expect(res.json).toHaveBeenCalledWith({
		status: 1,
		message: msg,
	});
});

test("Testing successResponse function with a default message", () => {
	const res = mockResponse();
	successResponse(res);

	expect(res.status).toHaveBeenCalledWith(200);
	expect(res.json).toHaveBeenCalledWith({
		status: 1,
		message: expect().toBeUndefined(),
	});
});

//successResponseWithData

test("Testing successResponseWithData function with custom message and data", () => {
	const res = mockResponse();
	const msg = "Success message";
	const data = { key: "value" };
	successResponseWithData(res, msg, data);

	expect(res.status).toHaveBeenCalledWith(200);
	expect(res.json).toHaveBeenCalledWith({
		status: 1,
		message: msg,
		data: data,
	});
});

test("Testing successResponseWithData function with default message and data", () => {
	const res = mockResponse();
	const data = { key: "value" };
	successResponseWithData(res, undefined, data);

	expect(res.status).toHaveBeenCalledWith(200);
	expect(res.json).toHaveBeenCalledWith({
		status: 1,
		message: expect().toBeUndefined(),
		data: data,
	});
});

test("Testing successResponseWithData function with default message and no data", () => {
	const res = mockResponse();
	successResponseWithData(res);

	expect(res.status).toHaveBeenCalledWith(200);
	expect(res.json).toHaveBeenCalledWith({
		status: 1,
		message: expect().toBeUndefined(),
		data: expect().toBeUndefined(),
	});
});

//clientErrorResponse

test("Testing clientErrorResponse function with custom message", () => {
	const res = mockResponse();
	const msg = "Client error message";
	clientErrorResponse(res, msg);

	expect(res.status).toHaveBeenCalledWith(400);
	expect(res.json).toHaveBeenCalledWith({
		status: 0,
		message: msg,
	});
});

test("Testing clientErrorResponse function with default message", () => {
	const res = mockResponse();
	clientErrorResponse(res);

	expect(res.status).toHaveBeenCalledWith(400);
	expect(res.json).toHaveBeenCalledWith({
		status: 0,
		message: expect().toBeUndefined(),
	});
});

//serverErrorResponse

//notFoundResponse

//unauthorizedResponse
