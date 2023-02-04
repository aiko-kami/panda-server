/**
 * Routes index
 */

const MainRouter = require("express").Router();

// Main route

MainRouter.use("/", require("./master"));

// Users routes

MainRouter.use("/users/me", require("./users/me"));
MainRouter.use("/users/userPartial", require("./users/userPartial"));
MainRouter.use("/users/userPublic", require("./users/userPublic"));

// Projects routes

MainRouter.use("/projects/createProject", require("./projects/createProject"));
MainRouter.use("/projects/project", require("./projects/project"));
MainRouter.use("/projects/projectPartial", require("./projects/projectPartial"));
MainRouter.use("/projects/projectPublic", require("./projects/projectPublic"));

// Signup / Login

MainRouter.use("/auth/signup", require("./auth/signup"));
MainRouter.use("/auth/login", require("./auth/login"));
MainRouter.use("/auth/logout", require("./auth/logout"));

// Atlas (general data)

MainRouter.use("/atlas/public", require("./atlas/atlasPublic"));
MainRouter.use("/atlas/internal", require("./atlas/atlasInternal"));

module.exports = MainRouter;
