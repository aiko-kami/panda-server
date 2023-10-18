/**
 * Join project routes
 */

const joinProjectRoute = require("express").Router();

const { joinProjectrojectController } = require("../controllers");
const { verifyAccess } = require("../middlewares/verifyAccess.middleware");

// Join Project (request and invitation)
joinProjectRoute.post("/request/saveDraft", verifyAccess, joinProjectrojectController.saveDraftJoinProjectRequest);
joinProjectRoute.post("/request/updateDraft", verifyAccess, joinProjectrojectController.saveDraftJoinProjectRequest);
joinProjectRoute.post("/request/removeDraft", verifyAccess, joinProjectrojectController.saveDraftJoinProjectRequest);
joinProjectRoute.post("/request/send", verifyAccess, joinProjectrojectController.sendJoinProjectRequest);
joinProjectRoute.post("/request/cancel", verifyAccess, joinProjectrojectController.sendJoinProjectRequest);
joinProjectRoute.post("/request/accept", verifyAccess, joinProjectrojectController.sendJoinProjectRequest);
joinProjectRoute.post("/request/refuse", verifyAccess, joinProjectrojectController.sendJoinProjectRequest);
joinProjectRoute.post("/invitation/saveDraft", verifyAccess, joinProjectrojectController.saveDraftJoinProjectInvitation);
joinProjectRoute.post("/invitation/updateDraft", verifyAccess, joinProjectrojectController.saveDraftJoinProjectInvitation);
joinProjectRoute.post("/invitation/removeDraft", verifyAccess, joinProjectrojectController.saveDraftJoinProjectInvitation);
joinProjectRoute.post("/invitation/send", verifyAccess, joinProjectrojectController.sendJoinProjectInvitation);
joinProjectRoute.post("/invitation/cancel", verifyAccess, joinProjectrojectController.sendJoinProjectInvitation);
joinProjectRoute.post("/invitation/accept", verifyAccess, joinProjectrojectController.sendJoinProjectInvitation);
joinProjectRoute.post("/invitation/refuse", verifyAccess, joinProjectrojectController.sendJoinProjectInvitation);

module.exports = joinProjectRoute;
