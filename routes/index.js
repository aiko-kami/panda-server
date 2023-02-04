/**
 * Routes index
 */

const MainRouter = require("express").Router();

// Main route

MainRouter.use("/", require("./master"));

// Users routes

MainRouter.use("/users/me", require("./users/me"));
MainRouter.use("/users/userPartial/:userId", require("./users/userPartial"));
MainRouter.use("/users/userPublic/:userId", require("./users/userPartial"));

// Projects routes

// MainRouter.use("/projects", require("./projects"));

// Signup / Login

MainRouter.use("/signup", require("./auth/signup"));
MainRouter.use("/login", require("./auth/login"));

module.exports = MainRouter;
