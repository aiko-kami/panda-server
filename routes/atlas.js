/**
 * Atlas routes
 */

const atlasRoute = require("express").Router();

// Atlas public
atlasRoute.get("/public/:dataId", (req, res) => {
	res.json({
		message: `Atlas public ${req.params.dataId} page`,
	});
});

// Atlas internal
atlasRoute.get("/private/:dataId", (req, res) => {
	res.json({
		message: `Atlas internal ${req.params.dataId} page`,
	});
});

// Test set cookies
atlasRoute.get("/setCookies", (req, res) => {
	res.cookie("coOokieName", "coOokieValue");
	res.json({
		message: `Atlas public ${req.params.dataId} page`,
	});
});

module.exports = atlasRoute;
