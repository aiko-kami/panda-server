const filterFieldsToUpdate = (projectData) => {
	const filteredInputs = {};

	if (projectData.title) filteredInputs.title = projectData.title;
	if (projectData.goal) filteredInputs.goal = projectData.goal;
	if (projectData.summary) filteredInputs.summary = projectData.summary;
	if (projectData.description) filteredInputs.description = projectData.description;
	if (projectData.tagsIds && projectData.tagsIds.length > 0)
		filteredInputs.tagsIds = projectData.tagsIds;
	if (projectData.location) filteredInputs.location = projectData.location;
	if (projectData.talentsNeeded && projectData.talentsNeeded.length > 0)
		filteredInputs.talentsNeeded = projectData.talentsNeeded;
	if (!isNaN(projectData.startDate)) filteredInputs.startDate = parseInt(projectData.startDate);
	if (projectData.phase) filteredInputs.phase = projectData.phase;
	if (projectData.objectives && projectData.objectives.length > 0)
		filteredInputs.objectives = projectData.objectives;
	if (projectData.creatorMotivation)
		filteredInputs.creatorMotivation = projectData.creatorMotivation;
	if (projectData.visibility) filteredInputs.visibility = projectData.visibility;

	console.log("🚀 ~ filterFieldsToUpdate ~ filteredInputs:", filteredInputs);
	return filteredInputs;
};

module.exports = {
	filterFieldsToUpdate,
};
