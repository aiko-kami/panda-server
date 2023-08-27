/**
 * Project routes
 */

const projectRoute = require("express").Router();

const { projectController, categoryController } = require("../controllers");

projectRoute.post("/project", projectController.createProject);
projectRoute.patch("/project/:projectId", projectController.createProject);
projectRoute.get("/project/:projectId", projectController.createProject);
projectRoute.get("/projectOverview/:projectId", projectController.createProject);
projectRoute.get("/projectPublic/:projectId", projectController.createProject);

projectRoute.post("/category", categoryController.createCategory);
projectRoute.patch("/category", categoryController.updateCategory);
projectRoute.delete("/category", categoryController.removeCategory);

module.exports = projectRoute;
