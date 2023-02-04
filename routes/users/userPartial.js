/**
 * User partial route
 */

const userPartialRoute = require("express").Router();

userPartialRoute.get("/:userId", (req, res) => {
	res.json({
		message: `User ${req.params.userId} partial page`,
	});
});

module.exports = userPartialRoute;
