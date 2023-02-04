/**
 * Project partial route
 */

const projectPartialRoute = require("express").Router();

projectPartialRoute.get("/:projectId", (req, res) => {
	res.json({
		message: `Project ${req.params.projectId} partial page`,
	});
});

module.exports = projectPartialRoute;
