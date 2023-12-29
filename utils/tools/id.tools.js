const removeIdField = (obj, visited = new Set()) => {
	if (visited.has(obj)) {
		return;
	}

	visited.add(obj);

	for (const key in obj) {
		if (key === "_id") {
			delete obj[key];
		} else if (Array.isArray(obj[key])) {
			for (const item of obj[key]) {
				removeIdField(item, visited);
			}
		} else if (typeof obj[key] === "object" && obj[key] !== null) {
			removeIdField(obj[key], visited);
		}
	}
};

const removeIds = (comment) => {
	removeIdField(comment);
	for (const answer of comment.answers) {
		removeIds(answer);
	}
};

// Remove _id fields from comments
const removeIdsFromArray = (commentTree) => {
	for (let comment of commentTree) {
		removeIds(comment);
	}
};

module.exports = {
	removeIdsFromArray,
};
