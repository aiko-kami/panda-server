const { Tag } = require("../../models");
const { logger, encryptTools } = require("../../utils");

/**
 * Create a new tag if it does not already exist.
 * @param {string} name - The name of the tag.
 * @returns {Promise} - A promise that resolves with the created tag or rejects with an error.
 */
const createTag = async (tagName, description) => {
	try {
		//Trim and capitalize tag name
		const trimmedTagName = tagName.trim();
		const capitalizedTagName = trimmedTagName.toUpperCase();
		// Converts the tagName into a URL-friendly format by replacing '&' and '/' with '-', removing spaces and setting to lowercase
		const tagLink = trimmedTagName.replace(/\s&\s/g, "-").replace(/\//g, "-").replace(/\s+/g, "-").toLowerCase();

		// Check if a tag with the same name already exists
		const existingTag = await Tag.findOne({ nameCapitalized: capitalizedTagName }).lean();
		if (existingTag) {
			logger.error("Error while creating the tag: Tag already exists.");
			return { status: "error", message: "Tag already exists." };
		}

		// Create a new tag document
		const newTag = new Tag({
			name: trimmedTagName,
			nameCapitalized: capitalizedTagName,
			description: description.trim(),
			link: tagLink,
		});

		// Save the tag to the database
		const created = await newTag.save();
		//Add encrypted ID
		const encryptedId = encryptTools.convertObjectIdToId(created._id.toString());
		const createdTag = await Tag.findOneAndUpdate({ _id: created._id }, { tagId: encryptedId }, { new: true }).select("-_id -__v -nameCapitalized");

		logger.info(`Tag created successfully. Tag: ${createdTag}`);
		return {
			status: "success",
			message: "Tag created successfully.",
			data: { tag: createdTag },
		};
	} catch (error) {
		logger.error("Error while creating the tag: ", error);
		return {
			status: "error",
			message: "An error occurred while creating the tag.",
		};
	}
};

const createTags = async (tags) => {
	try {
		// Build a Map keyed by nameCapitalized to deduplicate input payload.
		const inputTagsMap = new Map();

		for (const tagItem of tags) {
			const tagNameCapitalized = tagItem.tagName.trim().toUpperCase();

			// Last occurrence in the payload wins for duplicates in same payload
			inputTagsMap.set(tagNameCapitalized, {
				tagRawName: tagItem.tagName,
				tagNameTrimmed: tagItem.tagName.trim(),
				tagNameCapitalized,
				tagDescription: tagItem.description?.trim() ?? "",
				tagLink: tagItem.tagName.trim().replace(/\s&\s/g, "-").replace(/\//g, "-").replace(/\s+/g, "-").toLowerCase(),
			});
		}

		// Check if a tag with the same name already exists
		const existingTags = await Tag.find({ nameCapitalized: { $in: Array.from(inputTagsMap.keys()) } }).lean();
		if (existingTags.length > 0) {
			// Return the list of existing tags and stop
			const existingNames = existingTags
				.map((t) => t.name)
				.sort()
				.join(", ");

			return {
				status: "error",
				message: `Error while creating the tags: The following tags already exist: ${existingNames}`,
			};
		}

		// Prepare documents to insert
		const docsToInsert = Array.from(inputTagsMap.values()).map((tag) => ({
			name: tag.tagNameTrimmed,
			nameCapitalized: tag.tagNameCapitalized,
			description: tag.tagDescription,
			link: tag.tagLink,
		}));

		// Insert all new tags in one operation (bulk insert)
		const insertedTags = await Tag.insertMany(docsToInsert, { ordered: true });

		// Generate and set encrypted tagIds
		const bulkOps = insertedTags.map((tag) => {
			const encryptedId = encryptTools.convertObjectIdToId(tag._id.toString());
			return {
				updateOne: {
					filter: { _id: tag._id },
					update: { $set: { tagId: encryptedId } },
				},
			};
		});

		// Bulk update all inserted tags to set the encrypted tagId in a single database operation
		if (bulkOps.length > 0) {
			await Tag.bulkWrite(bulkOps);
		}

		// Retrieve the final inserted documents without _id and __v
		const createdTags = await Tag.find({
			_id: { $in: insertedTags.map((t) => t._id) },
		})
			.select("-_id -__v -nameCapitalized")
			.lean();

		return {
			status: "success",
			message: "Tags created successfully.",
			data: { createdTags },
		};
	} catch (error) {
		logger.error("Error while creating the tag: ", error);
		return {
			status: "error",
			message: "An error occurred while creating the tag.",
		};
	}
};

const updateTag = async (tagId, newName, newDescription) => {
	try {
		// Convert id to ObjectId
		const objectIdTagId = encryptTools.convertIdToObjectId(tagId);
		if (objectIdTagId.status == "error") {
			return { status: "error", message: objectIdTagId.message };
		}

		// Check if a tag with the given tagId exists
		const existingTag = await Tag.findOne({ _id: objectIdTagId });
		if (!existingTag) {
			logger.error("Error while updating the tag: Tag not found.");
			return { status: "error", message: "Tag not found." };
		}

		// Check if the new name already exists for another tag in the collection (must be unique)
		if (newName !== existingTag.name) {
			const nameExists = await Tag.findOne({
				nameCapitalized: newName.toUpperCase(),
				_id: { $ne: existingTag._id }, // exclude the current tag document
			});

			if (nameExists) {
				logger.error("Error while updating the tag: Tag name already exists.");
				return { status: "error", message: "Tag name already exists." };
			}
		}

		// Converts the newName into a URL-friendly format by replacing '&' and '/' with '-', removing spaces and setting to lowercase
		const newLink = newName.replace(/\s&\s/g, "-").replace(/\//g, "-").replace(/\s+/g, "-").toLowerCase();

		// Update the tag data
		existingTag.name = newName;
		existingTag.nameCapitalized = newName.toUpperCase();
		existingTag.link = newLink;
		existingTag.description = newDescription;
		await existingTag.save();

		const updatedTag = existingTag.toObject();
		delete updatedTag._id;
		delete updatedTag.nameCapitalized;
		delete updatedTag.__v;

		logger.info(`Tag updated successfully. tagId: ${tagId}`);

		return {
			status: "success",
			message: "Tag updated successfully.",
			data: { updatedTag },
		};
	} catch (error) {
		logger.error(`Error while updating tag: ${error}`);

		return {
			status: "error",
			message: "An error occurred while updating the tag.",
		};
	}
};

const removeTag = async (tagId) => {
	try {
		// Convert id to ObjectId
		const objectIdTagId = encryptTools.convertIdToObjectId(tagId);
		if (objectIdTagId.status == "error") {
			return { status: "error", message: objectIdTagId.message };
		}

		// Check if a tag with the given tagId exists
		const existingTag = await Tag.findOne({ _id: objectIdTagId });
		if (!existingTag) {
			logger.error("Error while removing the tag: Tag not found.");
			return { status: "error", message: "Tag not found." };
		}

		// Remove the tag from the database
		await existingTag.deleteOne();

		logger.info(`Tag removed successfully. tagId: ${tagId}`);

		return {
			status: "success",
			message: "Tag removed successfully.",
			data: { removedTag: existingTag },
		};
	} catch (error) {
		logger.error(`Error while removing the tag: ${error}`);
		return {
			status: "error",
			message: "An error occurred while removing the tag.",
		};
	}
};

const retrieveTagById = async (tagId, fields) => {
	try {
		// Convert id to ObjectId
		const objectIdTagId = encryptTools.convertIdToObjectId(tagId);
		if (objectIdTagId.status == "error") {
			return { status: "error", message: objectIdTagId.message };
		}

		let query = Tag.findOne({ _id: objectIdTagId });
		if (fields) {
			const fieldsString = fields.join(" ");
			query = query.select(fieldsString);
		}

		const tag = await query.lean();

		if (!tag) {
			return { status: "error", message: "Tag not found." };
		}

		return { status: "success", tag };
	} catch (error) {
		logger.error(`Error while retrieving the tag: ${error}`);
		return { status: "error", message: "An error occurred while retrieving the tag." };
	}
};

const retrieveTagByLink = async (tagLink, fields) => {
	try {
		let query = Tag.findOne({ link: tagLink });
		if (fields) {
			const fieldsString = fields.join(" ");
			query = query.select(fieldsString);
		}

		const tag = await query.lean();

		if (!tag) {
			return { status: "error", message: "Tag not found." };
		}

		return { status: "success", tag };
	} catch (error) {
		logger.error(`Error while retrieving the tag: ${error}`);
		return { status: "error", message: "An error occurred while retrieving the tag." };
	}
};

const retrieveAllTags = async () => {
	try {
		const tags = await Tag.find().sort({ name: 1 }).select("-_id -__v -nameCapitalized").lean();

		if (!tags) {
			return { status: "error", message: "No tag found." };
		}

		return { status: "success", tags };
	} catch (error) {
		logger.error(`Error while retrieving the tags: ${error}`);
		return { status: "error", message: "An error occurred while retrieving the tags." };
	}
};

module.exports = {
	createTag,
	createTags,
	updateTag,
	removeTag,
	retrieveTagById,
	retrieveTagByLink,
	retrieveAllTags,
};
