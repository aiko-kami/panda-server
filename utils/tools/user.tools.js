const filterFieldsToUpdate = (userData) => {
	const filteredInputs = {};

	if (userData.email) {
		if (userData.email === "@--empty--string") {
			userData.email = "";
		} else {
			filteredInputs.email = userData.email;
		}
	}
	if (userData.profilePicture) {
		if (userData.profilePicture === "@--empty--string") {
			userData.profilePicture = "";
		} else {
			filteredInputs.profilePicture = userData.profilePicture;
		}
	}
	if (userData.locationCountry) {
		if (userData.locationCountry === "@--empty--string") {
			userData.locationCountry = "";
		} else {
			filteredInputs.locationCountry = userData.locationCountry;
		}
	}
	if (userData.locationCity) {
		if (userData.locationCity === "@--empty--string") {
			userData.locationCity = "";
		} else {
			filteredInputs.locationCity = userData.locationCity;
		}
	}
	if (userData.company) {
		if (userData.company === "@--empty--string") {
			userData.company = "";
		} else {
			filteredInputs.company = userData.company;
		}
	}
	if (userData.description) {
		if (userData.description === "@--empty--string") {
			userData.description = "";
		} else {
			filteredInputs.description = userData.description;
		}
	}
	if (userData.bio) {
		if (userData.bio === "@--empty--string") {
			userData.bio = "";
		} else {
			filteredInputs.bio = userData.bio;
		}
	}
	if (userData.website) {
		if (userData.website === "@--empty--string") {
			userData.website = "";
		} else {
			filteredInputs.website = userData.website;
		}
	}
	if (userData.languages && userData.languages.length > 0) {
		if (userData.languages[0] === "@--empty--string") {
			filteredInputs.languages = [];
		} else {
			filteredInputs.languages = userData.languages;
		}
	}

	return filteredInputs;
};

module.exports = {
	filterFieldsToUpdate,
};
