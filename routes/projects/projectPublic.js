/**
 * Project public route
 */

const projectPublicRoute = require("express").Router();

projectPublicRoute.get("/:projectId", (req, res) => {
	res.json({
		message: `Project ${req.params.projectId} public page`,
	});
});

module.exports = projectPublicRoute;
