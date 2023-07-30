/**
 * Login route
 */

const loginRoute = require("express").Router();
const loginController = require("../../controllers/loginController");

loginRoute.post("/", loginController.login);

module.exports = loginRoute;
