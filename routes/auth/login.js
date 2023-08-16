/**
 * Login route
 */

const loginRoute = require("express").Router();
const { loginController } = require("../../controllers");

loginRoute.post("/", loginController.login);

module.exports = loginRoute;
