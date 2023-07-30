/**
 * Logout route
 */

const logoutRoute = require("express").Router();
const logoutController = require("../../controllers/logoutController");

logoutRoute.post("/", logoutController.logout);

module.exports = logoutRoute;
