/**
 * Join project routes
 */

const joinProjectRoute = require("express").Router();

const { joinProjectrojectController } = require("../controllers");
const { verifyAccess } = require("../middlewares/verifyAccess.middleware");

// Join Project Request
joinProjectRoute.post("/request/saveDraft", verifyAccess, joinProjectrojectController.saveDraftJoinProjectRequest);
joinProjectRoute.post("/request/updateDraft", verifyAccess, joinProjectrojectController.updateDraftJoinProjectRequest);
joinProjectRoute.post("/request/removeDraft", verifyAccess, joinProjectrojectController.removeDraftJoinProjectRequest);
joinProjectRoute.post("/request/send", verifyAccess, joinProjectrojectController.sendJoinProjectRequest);
joinProjectRoute.post("/request/cancel", verifyAccess, joinProjectrojectController.cancelJoinProjectRequest);
joinProjectRoute.post("/request/accept", verifyAccess, joinProjectrojectController.acceptJoinProjectRequest);
joinProjectRoute.post("/request/refuse", verifyAccess, joinProjectrojectController.refuseJoinProjectRequest);

joinProjectRoute.get("/request/drafts", verifyAccess, joinProjectrojectController.retrieveDraftsJoinProjectRequests);
joinProjectRoute.get("/request/draft/:draftId", verifyAccess, joinProjectrojectController.retrieveDraftJoinProjectRequest);
joinProjectRoute.get("/request/all", verifyAccess, joinProjectrojectController.retrieveAllJoinProjectRequests);
joinProjectRoute.get("/request/:requestId", verifyAccess, joinProjectrojectController.retrieveJoinProjectRequest);

// Join Project Invitation
joinProjectRoute.post("/invitation/saveDraft", verifyAccess, joinProjectrojectController.saveDraftJoinProjectInvitation);
joinProjectRoute.post("/invitation/updateDraft", verifyAccess, joinProjectrojectController.updateDraftJoinProjectInvitation);
joinProjectRoute.post("/invitation/removeDraft", verifyAccess, joinProjectrojectController.removeDraftJoinProjectInvitation);
joinProjectRoute.post("/invitation/send", verifyAccess, joinProjectrojectController.sendJoinProjectInvitation);
joinProjectRoute.post("/invitation/cancel", verifyAccess, joinProjectrojectController.cancelJoinProjectInvitation);
joinProjectRoute.post("/invitation/accept", verifyAccess, joinProjectrojectController.acceptJoinProjectInvitation);
joinProjectRoute.post("/invitation/refuse", verifyAccess, joinProjectrojectController.refuseJoinProjectInvitation);

joinProjectRoute.get("/invitation/drafts", verifyAccess, joinProjectrojectController.retrieveDraftsJoinProjectInvitations);
joinProjectRoute.get("/invitation/draft/:draftId", verifyAccess, joinProjectrojectController.retrieveDraftJoinProjectInvitation);
joinProjectRoute.get("/invitation/all", verifyAccess, joinProjectrojectController.retrieveAllJoinProjectInvitations);
joinProjectRoute.get("/invitation/:requestId", verifyAccess, joinProjectrojectController.retrieveJoinProjectInvitation);

module.exports = joinProjectRoute;
