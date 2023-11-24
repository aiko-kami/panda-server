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

const filterOutputFields = (userData) => {
	if (userData.profilePicture) {
		if (userData.profilePicture.privacy !== "public") {
			userData.profilePicture = undefined;
		} else {
			userData.profilePicture.privacy = undefined;
		}
	}
	if (userData.location.city) {
		if (userData.location.city.privacy !== "public") {
			userData.location.city = undefined;
		} else {
			userData.location.city.privacy = undefined;
		}
	}
	if (userData.location.country) {
		if (userData.location.country.privacy !== "public") {
			userData.location.country = undefined;
		} else {
			userData.location.country.privacy = undefined;
		}
	}
	if (userData.company) {
		if (userData.company.privacy !== "public") {
			userData.company = undefined;
		} else {
			userData.company.privacy = undefined;
		}
	}
	if (userData.bio) {
		if (userData.bio.privacy !== "public") {
			userData.bio = undefined;
		} else {
			userData.bio.privacy = undefined;
		}
	}
	if (userData.languages) {
		if (userData.languages.privacy !== "public") {
			userData.languages = undefined;
		} else {
			userData.languages.privacy = undefined;
		}
	}
	if (userData.website) {
		if (userData.website.privacy !== "public") {
			userData.website = undefined;
		} else {
			userData.website.privacy = undefined;
		}
	}

	return userData;
};

module.exports = {
	filterFieldsToUpdate,
	filterOutputFields,
};
