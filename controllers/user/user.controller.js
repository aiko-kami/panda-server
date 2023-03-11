const MongoClient = require("mongodb").MongoClient;
const apiResponse = require("../../utils/apiResponses");
const { userService } = require("../../services");

const getMyUserData = async (req, res) => {
	try {
		userService
			.retrieveUserById(
				req.body.userId,
				"username email createdAt location company description bio languages website profilePicture"
			)
			.then((user) => {
				// Send response with my user data
				return apiResponse.successResponseWithData(res, "Operation success", user);
			});
	} catch (err) {
		// Throw error in json response with status 500.
		return apiResponse.ServerErrorResponse(res, err);
	}
};

const getUser = async (req, res) => {
	// Validate request
	if (!req.body.email) {
		return apiResponse.ClientErrorResponse(res, "Content can not be empty!");
	}

	const email = req.body.email;

	// Connect to database
	const client = await MongoClient.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	const db = client.db(process.env.DB_PRIVATE);

	// Check if email already exists
	const checkEmailExisting = await db.collection("users").findOne({ email });
	console.log(checkEmailExisting);

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
		userService.retrieveNewUsers(4, "username profilePicture description").then((newUsers) => {
			if (newUsers !== null) {
				return apiResponse.successResponseWithData(res, "Operation success", newUsers);
			} else {
				return apiResponse.successResponseWithData(res, "Operation success", {});
			}
		});
	} catch (err) {
		// Throw error in json response with status 500.
		return apiResponse.ServerErrorResponse(res, err);
	}
};

module.exports = {
	getMyUserData,
	getUser,
	updateUser,
	getNewUsers,
};
