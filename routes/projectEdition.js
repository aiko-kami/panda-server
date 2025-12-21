/**
 * Project edition routes
 */

const projectRoute = require("express").Router();

const {
	projectEditionController,
	projectCoverController,
	projectRightsController,
	projectController,
	memberController,
	talentNeededController,
	statusController,
	tagController,
	objectiveController,
} = require("../controllers");
const { verifyAccess } = require("../middlewares/verifyAccess.middleware");

// Retrieve user rights for the project
projectRoute.get("/userRights/:projectLink", verifyAccess, projectRightsController.retrieveUserProjectRights);

// Retrieve project data
projectRoute.get("/general/:projectLink", verifyAccess, projectEditionController.retrieveProjectGeneral);
projectRoute.get("/members/:projectLink", verifyAccess, projectEditionController.retrieveProjectMembers);
projectRoute.get("/rights/:projectLink", verifyAccess, projectEditionController.retrieveProjectRights);
projectRoute.get("/status/:projectLink", verifyAccess, projectEditionController.retrieveProjectStatus);
projectRoute.get("/location/:projectLink", verifyAccess, projectEditionController.retrieveProjectLocation);
projectRoute.get("/attachments/:projectLink", verifyAccess, projectEditionController.retrieveProjectAttachments);
projectRoute.get("/steps/:projectLink", verifyAccess, projectEditionController.retrieveProjectSteps);
projectRoute.get("/QAs/:projectLink", verifyAccess, projectEditionController.retrieveProjectQAs);
projectRoute.get("/details/:projectLink", verifyAccess, projectEditionController.retrieveProjectDetails);

// Project update

projectRoute.patch("/titleCategory/:projectId", verifyAccess, projectController.updateProject);
projectRoute.patch("/information/:projectId", verifyAccess, projectController.updateProject);
projectRoute.patch("/cover/:projectId", verifyAccess, projectCoverController.updateCover);
projectRoute.delete("/members/:projectId", verifyAccess, memberController.removeProjectMember);
projectRoute.post("/tag/:projectId", verifyAccess, tagController.addTagToProject);
projectRoute.delete("/tag/:projectId", verifyAccess, tagController.removeTagFromProject);
projectRoute.post("/objective/:projectId", verifyAccess, objectiveController.addObjective);
projectRoute.delete("/objective/:projectId", verifyAccess, objectiveController.removeObjective);
projectRoute.post("/talentNeeded/:projectId", verifyAccess, talentNeededController.addTalentNeeded);
projectRoute.delete("/talentNeeded/:projectId", verifyAccess, talentNeededController.removeTalentNeeded);
// projectRoute.patch("/rights/:projectId", verifyAccess, projectEditionController.updateProjectRights);
projectRoute.patch("/status/:projectId", verifyAccess, statusController.updateProjectStatus);
projectRoute.patch("/visibility/:projectId", verifyAccess, projectController.updateProject);
projectRoute.patch("/location/:projectId", verifyAccess, projectController.updateProject);
// projectRoute.patch("/attachements/:projectId", verifyAccess, projectEditionController.updateProjectAttachements);
// projectRoute.patch("/steps/:projectId", verifyAccess, projectEditionController.updateProjectSteps);
// projectRoute.patch("/QAs/:projectId", verifyAccess, projectEditionController.updateProjectQAs);
// projectRoute.patch("/details/:projectId", verifyAccess, projectEditionController.updateProjectDetails);

module.exports = projectRoute;
