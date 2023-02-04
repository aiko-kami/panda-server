/**
 * Routes projects index
 */

const MainProjectsRouter = require("express").Router();

MainProjectsRouter.use("/register", require("./user-register"));

module.exports = MainProjectsRouter;
