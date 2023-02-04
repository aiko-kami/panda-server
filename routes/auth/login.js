/**
 * Login route
 */

const loginRoute = require("express").Router();

loginRoute.post("/", (req, res) => {
	res.json({
		message: "Login page",
	});
});

module.exports = loginRoute;
