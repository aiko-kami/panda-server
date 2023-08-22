/**
 * Create project category route
 */

const createCategoryRoute = require("express").Router();
const { categoryController } = require("../../controllers");

createCategoryRoute.post("/", categoryController.createCategory);

module.exports = createCategoryRoute;
