const { tagService, userRightsService } = require("../../services");
const { apiResponse, tagValidation } = require("../../utils");

const createTag = async (req, res) => {
	try {
		const { tagName = "", description = "" } = req.body;

		// Validate input data for creating a tag
		const validationInputsResult = tagValidation.validateTagInputs(tagName, description);
		if (validationInputsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationInputsResult.message);
		}

		// Call the service to create the tag
		const createdTag = await tagService.createTag(tagName, description);
		if (createdTag.status !== "success") {
			return apiResponse.serverErrorResponse(res, createdTag.message);
		}

		return apiResponse.successResponseWithData(res, createdTag.message, { tag: createdTag });
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const createTags = async (req, res) => {
	try {
		const { tags } = req.body;

		// Validate input data for creating a tag
		const validationInputsResult = tagValidation.validateNewTagsInputs(tags);
		if (validationInputsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationInputsResult.message);
		}

		// Call the service to create the tag
		const createdTags = await tagService.createTags(tags);
		if (createdTags.status !== "success") {
			return apiResponse.serverErrorResponse(res, createdTags.message);
		}

		return apiResponse.successResponseWithData(res, createdTags.message, { tags: createdTags });
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const updateTag = async (req, res) => {
	try {
		const { tagId = "", tagNewName = "", tagNewDescription = "" } = req.body;

		// Validate input data for updating a tag
		const validationIdResult = tagValidation.validateTagId(tagId);
		if (validationIdResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationIdResult.message);
		}

		const validationResult = tagValidation.validateTagInputs(tagNewName, tagNewDescription);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Call the service to update the tag
		const updatedTag = await tagService.updateTag(tagId, tagNewName, tagNewDescription);
		if (updatedTag.status !== "success") {
			return apiResponse.serverErrorResponse(res, updatedTag.message);
		}

		return apiResponse.successResponseWithData(res, updatedTag.message, updatedTag);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const removeTag = async (req, res) => {
	try {
		const { tagId = "" } = req.body;

		// Validate input data for removing a tag
		const validationResult = tagValidation.validateTagId(tagId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Call the service to remove the tag
		const removedTag = await tagService.removeTag(tagId);
		if (removedTag.status !== "success") {
			return apiResponse.serverErrorResponse(res, removedTag.message);
		}

		return apiResponse.successResponseWithData(res, removedTag.message, removedTag);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveTagWithId = async (req, res) => {
	try {
		const { tagId } = req.params;

		// Validate input data for creating a tag
		const validationResult = tagValidation.validateTagId(tagId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Call the service to retrieve the tag
		const retrievedTag = await tagService.retrieveTagById(tagId, ["-_id", "name", "description", "link", "tagId"]);
		if (retrievedTag.status !== "success") {
			return apiResponse.serverErrorResponse(res, retrievedTag.message);
		}

		return apiResponse.successResponseWithData(res, retrievedTag.message, retrievedTag);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveTagWithLink = async (req, res) => {
	try {
		const { tagLink } = req.params;

		// Validate input data for creating a tag
		const validationResult = tagValidation.validateTagId(tagLink);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Call the service to retrieve the tag
		const retrievedTag = await tagService.retrieveTagByLink(tagLink, ["-_id", "name", "description", "link", "tagId"]);
		if (retrievedTag.status !== "success") {
			return apiResponse.serverErrorResponse(res, retrievedTag.message);
		}

		return apiResponse.successResponseWithData(res, retrievedTag.message, retrievedTag);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveTags = async (req, res) => {
	try {
		// Call the service to retrieve the tags
		const retrievedTags = await tagService.retrieveAllTags();
		if (retrievedTags.status !== "success") {
			return apiResponse.serverErrorResponse(res, retrievedTags.message);
		}

		return apiResponse.successResponseWithData(res, retrievedTags.message, retrievedTags);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const addTagToProject = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { projectId = "" } = req.params;

		let tagId = typeof req.body.tagId === "string" ? req.body.tagId : undefined;
		const tagName = typeof req.body.tagName === "string" ? req.body.tagName : undefined;

		// Validate input data for removing a tag
		const validationResult = tagValidation.validateUpdateTagFromProjectInputs(userIdUpdater, projectId, tagId ?? tagName);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the updater
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdUpdater);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditTags permission
		if (!rightsCheckResult.projectRights.permissions.canEditTags) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update tags for this project.");
		}

		if (tagName) {
			// Create the new tag first
			const createTagResult = await tagService.createTag(tagName, "");
			if (createTagResult.status !== "success") {
				return apiResponse.serverErrorResponse(res, createTagResult.message);
			}

			tagId = createTagResult.data.tag.tagId;
		}

		// Add the tag to the project
		const updateTagResult = await tagService.updateTagFromProject(projectId, userIdUpdater, tagId, "add");
		if (updateTagResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateTagResult.message);
		}

		return apiResponse.successResponseWithData(res, "Tag added successfully.", { tag: updateTagResult.data.tag });
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const removeTagFromProject = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { projectId = "" } = req.params;

		const tagId = req.body.tagId ?? "";

		// Validate input data for removing a tag
		const validationResult = tagValidation.validateUpdateTagFromProjectInputs(userIdUpdater, projectId, tagId);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Retrieve Project Rights of the updater
		const rightsCheckResult = await userRightsService.retrieveProjectRights(projectId, userIdUpdater);
		if (rightsCheckResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, rightsCheckResult.message);
		}

		// Check if the user has canEditTags permission
		if (!rightsCheckResult.projectRights.permissions.canEditTags) {
			return apiResponse.unauthorizedResponse(res, "You do not have permission to update tags for this project.");
		}

		// Remove the tag from the project
		const removeTagResult = await tagService.updateTagFromProject(projectId, userIdUpdater, tagId, "remove");
		if (removeTagResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, removeTagResult.message);
		}

		return apiResponse.successResponse(res, removeTagResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	createTag,
	createTags,
	updateTag,
	removeTag,
	retrieveTagWithId,
	retrieveTagWithLink,
	retrieveTags,
	addTagToProject,
	removeTagFromProject,
};
