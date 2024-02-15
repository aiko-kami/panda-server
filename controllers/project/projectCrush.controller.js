const { crushService } = require("../../services");
const { apiResponse, idsValidation, filterTools } = require("../../utils");

/**
 * Update project crush controller.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The response containing the updated project or an error message.
 */
const addCrush = async (req, res) => {
	try {
		const userIdUpdater = req.userId;

		const { projectId = "" } = req.body;

		const ids = {
			userIdUpdater,
			projectId,
		};

		// Validate input data for updating project crush
		const validationResult = idsValidation.validateIdsInputs(ids);
		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const updateCrushResult = await crushService.updateCrush(projectId, userIdUpdater, "add");
		if (updateCrushResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateCrushResult.message);
		}

		return apiResponse.successResponse(res, updateCrushResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const removeCrush = async (req, res) => {
	try {
		const userIdUpdater = req.userId;
		const { projectId = "" } = req.body;

		const ids = {
			userIdUpdater,
			projectId,
		};

		// Validate input data for updating project crush
		const validationResult = idsValidation.validateIdsInputs(ids);

		if (validationResult.status !== "success") {
			return apiResponse.clientErrorResponse(res, validationResult.message);
		}

		const updateCrushResult = await crushService.updateCrush(projectId, userIdUpdater, "remove");
		if (updateCrushResult.status !== "success") {
			return apiResponse.serverErrorResponse(res, updateCrushResult.message);
		}

		return apiResponse.successResponse(res, updateCrushResult.message);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

const retrieveCrushProjects = async (req, res) => {
	try {
		const crushProjects = await crushService.retrieveCrushProjects(["-_id", "title", "summary", "cover", "category", "subCategory", "tags", "members"], { crush: true, visibility: "public" }, 99);

		if (crushProjects.status !== "success") {
			return apiResponse.serverErrorResponse(res, crushProjects.message);
		}

		if (crushProjects.projects === null || crushProjects.projects.length === 0) {
			return apiResponse.serverErrorResponse(res, crushProjects.message);
		}

		//Filter users public data from projects
		const projectFiltered = filterTools.filterProjectsOutputFields(crushProjects.projects, "unknown");
		if (projectFiltered.status !== "success") {
			return apiResponse.serverErrorResponse(res, projectFiltered.message);
		}
		return apiResponse.successResponseWithData(res, crushProjects.message, projectFiltered.projects);
	} catch (error) {
		return apiResponse.serverErrorResponse(res, error.message);
	}
};

module.exports = {
	addCrush,
	removeCrush,
	retrieveCrushProjects,
};
