const MongoClient = require("mongodb").MongoClient;
const apiResponse = require("../utils/apiResponses");

const getUser = async (req, res) => {
	// Validate request
	if (!req.body.email) {
		return apiResponse.ClientErrorResponse(res, "Content can not be empty!");
	}

	const email = req.body.email;

	//Connect to database
	const client = await MongoClient.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	const db = client.db(process.env.DB_PRIVATE);

	//Check if email already exists
	const checkEmailExisting = await db.collection("users").findOne({ email });
	console.log(checkEmailExisting);

	return apiResponse.successResponseWithData(res, checkEmailExisting);
};

const updateUser = async (req, res) => {
	res.json({
		message: "My page (put)",
	});
};

module.exports = {
	getUser,
	updateUser,
};
