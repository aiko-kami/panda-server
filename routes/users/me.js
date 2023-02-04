/**
 * User me route
 */

const meRoute = require("express").Router();

meRoute
	.get("/", (req, res) => {
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
