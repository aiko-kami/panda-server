/**
 * Project route
 */

const projectRoute = require("express").Router();

projectRoute
	.get("/:projectId", (req, res) => {
		res.json({
			message: `Project ${req.params.projectId} page (get)`,
		});
	})
	.put("/:projectId", (req, res) => {
		res.json({
			message: `Project ${req.params.projectId} page (put)`,
		});
	});

module.exports = projectRoute;
