/**
 * Project routes
 */

const projectRoute = require("express").Router();

const { projectController, categoryController } = require("../controllers");
const { verifyAccess } = require("../middlewares/verifyAccess.middleware");

projectRoute.post("/project", verifyAccess, projectController.createProject);
projectRoute.patch("/project/:projectId", projectController.createProject);
projectRoute.get("/project/:projectId", projectController.createProject);
projectRoute.post("/project/submit/:projectId", projectController.createProject);
projectRoute.get("/projectOverview/:projectId", projectController.createProject);
projectRoute.get("/projectPublic/:projectId", projectController.createProject);

projectRoute.post("/category", categoryController.createCategory);
projectRoute.patch("/category", categoryController.updateCategory);
projectRoute.delete("/category", categoryController.removeCategory);

module.exports = projectRoute;
