/**
 * Logout route
 */

const logoutRoute = require("express").Router();
const { logoutController } = require("../../controllers");

logoutRoute.get("/", logoutController.logout);

module.exports = logoutRoute;
