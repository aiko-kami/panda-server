const filterFieldsToUpdate = (userData) => {
	const filteredInputs = {};

	if (userData.email) {
		if (userData.email === "@--empty--string") {
			filteredInputs.email = "";
		} else {
			filteredInputs.email = userData.email;
		}
	}
	if (userData.profilePicture) {
		if (userData.profilePicture === "@--empty--string") {
			filteredInputs.profilePicture = "";
		} else {
			filteredInputs.profilePicture = userData.profilePicture;
		}
	}
	if (userData.locationCountry) {
		if (userData.locationCountry === "@--empty--string") {
			filteredInputs.locationCountry = "";
		} else {
			filteredInputs.locationCountry = userData.locationCountry;
		}
	}
	if (userData.locationCity) {
		if (userData.locationCity === "@--empty--string") {
			filteredInputs.locationCity = "";
		} else {
			filteredInputs.locationCity = userData.locationCity;
		}
	}
	if (userData.company) {
		if (userData.company === "@--empty--string") {
			filteredInputs.company = "";
		} else {
			filteredInputs.company = userData.company;
		}
	}
	if (userData.description) {
		if (userData.description === "@--empty--string") {
			filteredInputs.description = "";
		} else {
			filteredInputs.description = userData.description;
		}
	}
	if (userData.bio) {
		if (userData.bio === "@--empty--string") {
			filteredInputs.bio = "";
		} else {
			filteredInputs.bio = userData.bio;
		}
	}
	if (userData.website) {
		if (userData.website === "@--empty--string") {
			filteredInputs.website = "";
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
	console.log("🚀 ~ filterFieldsToUpdate ~ filteredInputs:", filteredInputs);

	return filteredInputs;
};

module.exports = {
	filterFieldsToUpdate,
};
