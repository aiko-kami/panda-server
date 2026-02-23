/**
 * Project extended routes
 */

const projectExtendedRoute = require("express").Router();

const {
	memberController,
	projectRightsController,
	projectAttachmentsController,
	statusController,
	projectCrushController,
	projectCoverController,
	projectLikeController,
	projectStepsController,
	projectQAController,
	commentController,
} = require("../controllers");
const { verifyAccess, verifyAdminAccess, verifyUserPresence } = require("../middlewares/verifyAccess.middleware");

// Project cover
projectExtendedRoute.post("/updateProjectCover/:projectId", verifyAccess, projectCoverController.updateCover);

// Project attachments
projectExtendedRoute.post("/addProjectAttachment/:projectId", verifyAccess, projectAttachmentsController.addProjectAttachment);
projectExtendedRoute.patch("/editProjectAttachment/:projectId", verifyAccess, projectAttachmentsController.RenameProjectAttachment);
projectExtendedRoute.delete("/removeProjectAttachment/:projectId", verifyAccess, projectAttachmentsController.deleteProjectAttachment);
projectExtendedRoute.get("/projectAttachments/:projectId", verifyAccess, projectAttachmentsController.retrieveProjectAttachments);
projectExtendedRoute.get("/projectAttachment/:projectId", verifyAccess, projectAttachmentsController.retrieveProjectAttachment);

// Project crush
projectExtendedRoute.patch("/addProjectCrush", verifyAdminAccess, projectCrushController.addCrush);
projectExtendedRoute.patch("/removeProjectCrush", verifyAdminAccess, projectCrushController.removeCrush);
projectExtendedRoute.get("/crushProjects", projectCrushController.retrieveCrushProjects);

// Project like
projectExtendedRoute.patch("/likeProject/:projectId", verifyAccess, projectLikeController.likeProject);
projectExtendedRoute.patch("/unlikeProject/:projectId", verifyAccess, projectLikeController.unlikeProject);
projectExtendedRoute.get("/projectsUserPublicLikes", verifyAccess, projectLikeController.retrieveUserPublicLikes);
projectExtendedRoute.get("/projectsUserPrivateLikes", verifyAccess, projectLikeController.retrieveUserPrivateLikes);
projectExtendedRoute.get("/projectLikes", projectLikeController.retrieveProjectLikes);

// Project steps
projectExtendedRoute.patch("/addProjectSteps", verifyAccess, projectStepsController.addSteps);
projectExtendedRoute.patch("/editProjectSteps", verifyAccess, projectStepsController.updateSteps);
projectExtendedRoute.patch("/publishProjectStep", verifyAccess, projectStepsController.publishStep);
projectExtendedRoute.patch("/unpublishProjectStep", verifyAccess, projectStepsController.unpublishStep);
projectExtendedRoute.delete("/removeProjectStep", verifyAccess, projectStepsController.removeStep);
projectExtendedRoute.get("/projectStepsPublished", projectStepsController.retrieveProjectStepsPublished);
projectExtendedRoute.get("/projectStepsAll", verifyAccess, projectStepsController.retrieveProjectStepsAll);

// Project Q and A
projectExtendedRoute.patch("/addProjectQAs", verifyAccess, projectQAController.addQAs);
projectExtendedRoute.patch("/editProjectQAs", verifyAccess, projectQAController.updateQAs);
projectExtendedRoute.patch("/publishProjectQA", verifyAccess, projectQAController.publishQA);
projectExtendedRoute.patch("/unpublishProjectQA", verifyAccess, projectQAController.unpublishQA);
projectExtendedRoute.delete("/removeProjectQA", verifyAccess, projectQAController.removeQA);
projectExtendedRoute.get("/projectQAsPublished", projectQAController.retrieveProjectQAsPublished);
projectExtendedRoute.get("/projectQAsAll", verifyAccess, projectQAController.retrieveProjectQAsAll);

// Project comments
projectExtendedRoute.post("/addProjectComment", verifyAccess, commentController.addComment);
projectExtendedRoute.post("/answerProjectComment", verifyAccess, commentController.answerComment);
projectExtendedRoute.patch("/editProjectComment", verifyAccess, commentController.editComment);
projectExtendedRoute.delete("/removeProjectComment", verifyAccess, commentController.removeComment);

projectExtendedRoute.patch("/reportProjectComment", verifyAccess, commentController.reportComment);
projectExtendedRoute.patch("/unreportProjectComment", verifyAccess, commentController.unreportComment);

projectExtendedRoute.patch("/likeProjectComment", verifyAccess, commentController.likeComment);
projectExtendedRoute.patch("/unlikeProjectComment", verifyAccess, commentController.unlikeComment);

projectExtendedRoute.patch("/dislikeProjectComment", verifyAccess, commentController.dislikeComment);
projectExtendedRoute.patch("/undislikeProjectComment", verifyAccess, commentController.undislikeComment);

projectExtendedRoute.get("/projectComments/:projectId", verifyUserPresence, commentController.retrieveProjectComments);

// User's rights
projectExtendedRoute.patch("/projectUserRights/:projectId", verifyAccess, projectRightsController.updateUserProjectRights);

// Project members
projectExtendedRoute.patch("/projectMembers/update/:projectId", verifyAccess, memberController.updateProjectMember);
projectExtendedRoute.delete("/projectMembers/remove/:projectId", verifyAccess, memberController.removeProjectMember);

// Project status
projectExtendedRoute.patch("/projectStatus/:projectId", verifyAccess, statusController.updateProjectStatus);
projectExtendedRoute.get("/projectStatus/projectId/:projectId", verifyAccess, statusController.retrieveProjectStatusInfo);
projectExtendedRoute.get("/projectStatus/statusById/:projectStatusId", statusController.retrieveProjectStatusWithId);
projectExtendedRoute.get("/projectStatus/statusByName/:projectStatusName", statusController.retrieveProjectStatusWithName);
projectExtendedRoute.get("/projectStatus/all/projectStatuses", statusController.retrieveAllProjectStatuses);

// Project status admin
projectExtendedRoute.post("/projectStatusAdmin/projectStatus", verifyAdminAccess, statusController.createProjectStatus);
projectExtendedRoute.patch("/projectStatusAdmin/:projectStatusId", verifyAdminAccess, statusController.editProjectStatus);
projectExtendedRoute.delete("/projectStatusAdmin/:projectStatusId", verifyAdminAccess, statusController.removeProjectStatus);

// Project status admin
projectExtendedRoute.post("/joinProjectStatusAdmin/joinProjectStatus", statusController.createJoinProjectStatus);
projectExtendedRoute.patch("/joinProjectStatusAdmin/:joinProjectStatusId", verifyAdminAccess, statusController.editJoinProjectStatus);
projectExtendedRoute.delete("/joinProjectStatusAdmin/:joinProjectStatusId", verifyAdminAccess, statusController.removeJoinProjectStatus);

module.exports = projectExtendedRoute;
