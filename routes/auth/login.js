/**
 * Login route
 */

const loginRoute = require("express").Router();
const authController = require("../../controllers/auth/auth.controller");

loginRoute.post("/", authController.login);

module.exports = loginRoute;
