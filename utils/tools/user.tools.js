const filterFieldsToUpdate = (data) => {
	const filteredInputs = {};

	for (const key in data) {
		if (data[key]) {
			if (Array.isArray(data[key]) && data[key].length > 0) {
				if (data[key][0] === "@--empty--string") {
					filteredInputs[key] = [];
				} else {
					filteredInputs[key] = data[key];
				}
			} else {
				if (data[key] === "@--empty--string") {
					filteredInputs[key] = "";
				} else {
					filteredInputs[key] = data[key];
				}
			}
		}
	}
	return filteredInputs;
};

module.exports = {
	filterFieldsToUpdate,
};
