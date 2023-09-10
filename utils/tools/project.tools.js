const filterFieldsToUpdate = (projectData) => {
	const filteredInputs = {};

	if (projectData.title) {
		if (projectData.title === "@--empty--string") {
			filteredInputs.title = "";
		} else {
			filteredInputs.title = projectData.title;
		}
	}
	if (projectData.goal) {
		if (projectData.goal === "@--empty--string") {
			filteredInputs.goal = "";
		} else {
			filteredInputs.goal = projectData.goal;
		}
	}
	if (projectData.summary) {
		if (projectData.summary === "@--empty--string") {
			filteredInputs.summary = "";
		} else {
			filteredInputs.summary = projectData.summary;
		}
	}
	if (projectData.description) {
		if (projectData.description === "@--empty--string") {
			filteredInputs.description = "";
		} else {
			filteredInputs.description = projectData.description;
		}
	}
	if (projectData.locationCountry) {
		if (projectData.locationCountry === "@--empty--string") {
			filteredInputs.locationCountry = "";
		} else {
			filteredInputs.locationCountry = projectData.locationCountry;
		}
	}
	if (projectData.locationCity) {
		if (projectData.locationCity === "@--empty--string") {
			filteredInputs.locationCity = "";
		} else {
			filteredInputs.locationCity = projectData.locationCity;
		}
	}
	if (projectData.locationOnlineOnly) {
		filteredInputs.locationOnlineOnly = projectData.locationOnlineOnly;
	}
	if (projectData.startDate) {
		if (projectData.startDate === "@--empty--string") {
			filteredInputs.startDate = "";
		} else {
			filteredInputs.startDate = projectData.startDate;
		}
	}
	if (projectData.phase) {
		if (projectData.phase === "@--empty--string") {
			filteredInputs.phase = "";
		} else {
			filteredInputs.phase = projectData.phase;
		}
	}
	if (projectData.creatorMotivation) {
		if (projectData.creatorMotivation === "@--empty--string") {
			filteredInputs.creatorMotivation = "";
		} else {
			filteredInputs.creatorMotivation = projectData.creatorMotivation;
		}
	}
	if (projectData.tagsIds && projectData.tagsIds.length > 0) {
		if (projectData.tagsIds[0] === "@--empty--string") {
			filteredInputs.tagsIds = [];
		} else {
			filteredInputs.tagsIds = projectData.tagsIds;
		}
	}
	if (projectData.talentsNeeded && projectData.talentsNeeded.length > 0) {
		if (projectData.talentsNeeded[0] === "@--empty--string") {
			filteredInputs.talentsNeeded = [];
		} else {
			filteredInputs.talentsNeeded = projectData.talentsNeeded;
		}
	}
	if (projectData.objectives && projectData.objectives.length > 0) {
		if (projectData.objectives[0] === "@--empty--string") {
			filteredInputs.objectives = [];
		} else {
			filteredInputs.objectives = projectData.objectives;
		}
	}
	if (projectData.visibility) {
		filteredInputs.visibility = projectData.visibility;
	}

	return filteredInputs;
};

module.exports = {
	filterFieldsToUpdate,
};
