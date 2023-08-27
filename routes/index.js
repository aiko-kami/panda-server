/**
 * Routes index
 */

const MainRouter = require("express").Router();
const { apiResponse } = require("../utils");

// Main route
MainRouter.use("/", require("./master"));

// Users routes
MainRouter.use("/users", require("./users"));

// Projects routes
MainRouter.use("/projects", require("./project"));

// Authentification routes
MainRouter.use("/auth", require("./auth"));

// Atlas (general public data)
MainRouter.use("/atlas", require("./atlas"));

// throw 404 if URL not found
MainRouter.all("*", function (req, res) {
	return apiResponse.notFoundResponse(res, "Page not found");
});

module.exports = MainRouter;
