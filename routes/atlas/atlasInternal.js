/**
 * Atlas internal route
 */

const atlasInternalRoute = require("express").Router();

atlasInternalRoute.get("/:dataId", (req, res) => {
	res.json({
		message: `Atlas internal ${req.params.dataId} page`,
	});
});

module.exports = atlasInternalRoute;
