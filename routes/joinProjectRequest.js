/**
 * Join project routes
 */

const joinProjectRoute = require("express").Router();

const { joinProjectRequestController } = require("../controllers");
const { verifyAccess } = require("../middlewares/verifyAccess.middleware");

// Join Project Request
joinProjectRoute.post("/saveDraft", verifyAccess, joinProjectRequestController.saveDraftRequest);
joinProjectRoute.patch("/updateDraft", verifyAccess, joinProjectRequestController.updateDraftRequest);
joinProjectRoute.delete("/removeDraft", verifyAccess, joinProjectRequestController.removeDraftRequest);
joinProjectRoute.post("/send", verifyAccess, joinProjectRequestController.sendRequest);
joinProjectRoute.patch("/cancel", verifyAccess, joinProjectRequestController.cancelRequest);
joinProjectRoute.post("/accept", verifyAccess, joinProjectRequestController.acceptRequest);
joinProjectRoute.post("/refuse", verifyAccess, joinProjectRequestController.refuseRequest);

joinProjectRoute.get("/drafts", verifyAccess, joinProjectRequestController.retrieveDraftsRequests);
joinProjectRoute.get("/all", verifyAccess, joinProjectRequestController.retrieveAllRequests);
joinProjectRoute.get("/:requestId", verifyAccess, joinProjectRequestController.retrieveRequest);

module.exports = joinProjectRoute;
