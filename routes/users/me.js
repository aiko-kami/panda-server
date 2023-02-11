/**
 * User me route
 */

const meRoute = require("express").Router();

const MongoClient = require("mongodb").MongoClient;
const email = "adrian-loup@hotmail.fr";
meRoute
	.get("/", async (req, res) => {
		//Connect with database
		const client = await MongoClient.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		const db = client.db(process.env.DB_PRIVATE);

		//Check if email already exists
		const checkEmailExisting = await db.collection("users").findOne({ email });
		console.log(checkEmailExisting);

		res.json({
			message: "My page (get)",
		});
	})
	.put("/", (req, res) => {
		res.json({
			message: "My page (put)",
		});
	});

module.exports = meRoute;
