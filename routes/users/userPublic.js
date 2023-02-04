/**
 * User publicroute
 */

const userPublicRoute = require("express").Router();

userPublicRoute.get("/", (req, res) => {
	res.json({
		message: "User public page",
	});
});

module.exports = userPublicRoute;
