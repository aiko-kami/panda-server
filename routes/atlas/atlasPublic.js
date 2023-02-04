/**
 * Atlas public route
 */

const atlasPublicRoute = require("express").Router();

atlasPublicRoute.get("/:dataId", (req, res) => {
	res.json({
		message: `Atlas public ${req.params.dataId} page`,
	});
});

module.exports = atlasPublicRoute;
