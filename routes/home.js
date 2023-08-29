/**
 * Home route (main route)
 */

const homeRoute = require("express").Router();

homeRoute.get("/", (req, res) => {
	res.json({
		message: "Welcome to Panda-01 Server application.",
	});
});

module.exports = homeRoute;
