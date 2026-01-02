const { Project, Status } = require("../../models");
const { logger, encryptTools, filterTools } = require("../../utils");
const { DateTime } = require("luxon");

/**
 * Update project steps.
 * @param {string} projectId - The ID of the project.
 * @param {string} userId - The ID of the user performing the update.
 * @param {string} newStatus - The new status to be set to the project.
 * @returns {Object} - The result of the update operation.
 */

const editSteps = async (projectId, userIdUpdater, steps, actionType) => {
	try {
		// Convert project id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}
		// Convert user id to ObjectId
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
				return { status: "error", message: "Steps already present for this project. Cannot create new steps." };
			}

			// Create new steps
			for (const step of steps) {
				const newStep = {
					title: step.title,
					details: step.details || "",
					published: step.published ? true : false,
					status: step.details || "not started",
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
			// Ensure steps object exists
			if (!project.steps) {
				project.steps = {};
			}

			project.steps.stepsList = [];

			for (const step of steps) {
				// Convert status id to ObjectId
				const objectIdStatusId = encryptTools.convertIdToObjectId(step.statusId);
				if (objectIdStatusId.status == "error") {
					return { status: "error", message: objectIdStatusId.message };
				}

				//Check if the steps status exist
				statusExist = await Status.findOne({ _id: objectIdStatusId });
				if (!statusExist) {
					return { status: "error", message: `Status with ID ${step.statusId} not found.` };
				}

				// Add the step to the project's steps list
				project.steps.stepsList.push({
					title: step.title,
					details: step.details || "",
					published: step.published ? true : false,
					status: objectIdStatusId,
				});
			}

			// Update timestamps and the user who made the changes
			project.updatedBy = objectIdUserIdUpdater;
			project.steps.updatedBy = objectIdUserIdUpdater;
			project.steps.updatedAt = DateTime.now().toHTTP();

			// Save the updated project
			await project.save();

			logger.info(`Project steps updated successfully. Project ID: ${projectId} - User ID updater: ${userIdUpdater}`);
			return { status: "success", message: "Project steps updated successfully." };
		}
		if (actionType === "publish" || actionType === "unpublish") {
			const stepTitle = steps;
			// Find the step with the given title
			const stepToPublish = project.steps.stepsList.find((step) => step.title === stepTitle);

			if (!stepToPublish) {
				return { status: "error", message: "Step not found." };
			}

			if (actionType === "publish") {
				// Check if the step is already published
				if (stepToPublish.published) {
					return { status: "error", message: "Step is already published." };
				}
				// Publish the step
				stepToPublish.published = true;
			}

			if (actionType === "unpublish") {
				// Check if the step is already published
				if (!stepToPublish.published) {
					return { status: "error", message: "Step is already unpublished." };
				}
				// Unpublish the step
				stepToPublish.published = false;
			}

			// Update timestamps and the user who made the changes
			project.updatedBy = objectIdUserIdUpdater;
			project.steps.updatedBy = objectIdUserIdUpdater;
			project.steps.updatedAt = DateTime.now().toHTTP();

			// Save the updated project
			await project.save();

			logger.info(`Project step ${actionType}ed successfully. Project ID: ${projectId} - User ID updater: ${userIdUpdater}`);
			return { status: "success", message: `Project step ${actionType}ed successfully` };
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

const retrieveProjectSteps = async (projectId, actionType) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		if (actionType === "all") {
			const projectSteps = await Project.findOne({ _id: objectIdProjectId })
				.select("-_id steps")
				.populate([
					{ path: "steps.updatedBy", select: "username profilePicture userId" },
					{ path: "steps.stepsList.status", select: "status colors" },
				]);

			if (!projectSteps) {
				return { status: "error", message: "Project not found." };
			}

			if (!projectSteps.steps.stepsList || projectSteps.steps.stepsList.length === 0) {
				return { status: "error", message: "No Project step found." };
			}

			//Filter users public data from steps
			const updater = filterTools.filterUserOutputFields(projectSteps.steps.updatedBy, "unknown").user;

			const stepsList = projectSteps.steps.stepsList;

			const stepsOutput = {
				stepsList: stepsList,
				createdAt: projectSteps.steps.createdAt,
				updatedAt: projectSteps.steps.updatedAt,
				updatedBy: updater,
			};

			logger.info(`Project steps retrieved successfully.`);
			return { status: "success", message: `Project steps retrieved successfully.`, stepsOutput };
		}
		if (actionType === "published") {
			const projectSteps = await Project.findOne({ _id: objectIdProjectId })
				.select("-_id steps")
				.populate([{ path: "steps.stepsList.status", select: "status colors" }]);
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
				stepsList: publishedSteps,
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

const editQAs = async (projectId, userIdUpdater, QAs, actionType) => {
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
			const alreadyExistingQAs = project.QAs.QAsList;

			if (alreadyExistingQAs && alreadyExistingQAs.length > 0) {
				return { status: "error", message: "Q&A already present for this project. Cannot create new Q&A." };
			}

			// Create new QAs
			for (const QA of QAs) {
				const newQA = {
					question: QA.question,
					response: QA.response || "",
					published: QA.published ? true : false,
				};
				project.QAs.QAsList.push(newQA);
			}

			// Update timestamps and the user who made the changes
			project.updatedBy = objectIdUserIdUpdater;
			project.QAs.updatedBy = objectIdUserIdUpdater;
			project.QAs.createdAt = DateTime.now().toHTTP();
			project.QAs.updatedAt = DateTime.now().toHTTP();

			// Save the updated project
			await project.save();

			logger.info(`Project Q&A created successfully. Project ID: ${projectId} - User ID updater: ${userIdUpdater}`);
			return { status: "success", message: "Project Q&A created successfully." };
		}

		if (actionType === "update") {
			// Check if there are already QAs
			if (!project.QAs.QAsList || project.QAs.QAsList.length === 0) {
				return { status: "error", message: "No Q&A found for this project." };
			}

			// Update all QAs with the provided data
			project.QAs.QAsList = QAs.map((updatedQA) => ({
				question: updatedQA.question,
				response: updatedQA.response || "",
				published: updatedQA.published ? true : false,
			}));

			// Update timestamps and the user who made the changes
			project.updatedBy = objectIdUserIdUpdater;
			project.QAs.updatedBy = objectIdUserIdUpdater;
			project.QAs.updatedAt = DateTime.now().toHTTP();

			// Save the updated project
			await project.save();

			logger.info(`Project Q&A updated successfully. Project ID: ${projectId} - User ID updater: ${userIdUpdater}`);
			return { status: "success", message: "Project Q&A updated successfully." };
		}
		if (actionType === "publish" || actionType === "unpublish") {
			const QAQuestion = QAs;
			// Find the QA with the given question
			const QAToPublish = project.QAs.QAsList.find((QA) => QA.question === QAQuestion);

			if (!QAToPublish) {
				return { status: "error", message: "Q&A not found." };
			}

			if (actionType === "publish") {
				// Check if the QA is already published
				if (QAToPublish.published) {
					return { status: "error", message: "Q&A is already published." };
				}
				// Publish the QA
				QAToPublish.published = true;
			}

			if (actionType === "unpublish") {
				// Check if the QA is already published
				if (!QAToPublish.published) {
					return { status: "error", message: "Q&A is already unpublished." };
				}
				// Unpublish the QA
				QAToPublish.published = false;
			}

			// Update timestamps and the user who made the changes
			project.updatedBy = objectIdUserIdUpdater;
			project.QAs.updatedBy = objectIdUserIdUpdater;
			project.QAs.updatedAt = DateTime.now().toHTTP();

			// Save the updated project
			await project.save();

			logger.info(`Project Q&A ${actionType}ed successfully. Project ID: ${projectId} - User ID updater: ${userIdUpdater}`);
			return { status: "success", message: `Project Q&A ${actionType}ed successfully` };
		}
		if (actionType === "remove") {
			const QAQuestion = QAs;
			// Find the index of the QA with the given question
			const QAIndex = project.QAs.QAsList.findIndex((QA) => QA.question === QAQuestion);

			if (QAIndex === -1) {
				return { status: "error", message: "Q&A not found." };
			}

			// Remove the QA at the found index
			project.QAs.QAsList.splice(QAIndex, 1);

			// Update timestamps and the user who made the changes
			project.updatedBy = objectIdUserIdUpdater;
			project.QAs.updatedBy = objectIdUserIdUpdater;
			project.QAs.updatedAt = DateTime.now().toHTTP();

			// Save the updated project
			await project.save();

			logger.info(`Project Q&A removed successfully. Project ID: ${projectId} - User ID updater: ${userIdUpdater}`);
			return { status: "success", message: "Project Q&A removed successfully." };
		}
	} catch (error) {
		return { status: "error", message: error.message };
	}
};

const retrieveProjectQAs = async (projectId, actionType) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		if (actionType === "all") {
			const projectQAs = await Project.findOne({ _id: objectIdProjectId })
				.select("-_id QAs")
				.populate([{ path: "QAs.updatedBy", select: "username profilePicture userId" }]);

			if (!projectQAs) {
				return { status: "error", message: "Project not found." };
			}

			if (!projectQAs.QAs.QAsList || projectQAs.QAs.QAsList.length === 0) {
				return { status: "error", message: "No Project Q&A found." };
			}

			//Filter users public data from QAs
			const updater = filterTools.filterUserOutputFields(projectQAs.QAs.updatedBy, "unknown").user;

			const QAsList = projectQAs.QAs.QAsList;

			const QAsOutput = {
				QAsList: QAsList,
				createdAt: projectQAs.QAs.createdAt,
				updatedAt: projectQAs.QAs.updatedAt,
				updatedBy: updater,
			};

			logger.info(`Project Q&A retrieved successfully.`);
			return { status: "success", message: `Project Q&A retrieved successfully.`, QAsOutput };
		}
		if (actionType === "published") {
			const projectQAs = await Project.findOne({ _id: objectIdProjectId }).select("-_id QAs");

			if (!projectQAs) {
				return { status: "error", message: "Project not found." };
			}

			if (!projectQAs.QAs.QAsList) {
				return { status: "error", message: "No Project Q&A found." };
			}

			const QAsList = projectQAs.QAs.QAsList;

			// Filter QAs that are set to published
			const publishedQAs = QAsList.filter((QA) => QA.published);

			const QAsOutput = {
				QAsList: publishedQAs,
				createdAt: projectQAs.QAs.createdAt,
				updatedAt: projectQAs.QAs.updatedAt,
			};

			logger.info(`Project Q&A retrieved successfully.`);
			return { status: "success", message: `Project Q&A retrieved successfully.`, QAsOutput };
		}
	} catch (error) {
		logger.error("Error while retrieving project Q&A:", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the project Q&A.",
		};
	}
};

module.exports = {
	editSteps,
	retrieveProjectSteps,
	editQAs,
	retrieveProjectQAs,
};
