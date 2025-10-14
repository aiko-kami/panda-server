/**
 * Project edition routes
 */

const projectRoute = require("express").Router();

const { projectEditionController } = require("../controllers");
const { verifyAccess } = require("../middlewares/verifyAccess.middleware");

// Retrieve project data
// projectRoute.get("/general/:projectId", verifyAccess, projectEditionController.retrieveProjectGeneral);
// projectRoute.get("/members/:projectId", verifyAccess, projectEditionController.retrieveProjectMembers);
// projectRoute.get("/rights/:projectId", verifyAccess, projectEditionController.retrieveProjectRights);
// projectRoute.get("/status/:projectId", verifyAccess, projectEditionController.retrieveProjectStatus);
projectRoute.get("/location/:projectId", verifyAccess, projectEditionController.retrieveProjectLocation);
// projectRoute.get("/attachements/:projectId", verifyAccess, projectEditionController.retrieveProjectAttachements);
// projectRoute.get("/steps/:projectId", verifyAccess, projectEditionController.retrieveProjectSteps);
// projectRoute.get("/QAs/:projectId", verifyAccess, projectEditionController.retrieveProjectQAs);
// projectRoute.get("/details/:projectId", verifyAccess, projectEditionController.retrieveProjectDetails);

// Project update
// projectRoute.patch("/general/:projectId", verifyAccess, projectEditionController.updateProjectGeneral);
// projectRoute.patch("/members/:projectId", verifyAccess, projectEditionController.updateProjectMembers);
// projectRoute.patch("/rights/:projectId", verifyAccess, projectEditionController.updateProjectRights);
// projectRoute.patch("/status/:projectId", verifyAccess, projectEditionController.updateProjectStatus);
// projectRoute.patch("/location/:projectId", verifyAccess, projectEditionController.updateProjectLocation);
// projectRoute.patch("/attachements/:projectId", verifyAccess, projectEditionController.updateProjectAttachements);
// projectRoute.patch("/steps/:projectId", verifyAccess, projectEditionController.updateProjectSteps);
// projectRoute.patch("/QAs/:projectId", verifyAccess, projectEditionController.updateProjectQAs);
// projectRoute.patch("/details/:projectId", verifyAccess, projectEditionController.updateProjectDetails);

module.exports = projectRoute;
