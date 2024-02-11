/**
 * Project core routes
 */

const projectRoute = require("express").Router();

const { projectController } = require("../controllers");
const { verifyAccess, verifyAdminAccess } = require("../middlewares/verifyAccess.middleware");

// Project creation
// createProjectDraft, updateProjectDraft, removeProjectDraft to be completed
// submitProject to be refactor a bit
projectRoute.post("/createProjectDraft", verifyAccess, projectController.createProjectDraft);
projectRoute.patch("/updateProjectDraft/:projectId", verifyAccess, projectController.updateProjectDraft);
projectRoute.delete("/removeProjectDraft/:projectId", verifyAccess, projectController.removeProjectDraft);
projectRoute.post("/submitProject", verifyAccess, projectController.submitProject);
projectRoute.post("/processProjectApproval", verifyAdminAccess, projectController.processProjectApproval);

// Project update
projectRoute.patch("/updateProject/:projectId", verifyAccess, projectController.updateProject);
projectRoute.patch("/updateProjectDraftSection/:projectId", verifyAccess, projectController.updateProjectDraftSection);

// Retrieve project data
projectRoute.get("/projectData/:projectId", verifyAccess, projectController.retrieveProjectData);
projectRoute.get("/projectOverview/:projectId", projectController.retrieveProjectOverview);
projectRoute.get("/projectPublic/:projectId", projectController.retrieveProjectPublicData);
projectRoute.get("/lastProjectsOverview", projectController.retrieveNewProjects);
projectRoute.get("/submittedProjects", verifyAdminAccess, projectController.retrieveSubmittedProjects);

// Count projects
projectRoute.get("/nbProjects", projectController.countProjects);
projectRoute.get("/nbProjectsPerCategory", projectController.countProjectsPerCategory);

module.exports = projectRoute;
