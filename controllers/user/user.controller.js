const MongoClient = require("mongodb").MongoClient;
const { apiResponse } = require("../../utils");
const { userService, tokenService } = require("../../services");

const getMyUserData = async (req, res) => {
	try {
		userService
			.retrieveUserById(
				req.body.userId,
				"username email createdAt location company description bio languages website profilePicture"
			)
			.then((user) => {
				// Send response with my user data
				return apiResponse.successResponseWithData(res, "Operation success.", user);
			});
	} catch (error) {
		// Throw error in json response with status 500.
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const getUser = async (req, res) => {
	// Validate request
	if (!req.body.email) {
		return apiResponse.clientErrorResponse(res, "Content can not be empty.");
	}

	const email = req.body.email;

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

// Get 4 new users
const getNewUsers = async (req, res) => {
	try {
		const newUsers = await userService.retrieveNewUsers(4, "username profilePicture description");
		if (newUsers !== null && newUsers.length > 0) {
			return apiResponse.successResponseWithData(res, "Operation success.", newUsers);
		} else {
			return apiResponse.successResponse(res, "No user found.");
		}
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

// Login user
const loginUser = async (req, res) => {
	const token = tokenService.generateToken(4, parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES));
	return apiResponse.successResponseWithData(res, "Operation success.", token);
};

module.exports = {
	getMyUserData,
	getUser,
	updateUser,
	getNewUsers,
	loginUser,
};
