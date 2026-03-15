/**
 * Tests routes
 */

const testsRoute = require("express").Router();

const { testsController } = require("../controllers");

// Tags
testsRoute.get("/standardTest", testsController.standardTest);
testsRoute.get("/generateId/:id", testsController.generateId);

module.exports = testsRoute;
