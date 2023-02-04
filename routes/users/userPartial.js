/**
 * User partial route
 */

const userPartialRoute = require("express").Router();

userPartialRoute.get("/", (req, res) => {
	res.json({
		message: "User partial page",
	});
});

module.exports = userPartialRoute;
