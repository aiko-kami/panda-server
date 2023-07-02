/**
 * Logout route
 */

const logoutRoute = require("express").Router();
const authController = require("../../controllers/auth/auth.controller");

logoutRoute.post("/", authController.logout);

module.exports = logoutRoute;
