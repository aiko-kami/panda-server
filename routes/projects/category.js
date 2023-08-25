/**
 * Project category routes
 */

const categoryRoute = require("express").Router();
const { categoryController } = require("../../controllers");

categoryRoute.post("/", categoryController.createCategory);
categoryRoute.patch("/", categoryController.updateCategory);
categoryRoute.delete("/", categoryController.removeCategory);

module.exports = categoryRoute;
