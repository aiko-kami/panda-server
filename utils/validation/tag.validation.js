const validateTagInputs = (tagName, description) => {
	//String type validation
	if (typeof tagName !== "string" || typeof description !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!tagName.trim()) {
		return { status: "error", message: "Tag name is required." };
	}
	// If all validations passed
	return { status: "success", message: "All tag inputs are valid." };
};

const validateNewTagsInputs = (tags) => {
	// Check if tags is a valid array
	if (!Array.isArray(tags)) {
		return { status: "error", message: "Tags must be provided as a list." };
	}

	// Check if array is empty
	if (tags.length === 0) {
		return { status: "error", message: "Tags list cannot be empty." };
	}

	// nameSet to be used for duplicates check
	const nameSet = new Set();
	for (let i = 0; i < tags.length; i++) {
		const { name, description } = tags[i];
		//String type validation
		if (typeof name !== "string" || typeof description !== "string") {
			return { status: "error", message: `Invalid data type at tag index ${i}.` };
		}
		if (!name.trim()) {
			return { status: "error", message: `Tag name is required at index ${i}.` };
		}
		const normalizedUpper = name.trim().toUpperCase();
		if (nameSet.has(normalizedUpper)) {
			return { status: "error", message: `Duplicate tag found: "${normalizedName}" at index ${i}.` };
		}
		nameSet.add(normalizedUpper);
	}
	// If all validations passed
	return { status: "success", message: "All tags inputs are valid." };
};

const validateExistingTagsInputs = (tags) => {
	// Check if tags is a valid array
	if (!Array.isArray(tags)) {
		return { status: "error", message: "Tags must be provided as a list." };
	}

	// Check if array is empty
	if (tags.length === 0) {
		return { status: "error", message: "Tags list cannot be empty." };
	}

	// nameSet to be used for duplicates check
	const nameSet = new Set();
	for (let i = 0; i < tags.length; i++) {
		const { name, description, link, tagId } = tags[i];
		//String type validation
		if (typeof name !== "string" || typeof description !== "string" || typeof link !== "string" || typeof tagId !== "string") {
			return { status: "error", message: `Invalid data type at tag index ${i}.` };
		}
		if (!name.trim()) {
			return { status: "error", message: `Tag name is required at index ${i}.` };
		}
		if (!link.trim()) {
			return { status: "error", message: `Tag link is required at index ${i}.` };
		}
		if (!tagId) {
			return { status: "error", message: `Tag ID is required at index ${i}.` };
		}
		const normalizedUpper = name.trim().toUpperCase();
		if (nameSet.has(normalizedUpper)) {
			return { status: "error", message: `Duplicate tag found: "${normalizedName}" at index ${i}.` };
		}
		nameSet.add(normalizedUpper);
	}
	// If all validations passed
	return { status: "success", message: "All tags inputs are valid." };
};

const validateTagId = (tagId) => {
	//String type validation
	if (typeof tagId !== "string") {
		return { status: "error", message: "Invalid type of data." };
	}
	if (!tagId) {
		return { status: "error", message: "Tag ID is required." };
	}
	// If all validations passed
	return { status: "success", message: "Tag ID input is valid." };
};

const validateUpdateTagFromProjectInputs = (userIdUpdater, projectId, tagIdOrName) => {
	//Types validation
	const invalidType = typeof userIdUpdater !== "string" || typeof projectId !== "string" || typeof tagIdOrName !== "string";
	if (invalidType) {
		return { status: "error", message: "Invalid type of data." };
	}

	// Check if required fields are present
	if (!userIdUpdater) {
		return { status: "error", message: "Updater user ID is required." };
	}
	if (!projectId) {
		return { status: "error", message: "Project ID is required." };
	}
	if (!tagIdOrName) {
		return { status: "error", message: "Tag is required." };
	}

	// If all validations passed
	return { status: "success", message: "All tag inputs are valid." };
};

module.exports = {
	validateTagInputs,
	validateNewTagsInputs,
	validateExistingTagsInputs,
	validateTagId,
	validateUpdateTagFromProjectInputs,
};
