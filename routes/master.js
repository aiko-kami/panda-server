/**
 * Master route (main route)
 */

const masterRoute = require("express").Router();

// Atlas public
masterRoute.get("/", (req, res) => {
	res.json({
		message: "Welcome to Panda-01 Server application.",
	});
});

module.exports = masterRoute;
