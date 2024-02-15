const { convertIdToObjectId } = require("./encrypt.tools");

const filterProjectFieldsToUpdate = (projectData) => {
	try {
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
		if (projectData.cover) {
			if (projectData.cover === "@--empty--string") {
				filteredInputs.cover = "";
			} else {
				filteredInputs.cover = projectData.cover;
			}
		}
		if (projectData.categoryId) {
			if (projectData.categoryId === "@--empty--string") {
				filteredInputs.categoryId = "";
			} else {
				filteredInputs.categoryId = projectData.categoryId;
			}
		}
		if (projectData.subCategory) {
			if (projectData.subCategory === "@--empty--string") {
				filteredInputs.subCategory = "";
			} else {
				filteredInputs.subCategory = projectData.subCategory;
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
		if (projectData.locationOnlineOnly !== "no value passed") {
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
		if (projectData.tags && projectData.tags.length > 0) {
			if (projectData.tags[0] === "@--empty--string") {
				filteredInputs.tags = [];
			} else {
				filteredInputs.tags = projectData.tags;
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
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const filterUserFieldsToUpdate = (data) => {
	try {
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
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const handleUserFiltering = (user, userIdViewer) => {
	try {
		// Create a deep copy of the user object
		const userCopy = structuredClone(user);

		let objectIdUserIdViewer = userIdViewer;
		if (userIdViewer !== "unknown") {
			// Convert id to ObjectId
			objectIdUserIdViewer = convertIdToObjectId(userIdViewer);
			if (objectIdUserIdViewer.status == "error") {
				return { status: "error", message: objectIdUserIdViewer.message };
			}
		}

		if (userCopy.profilePicture) {
			if (userCopy.profilePicture.privacy !== "public" && userCopy._id !== objectIdUserIdViewer) {
				userCopy.profilePicture = undefined;
			} else {
				userCopy.profilePicture.privacy = undefined;
			}
		}
		if (userCopy.location && userCopy.location.city) {
			if (userCopy.location.city.privacy !== "public" && userCopy._id !== objectIdUserIdViewer) {
				userCopy.location.city = undefined;
			} else {
				userCopy.location.city.privacy = undefined;
			}
		}
		if (userCopy.location && userCopy.location.country) {
			if (userCopy.location.country.privacy !== "public" && userCopy._id !== objectIdUserIdViewer) {
				userCopy.location.country = undefined;
			} else {
				userCopy.location.country.privacy = undefined;
			}
		}
		if (userCopy.company) {
			if (userCopy.company.privacy !== "public" && userCopy._id !== objectIdUserIdViewer) {
				userCopy.company = undefined;
			} else {
				userCopy.company.privacy = undefined;
			}
		}
		if (userCopy.bio) {
			if (userCopy.bio.privacy !== "public" && userCopy._id !== objectIdUserIdViewer) {
				userCopy.bio = undefined;
			} else {
				userCopy.bio.privacy = undefined;
			}
		}
		if (userCopy.languages) {
			if (userCopy.languages.privacy !== "public" && userCopy._id !== objectIdUserIdViewer) {
				userCopy.languages = undefined;
			} else {
				userCopy.languages.privacy = undefined;
			}
		}
		if (userCopy.website) {
			if (userCopy.website.privacy !== "public" && userCopy._id !== objectIdUserIdViewer) {
				userCopy.website = undefined;
			} else {
				userCopy.website.privacy = undefined;
			}
		}
		if (userCopy._id) {
			userCopy._id = undefined;
		}
		return userCopy;
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const filterUserOutputFields = (user, userIdViewer) => {
	try {
		user = handleUserFiltering(user, userIdViewer);
		return { status: "success", message: "User filtered successfully.", user };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const filterUsersOutputFields = (users, userIdViewer) => {
	try {
		for (let user of users) {
			user = handleUserFiltering(user, userIdViewer);
		}
		return { status: "success", message: "Users filtered successfully.", users };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const handleProjectFiltering = (project, userIdViewer) => {
	try {
		if (project.draft && project.draft.updatedBy) {
			project.draft.updatedBy = filterUserOutputFields(project.draft.updatedBy, userIdViewer).user;
		}
		if (project.updatedBy) {
			project.updatedBy = filterUserOutputFields(project.updatedBy, userIdViewer).user;
		}
		if (project.steps && project.steps.updatedBy) {
			project.steps.updatedBy = filterUserOutputFields(project.steps.updatedBy, userIdViewer).user;
		}
		if (project.QAs && project.QAs.updatedBy) {
			project.QAs.updatedBy = filterUserOutputFields(project.QAs.updatedBy, userIdViewer).user;
		}
		if (project.members) {
			for (let member of project.members) {
				if (member.user) {
					member.user = filterUserOutputFields(member.user, userIdViewer).user;
				}
			}
		}
		if (project.statusInfo && project.statusInfo.statusHistory) {
			for (let statusHist of project.statusInfo.statusHistory) {
				if (statusHist.updatedBy) {
					statusHist.updatedBy = filterUserOutputFields(statusHist.updatedBy, userIdViewer).user;
				}
			}
		}
		return project;
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const filterProjectsOutputFields = (projects, userIdViewer) => {
	try {
		for (let project of projects) {
			project = handleProjectFiltering(project, userIdViewer);
		}
		return { status: "success", message: "Projects filtered successfully.", projects };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const filterProjectOutputFields = (project, userIdViewer) => {
	try {
		project = handleProjectFiltering(project, userIdViewer);
		return { status: "success", message: "Project filtered successfully.", project };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

module.exports = {
	filterProjectFieldsToUpdate,
	filterUserFieldsToUpdate,
	filterUserOutputFields,
	filterUsersOutputFields,
	filterProjectsOutputFields,
	filterProjectOutputFields,
};
