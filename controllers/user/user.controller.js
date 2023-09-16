const MongoClient = require("mongodb").MongoClient;
const { apiResponse } = require("../../utils");
const { userService } = require("../../services");

const retrieveMyUserData = async (req, res) => {
	try {
		const { userId = "" } = req.userId;

		console.log("🚀 ~ retrieveMyUserData ~ userId:", userId);

		userService
			.retrieveUserById(
				userId,
				"-_id username email createdAt location company description bio languages website profilePicture"
			)
			.then((user) => {
				// Send response with my user data
				return apiResponse.successResponseWithData(res, "User data retrieved successfully.", user);
			});
	} catch (error) {
		// Throw error in json response with status 500.
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveUser = async (req, res) => {
	const { email = "" } = req.body;

	// Validate request
	if (!email) {
		return apiResponse.clientErrorResponse(res, "Content can not be empty.");
	}

	// Connect to database
	const client = await MongoClient.connect(process.env.MONGODB_URI_PRIVATE, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	const db = client.db(process.env.DB_PRIVATE);

	// Check if email already exists
	const checkEmailExisting = await db.collection("users").findOne({ email });

	return apiResponse.successResponseWithData(res, checkEmailExisting);
};

const updateUser = async (req, res) => {
	res.json({
		message: "My page (put)",
	});
};

// Retrieve 4 new users
const retrieveNewUsers = async (req, res) => {
	try {
		const newUsers = await userService.retrieveNewUsers(4, "username profilePicture description");

		if (newUsers.users !== null && newUsers.users.length > 0) {
			return apiResponse.successResponseWithData(
				res,
				"New users retrieved successfully.",
				newUsers.users
			);
		} else {
			return apiResponse.successResponse(res, newUsers.message);
		}
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	retrieveMyUserData,
	retrieveUser,
	updateUser,
	retrieveNewUsers,
};
