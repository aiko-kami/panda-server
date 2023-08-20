/**
 * New User Overview route
 */

const newUsersOverviewRoute = require("express").Router();
const userController = require("../../controllers/user/user.controller");

newUsersOverviewRoute.get("/", userController.getNewUsers);

module.exports = newUsersOverviewRoute;
