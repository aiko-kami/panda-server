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

const validateTagsInputs = (tags) => {
	// Check if tags is a valid array
	if (!Array.isArray(tags)) {
		return { status: "error", message: "Tags must be provided as an list." };
	}

	// Check if array is empty
	if (tags.length === 0) {
		return { status: "error", message: "Tags list cannot be empty." };
	}

	// nameSet to be used for duplicates check
	const nameSet = new Set();
	for (let i = 0; i < tags.length; i++) {
		const { tagName, description } = tags[i];
		//String type validation
		if (typeof tagName !== "string" || typeof description !== "string") {
			return { status: "error", message: `Invalid data type at tag index ${i}.` };
		}
		if (!tagName.trim()) {
			return { status: "error", message: `Tag name is required at index ${i}.` };
		}
		const normalizedUpper = tagName.trim().toUpperCase();
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

module.exports = {
	validateTagInputs,
	validateTagsInputs,
	validateTagId,
};
