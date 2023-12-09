const { Project, LikeProject } = require("../../models");
const { logger, encryptTools } = require("../../utils");
const { DateTime } = require("luxon");

/**
 * Update project like. Allow users to like projects and unlike them. Retrieve likes for a project and for a user
 * @param {string} projectId - The ID of the project.
 * @param {string} userId - The ID of the user performing the update.
 * @param {string} newStatus - The new status to be set to the project.
 * @returns {Object} - The result of the update operation.
 */
//Possible status: draft, submitted, active, on hold, completed, archived, cancelled

const editSteps = async (projectId, userIdUpdater, steps, actionType) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}
		// Convert id to ObjectId
		const objectIdUserIdUpdater = encryptTools.convertIdToObjectId(userIdUpdater);
		if (objectIdUserIdUpdater.status == "error") {
			return { status: "error", message: objectIdUserIdUpdater.message };
		}

		const project = await Project.findOne({ _id: objectIdProjectId });

		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		if (actionType === "create") {
			const alreadyExistingSteps = project.steps.stepsList;

			if (alreadyExistingSteps && alreadyExistingSteps.length > 0) {
				return { status: "error", message: "Steps already present for this project." };
			}

			// Create new steps
			for (const step of steps) {
				const newStep = {
					title: step.title,
					details: step.details || "",
					published: step.published ? true : false,
				};
				project.steps.stepsList.push(newStep);
			}

			// Update timestamps and the user who made the changes
			project.updatedBy = objectIdUserIdUpdater;
			project.steps.updatedBy = objectIdUserIdUpdater;
			project.steps.createdAt = DateTime.now().toHTTP();
			project.steps.updatedAt = DateTime.now().toHTTP();

			// Save the updated project
			await project.save();

			logger.info(`Project steps created successfully. Project ID: ${projectId} - User ID updater: ${userIdUpdater}`);
			return { status: "success", message: "Project steps created successfully." };
		}

		if (actionType === "update") {
			// Check if there are already steps
			if (!project.steps.stepsList || project.steps.stepsList.length === 0) {
				return { status: "error", message: "No steps found for this project." };
			}

			// Update all steps with the provided data
			project.steps.stepsList = steps.map((updatedStep) => ({
				title: updatedStep.title,
				details: updatedStep.details || "",
				published: updatedStep.published ? true : false,
			}));

			// Update timestamps and the user who made the changes
			project.updatedBy = objectIdUserIdUpdater;
			project.steps.updatedBy = objectIdUserIdUpdater;
			project.steps.updatedAt = DateTime.now().toHTTP();

			// Save the updated project
			await project.save();

			logger.info(`Project steps updated successfully. Project ID: ${projectId} - User ID updater: ${userIdUpdater}`);
			return { status: "success", message: "Project steps updated successfully." };
		}
		if (actionType === "publish") {
			const stepTitle = steps;
			// Find the step with the given title
			const stepToPublish = project.steps.stepsList.find((step) => step.title === stepTitle);

			if (!stepToPublish) {
				return { status: "error", message: "Step not found." };
			}

			// Check if the step is already published
			if (stepToPublish.published) {
				return { status: "error", message: "Step is already published." };
			}

			// Publish the step
			stepToPublish.published = true;

			// Update timestamps and the user who made the changes
			project.updatedBy = objectIdUserIdUpdater;
			project.steps.updatedBy = objectIdUserIdUpdater;
			project.steps.updatedAt = DateTime.now().toHTTP();

			// Save the updated project
			await project.save();

			logger.info(`Project step published successfully. Project ID: ${projectId} - User ID updater: ${userIdUpdater}`);
			return { status: "success", message: "Project step published successfully." };
		}
		if (actionType === "remove") {
			const stepTitle = steps;
			// Find the index of the step with the given title
			const stepIndex = project.steps.stepsList.findIndex((step) => step.title === stepTitle);

			if (stepIndex === -1) {
				return { status: "error", message: "Step not found." };
			}

			// Remove the step at the found index
			project.steps.stepsList.splice(stepIndex, 1);

			// Update timestamps and the user who made the changes
			project.updatedBy = objectIdUserIdUpdater;
			project.steps.updatedBy = objectIdUserIdUpdater;
			project.steps.updatedAt = DateTime.now().toHTTP();

			// Save the updated project
			await project.save();

			logger.info(`Project step removed successfully. Project ID: ${projectId} - User ID updater: ${userIdUpdater}`);
			return { status: "success", message: "Project step removed successfully." };
		}
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const retrieveProjectSteps = async (projectId, actionType, userId) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		if (actionType === "all") {
			const projectSteps = await Project.findOne({ _id: objectIdProjectId })
				.select("-_id steps")
				.populate([{ path: "steps.updatedBy", select: "-_id username profilePicture userId" }]);

			if (!projectSteps) {
				return { status: "error", message: "Project not found." };
			}

			if (!projectSteps.steps.stepsList || projectSteps.steps.stepsList.length === 0) {
				return { status: "error", message: "No Project step found." };
			}

			if (projectSteps.steps.updatedBy.profilePicture.privacy !== "public") {
				projectSteps.steps.updatedBy.profilePicture = undefined;
			}

			const stepsList = projectSteps.steps.stepsList;

			const stepsOutput = {
				stepList: stepsList,
				createdAt: projectSteps.steps.createdAt,
				updatedAt: projectSteps.steps.updatedAt,
				updatedBy: projectSteps.steps.updatedBy,
			};

			logger.info(`Project steps retrieved successfully.`);
			return { status: "success", message: `Project steps retrieved successfully.`, stepsOutput };
		}
		if (actionType === "published") {
			const projectSteps = await Project.findOne({ _id: objectIdProjectId }).select("-_id steps");

			if (!projectSteps) {
				return { status: "error", message: "Project not found." };
			}

			if (!projectSteps.steps.stepsList) {
				return { status: "error", message: "No Project step found." };
			}

			const stepsList = projectSteps.steps.stepsList;

			// Filter steps that are set to published
			const publishedSteps = stepsList.filter((step) => step.published);

			const stepsOutput = {
				stepList: publishedSteps,
				createdAt: projectSteps.steps.createdAt,
				updatedAt: projectSteps.steps.updatedAt,
			};

			logger.info(`Project steps retrieved successfully.`);
			return { status: "success", message: `Project steps retrieved successfully.`, stepsOutput };
		}
	} catch (error) {
		logger.error("Error while retrieving project steps:", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the project steps.",
		};
	}
};

module.exports = {
	editSteps,
	retrieveProjectSteps,
};
