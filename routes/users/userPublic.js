/**
 * User public route
 */

const userPublicRoute = require("express").Router();

userPublicRoute.get("/:userId", (req, res) => {
	res.json({
		message: `User ${req.params.userId} public page`,
	});
});

module.exports = userPublicRoute;
