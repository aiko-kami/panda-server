/**
 * User Overview route
 */

const userOverviewRoute = require("express").Router();

userOverviewRoute.get("/:userId", (req, res) => {
	res.json({
		message: `User ${req.params.userId} overview page`,
	});
});

module.exports = userOverviewRoute;
