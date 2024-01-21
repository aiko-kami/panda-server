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

const filterUserOutputFields = (user) => {
	try {
		if (user.profilePicture) {
			if (user.profilePicture.privacy !== "public") {
				user.profilePicture = undefined;
			} else {
				user.profilePicture.privacy = undefined;
			}
		}
		if (user.location && user.location.city) {
			if (user.location.city.privacy !== "public") {
				user.location.city = undefined;
			} else {
				user.location.city.privacy = undefined;
			}
		}
		if (user.location && user.location.country) {
			if (user.location.country.privacy !== "public") {
				user.location.country = undefined;
			} else {
				user.location.country.privacy = undefined;
			}
		}
		if (user.company) {
			if (user.company.privacy !== "public") {
				user.company = undefined;
			} else {
				user.company.privacy = undefined;
			}
		}
		if (user.bio) {
			if (user.bio.privacy !== "public") {
				user.bio = undefined;
			} else {
				user.bio.privacy = undefined;
			}
		}
		if (user.languages) {
			if (user.languages.privacy !== "public") {
				user.languages = undefined;
			} else {
				user.languages.privacy = undefined;
			}
		}
		if (user.website) {
			if (user.website.privacy !== "public") {
				user.website = undefined;
			} else {
				user.website.privacy = undefined;
			}
		}
		return user;
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const filterUsersOutputFields = (users) => {
	try {
		for (let user of users) {
			if (user.profilePicture) {
				if (user.profilePicture.privacy !== "public") {
					user.profilePicture = undefined;
				} else {
					user.profilePicture.privacy = undefined;
				}
			}
			if (user.location && user.location.city) {
				if (user.location.city.privacy !== "public") {
					user.location.city = undefined;
				} else {
					user.location.city.privacy = undefined;
				}
			}
			if (user.location && user.location.country) {
				if (user.location.country.privacy !== "public") {
					user.location.country = undefined;
				} else {
					user.location.country.privacy = undefined;
				}
			}
			if (user.company) {
				if (user.company.privacy !== "public") {
					user.company = undefined;
				} else {
					user.company.privacy = undefined;
				}
			}
			if (user.bio) {
				if (user.bio.privacy !== "public") {
					user.bio = undefined;
				} else {
					user.bio.privacy = undefined;
				}
			}
			if (user.languages) {
				if (user.languages.privacy !== "public") {
					user.languages = undefined;
				} else {
					user.languages.privacy = undefined;
				}
			}
			if (user.website) {
				if (user.website.privacy !== "public") {
					user.website = undefined;
				} else {
					user.website.privacy = undefined;
				}
			}
		}
		return users;
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const filterProjectsOutputFields = (projects) => {
	try {
		for (let project of projects) {
			if (project.draft && project.draft.updatedBy) {
				project.draft.updatedBy = filterUserOutputFields(project.draft.updatedBy);
			}
			if (project.updatedBy) {
				project.updatedBy = filterUserOutputFields(project.updatedBy);
			}
			if (project.steps && project.steps.updatedBy) {
				project.steps.updatedBy = filterUserOutputFields(project.steps.updatedBy);
			}
			if (project.QAs && project.QAs.updatedBy) {
				project.QAs.updatedBy = filterUserOutputFields(project.QAs.updatedBy);
			}
			if (project.members) {
				for (let member of project.members) {
					if (member.user) {
						member.user = filterUserOutputFields(member.user);
					}
				}
			}
			if (project.statusInfo && project.statusInfo.statusHistory) {
				for (let statusHis of project.statusInfo.statusHistory) {
					if (statusHis.updatedBy) {
						statusHis.updatedBy = filterUserOutputFields(statusHis.updatedBy);
					}
				}
			}
		}
		return { status: "success", message: "Projects filtered successfully.", projects };
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const filterProjectOutputFields = (project) => {
	try {
		if (project.draft && project.draft.updatedBy) {
			project.draft.updatedBy = filterUserOutputFields(project.draft.updatedBy);
		}
		if (project.updatedBy) {
			project.updatedBy = filterUserOutputFields(project.updatedBy);
		}
		if (project.steps && project.steps.updatedBy) {
			project.steps.updatedBy = filterUserOutputFields(project.steps.updatedBy);
		}
		if (project.QAs && project.QAs.updatedBy) {
			project.QAs.updatedBy = filterUserOutputFields(project.QAs.updatedBy);
		}
		if (project.members) {
			for (let member of project.members) {
				if (member.user) {
					member.user = filterUserOutputFields(member.user);
				}
			}
		}
		if (project.statusInfo && project.statusInfo.statusHistory) {
			for (let statusHis of project.statusInfo.statusHistory) {
				if (statusHis.updatedBy) {
					statusHis.updatedBy = filterUserOutputFields(statusHis.updatedBy);
				}
			}
		}
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
