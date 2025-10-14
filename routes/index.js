/**
 * Routes index
 */

const MainRouter = require("express").Router();
const { apiResponse } = require("../utils");

// Main route
MainRouter.use("/", require("./home"));

// Users routes
MainRouter.use("/users", require("./users"));

// Projects routes
MainRouter.use("/projects", require("./projectCore"));
MainRouter.use("/projectsExtended", require("./projectsExtended"));
MainRouter.use("/projectEdition", require("./projectEdition"));

// Categories routes
MainRouter.use("/cat", require("./categories"));

// Join project routes
MainRouter.use("/joinProject/request", require("./joinProjectRequest"));
MainRouter.use("/joinProject/invitation", require("./joinProjectInvitation"));

// Authentification routes
MainRouter.use("/auth", require("./auth"));

// Atlas (general public data)
MainRouter.use("/atlas", require("./atlas"));

// throw 404 if URL not found
MainRouter.all("/*splat", function (req, res) {
	return apiResponse.notFoundResponse(res, "Page not found");
});

module.exports = MainRouter;
