/**
 * Project core routes
 */

const projectRoute = require("express").Router();

const { projectController } = require("../controllers");
const { verifyAccess } = require("../middlewares/verifyAccess.middleware");

// Project creation
projectRoute.post("/createProjectDraft", verifyAccess, projectController.createProject);
projectRoute.post("/updateProjectDraft/:projectId", verifyAccess, projectController.createProject);
projectRoute.post("/submitProject", verifyAccess, projectController.createProject);

// Project update
projectRoute.patch("/updateProject/:projectId", verifyAccess, projectController.updateProject);

// Retrieve project data
projectRoute.get("/projectData/:projectId", verifyAccess, projectController.retrieveProjectData);
projectRoute.get("/projectOverview/:projectId", projectController.retrieveProjectOverview);
projectRoute.get("/projectPublic/:projectId", projectController.retrieveProjectPublicData);
projectRoute.get("/lastProjectsOverview", projectController.retrieveNewProjects);

// Count projects
projectRoute.get("/nbProjects", projectController.countProjects);
projectRoute.get("/nbProjectsPerCategory", projectController.countProjectsPerCategory);

module.exports = projectRoute;
