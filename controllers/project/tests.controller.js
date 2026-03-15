const { apiResponse, encryptTools } = require("../../utils");

const generateId = async (req, res) => {
	try {
		const { id = "" } = req.params;

		// Convert id to ObjectId
		const objectIdId = encryptTools.convertObjectIdToId(id);
		if (objectIdId.status == "error") {
			return { status: "error", message: objectIdId.message };
		}

		return apiResponse.successResponseWithData(res, "Object ID generated successfully.", { ObjectId: objectIdId });
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const standardTest = async (req, res) => {
	try {
		return apiResponse.successResponseWithData(res, "Standard test completed successfully.", { result: "Test passed" });
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	generateId,
	standardTest,
};
