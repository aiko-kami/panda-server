/**
 * Signup route
 */

const signupRoute = require("express").Router();

signupRoute.post("/", (req, res) => {
	res.json({
		message: "Signup page",
	});
});

module.exports = signupRoute;
