/**
 * Logout route
 */

const logoutRoute = require("express").Router();

logoutRoute.post("/", (req, res) => {
	res.json({
		message: "Logout page",
	});
});

module.exports = logoutRoute;
