/**
 * Routes index
 */

const MainRouter = require("express").Router();
const { apiResponse } = require("../utils");

// Main route

MainRouter.use("/", require("./master"));

// Users routes

MainRouter.use("/users/me", require("./users/me"));
MainRouter.use("/users/userOverview", require("./users/userOverview"));
MainRouter.use("/users/newUsersOverview", require("./users/newUsersOverview"));
MainRouter.use("/users/userPublic", require("./users/userPublic"));

// Projects routes

MainRouter.use("/projects/createProject", require("./projects/createProject"));
MainRouter.use("/projects/project", require("./projects/project"));
MainRouter.use("/projects/projectOverview", require("./projects/projectOverview"));
MainRouter.use("/projects/projectPublic", require("./projects/projectPublic"));

// Signup / Login

MainRouter.use("/auth/sign-up", require("./auth/signup"));
MainRouter.use("/auth/login", require("./auth/login"));
MainRouter.use("/auth/logout", require("./auth/logout"));
MainRouter.use("/auth/forgotPassword", require("./auth/forgotPassword"));
MainRouter.use("/auth/deleteAllTokens", require("./auth/deleteAllTokens"));

// Atlas (general data)

MainRouter.use("/atlas/public", require("./atlas/atlasPublic"));
MainRouter.use("/atlas/internal", require("./atlas/atlasInternal"));

// throw 404 if URL not found
MainRouter.all("*", function (req, res) {
	return apiResponse.notFoundResponse(res, "Page not found");
});

module.exports = MainRouter;
