/**
 * Project Overview route
 */

const projectOverviewRoute = require("express").Router();

projectOverviewRoute.get("/:projectId", (req, res) => {
	res.json({
		message: `Project ${req.params.projectId} overview page`,
	});
});

module.exports = projectOverviewRoute;
