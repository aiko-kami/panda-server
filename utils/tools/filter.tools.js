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
		const userCopy = JSON.parse(JSON.stringify(user));

		let objectIdUserIdViewer = userIdViewer;
		if (userIdViewer !== "unknown") {
			// Convert id to ObjectId
			objectIdUserIdViewer = convertIdToObjectId(userIdViewer);
			if (objectIdUserIdViewer.status == "error") {
				return { status: "error", message: objectIdUserIdViewer.message };
			}
		}
		if (userCopy.profilePicture) {
			if (userCopy.profilePicture.privacy !== "public" && userCopy._id.toString() !== objectIdUserIdViewer.toString()) {
				userCopy.profilePicture = undefined;
			} else {
				delete userCopy.profilePicture.privacy;
			}
		}
		if (userCopy.backgroundPicture) {
			if (userCopy.backgroundPicture.privacy !== "public" && userCopy._id.toString() !== objectIdUserIdViewer.toString()) {
				userCopy.backgroundPicture = undefined;
			} else {
				delete userCopy.backgroundPicture.privacy;
			}
		}
		if (userCopy.location && userCopy.location.city) {
			if (userCopy.location.city.privacy !== "public" && userCopy._id.toString() !== objectIdUserIdViewer.toString()) {
				userCopy.location.city = undefined;
			} else {
				userCopy.location.city = userCopy.location.city.data;
				delete userCopy.location.city.privacy;
			}
		}
		if (userCopy.location && userCopy.location.country) {
			if (userCopy.location.country.privacy !== "public" && userCopy._id.toString() !== objectIdUserIdViewer.toString()) {
				userCopy.location.country = undefined;
			} else {
				userCopy.location.country = userCopy.location.country.data;
				delete userCopy.location.country.privacy;
			}
		}
		if (userCopy.company) {
			if (userCopy.company.privacy !== "public" && userCopy._id.toString() !== objectIdUserIdViewer.toString()) {
				userCopy.company = undefined;
			} else {
				userCopy.company = userCopy.company.data;
				delete userCopy.company.privacy;
			}
		}
		if (userCopy.bio) {
			if (userCopy.bio.privacy !== "public" && userCopy._id.toString() !== objectIdUserIdViewer.toString()) {
				userCopy.bio = undefined;
			} else {
				userCopy.bio = userCopy.bio.data;
				delete userCopy.bio.privacy;
			}
		}
		if (userCopy.languages) {
			if (userCopy.languages.privacy !== "public" && userCopy._id.toString() !== objectIdUserIdViewer.toString()) {
				userCopy.languages = undefined;
			} else {
				userCopy.languages = userCopy.languages.data;
				delete userCopy.languages.privacy;
			}
		}
		if (userCopy.website) {
			if (userCopy.website.privacy !== "public" && userCopy._id.toString() !== objectIdUserIdViewer.toString()) {
				userCopy.website = undefined;
			} else {
				userCopy.website = userCopy.website.data;
				delete userCopy.website.privacy;
			}
		}
		if (userCopy.quickSkills) {
			if (userCopy.quickSkills.privacy !== "public" && userCopy._id.toString() !== objectIdUserIdViewer.toString()) {
				userCopy.quickSkills = undefined;
			} else {
				userCopy.quickSkills = userCopy.quickSkills.data;
				delete userCopy.quickSkills.privacy;
			}
		}
		if (userCopy.talents) {
			// Remove unpublished talents if viewer is not the owner
			userCopy.talents = userCopy.talents.filter((talent) => {
				if (!talent.published && userCopy._id.toString() !== objectIdUserIdViewer.toString()) {
					return false; // remove it
				}
				return true;
			});
		}

		if (userCopy._id) {
			delete userCopy._id;
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

const filterUserPrivacyFields = (user) => {
	try {
		if (!user) {
			throw new Error("User not found or invalid.");
		}

		const privacySettings = {
			privacyProfilePicture: user.profilePicture?.privacy || null,
			privacyBackgroundPicture: user.backgroundPicture?.privacy || null,
			privacyBio: user.bio?.privacy || null,
			privacyLocationCity: user.location?.city?.privacy || null,
			privacyLocationCountry: user.location?.country?.privacy || null,
			privacyCompany: user.company?.privacy || null,
			privacyLanguages: user.languages?.privacy || null,
			privacyWebsite: user.website?.privacy || null,
			privacyProjectLike: user.projectLikePrivacy || null,
		};

		// Optionally check if everything is null
		const allEmpty = Object.values(privacySettings).every((value) => value === null);
		if (allEmpty) {
			throw new Error("No privacy settings found for user.");
		}

		return {
			status: "success",
			message: "Privacy settings retrieved successfully.",
			privacySettings,
		};
	} catch (error) {
		return {
			status: "error",
			message: error.message,
		};
	}
};

const filterUsersOutputFields = (users, userIdViewer) => {
	try {
		const filteredUsers = users.map((user) => handleUserFiltering(user, userIdViewer));
		return { status: "success", message: "Users filtered successfully.", users: filteredUsers };
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
		if (project.createdBy) {
			project.createdBy = filterUserOutputFields(project.createdBy, userIdViewer).user;
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
		if (project.privateData && project.privateData.attachments) {
			for (let attachment of project.privateData.attachments) {
				if (attachment.updatedBy) {
					attachment.updatedBy = filterUserOutputFields(attachment.updatedBy, userIdViewer).user;
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
	filterUserPrivacyFields,
	filterUsersOutputFields,
	filterProjectsOutputFields,
	filterProjectOutputFields,
};
