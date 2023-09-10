const Project = require("../../models/project.model");
const { logger } = require("../../utils");

/**
 * Check user's rights to update a project.
 * @param {string} userId - The user ID of the user performing the update.
 * @param {string} projectId - The project ID.
 * @param {string} projectData - The data to be updated.
 * @returns {Promise} - A promise that resolves with the ... or rejects with an error.
 */
const checkUserRights = async (userId, projectId, projectData) => {};

module.exports = {
	checkUserRights,
};
