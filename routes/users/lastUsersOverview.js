/**
 * New User Overview route
 */

const lastUsersOverviewRoute = require("express").Router();
const userController = require("../../controllers/user/user.controller");

lastUsersOverviewRoute.get("/", userController.getNewUsers);

module.exports = lastUsersOverviewRoute;
