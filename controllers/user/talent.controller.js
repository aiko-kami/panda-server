const { apiResponse, talentValidation, filterTools } = require("../../utils");
const { talentService } = require("../../services");

const createTalent = async (req, res) => {
	try {
		const userId = req.userId;
		//Retrieve and initialize talent data
		const talentData = {
			name: req.body.talentInputs.name || "",
			description: req.body.talentInputs.description || "",
			skills: req.body.talentInputs.skills || "",
			experience: req.body.talentInputs.experience || "",
			portfolio: req.body.talentInputs.portfolio || "",
			certifications: req.body.talentInputs.certifications || "",
		};

		// Validate input data for creating a talent
		const validationResult = talentValidation.validateTalentInputs(talentData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Call the service to create the talent
		const createdTalent = await talentService.createTalent(talentData, userId);

		if (createdTalent.status !== "success") {
			return apiResponse.serverErrorResponse(res, createdTalent.message);
		}

		return apiResponse.successResponseWithData(res, createdTalent.message, createdTalent.talentData);
	} catch (error) {
		// Throw error in json response with status 500.
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const updateTalent = async (req, res) => {
	try {
		const userId = req.userId;
		//Retrieve and initialize talent data
		const talentData = {
			name: req.body.talentInputs.name || "",
			description: req.body.talentInputs.description || "",
			skills: req.body.talentInputs.skills || "",
			experience: req.body.talentInputs.experience || "",
			portfolio: req.body.talentInputs.portfolio || "",
			certifications: req.body.talentInputs.certifications || "",
		};

		// Validate input data for updating a talent
		const validationResult = talentValidation.validateTalentInputs(talentData);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Filter on the fields that the user wants to update
		const filterTalentInputs = filterTools.filterUserFieldsToUpdate(talentData);

		// Call the service to update the talent
		const updatedTalent = await talentService.updateTalent(filterTalentInputs, userId);

		if (updatedTalent.status !== "success") {
			return apiResponse.serverErrorResponse(res, updatedTalent.message);
		}

		return apiResponse.successResponseWithData(res, updatedTalent.message, updatedTalent.talentData);
	} catch (error) {
		// Throw error in json response with status 500.
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const updateTalents = async (req, res) => {
	try {
		const userId = req.userId;

		//Retrieve and initialize talents data
		const talents = req.body.talents;

		// Validate input data for updating a talent
		const validationResult = talentValidation.validateTalentsInputs(talents);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Call the service to update the talent
		const updatedTalent = await talentService.updateTalents(talents, userId);

		if (updatedTalent.status !== "success") {
			return apiResponse.serverErrorResponse(res, updatedTalent.message);
		}

		return apiResponse.successResponseWithData(res, updatedTalent.message, updatedTalent.talentData);
	} catch (error) {
		// Throw error in json response with status 500.
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const removeTalent = async (req, res) => {
	try {
		const userId = req.userId;
		//Retrieve and initialize talent data
		const { talentName = "" } = req.body;

		// Validate input data for creating a talent
		const validationResult = talentValidation.validateTalentName(talentName);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Call the service to remove the talent
		const removedTalent = await talentService.removeTalent(talentName, userId);

		if (removedTalent.status !== "success") {
			return apiResponse.serverErrorResponse(res, removedTalent.message);
		}

		return apiResponse.successResponseWithData(res, removedTalent.message, removedTalent.talentData);
	} catch (error) {
		// Throw error in json response with status 500.
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const addQuickSkill = async (req, res) => {
	try {
		const userId = req.userId;
		//Retrieve and initialize talent data
		const quickSkill = req.body.quickSkill || "";

		// Validate input data for creating a quick skill
		const validationResult = talentValidation.validateSkillInput(quickSkill);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Add the skill in user's quick skills
		const updateSkillResult = await talentService.updateQuickSkills(userId, quickSkill, "add");
		if (updateSkillResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateSkillResult.message);
		}

		return apiResponse.successResponseWithData(res, updateSkillResult.message, updateSkillResult.quickSkillsData);
	} catch (error) {
		// Throw error in json response with status 500.
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const removeQuickSkill = async (req, res) => {
	try {
		const userId = req.userId;
		//Retrieve and initialize talent data
		const quickSkill = req.body.quickSkill || "";

		// Validate input data for creating a quick skill
		const validationResult = talentValidation.validateSkillInput(quickSkill);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		// Remove the skill in user's quick skills
		const updateSkillResult = await talentService.updateQuickSkills(userId, quickSkill, "remove");
		if (updateSkillResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateSkillResult.message);
		}

		return apiResponse.successResponseWithData(res, updateSkillResult.message, updateSkillResult.quickSkillsData);
	} catch (error) {
		// Throw error in json response with status 500.
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	createTalent,
	updateTalent,
	updateTalents,
	removeTalent,
	addQuickSkill,
	removeQuickSkill,
};
