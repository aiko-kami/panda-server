const { tagService } = require("../../services");
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

		console.log("🚀 ~ createTags ~ tags:", tags);

		// Validate input data for creating a tag
		const validationInputsResult = tagValidation.validateTagsInputs(tags);

		console.log("🚀 ~ createTags ~ validationInputsResult:", validationInputsResult);

		if (validationInputsResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationInputsResult.message);
		}

		// Call the service to create the tag
		const createdTags = await tagService.createTags(tags);

		console.log("🚀 ~ createTags ~ createdTags:", createdTags);

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

module.exports = {
	createTag,
	createTags,
	updateTag,
	removeTag,
	retrieveTagWithId,
	retrieveTagWithLink,
	retrieveTags,
};
