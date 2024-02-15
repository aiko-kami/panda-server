const { Project, LikeProject } = require("../../models");
const { logger, encryptTools, aggregateQueries, filterTools } = require("../../utils");

/**
 * Update project like. Allow users to like projects and unlike them. Retrieve likes for a project and for a user
 * @param {string} projectId - The ID of the project.
 * @param {string} userId - The ID of the user performing the update.
 * @param {string} newStatus - The new status to be set to the project.
 * @returns {Object} - The result of the update operation.
 */
//Possible status: draft, submitted, active, on hold, completed, archived, cancelled

const updateLike = async (projectId, userId, updateType) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}
		// Convert id to ObjectId
		const objectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserId.status == "error") {
			return { status: "error", message: objectIdUserId.message };
		}

		const project = await Project.findOne({ _id: objectIdProjectId });
		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		if (updateType === "like") {
			const alreadyLikedProject = await LikeProject.findOne({ project: objectIdProjectId, user: objectIdUserId });
			if (alreadyLikedProject) {
				return { status: "error", message: "User already likes this project." };
			}

			// Create a new crush project
			const newLikeProject = new LikeProject({
				project: objectIdProjectId,
				user: objectIdUserId,
			});

			// Save the new like project
			created = await newLikeProject.save();

			//Add encrypted ID
			const encryptedId = encryptTools.convertObjectIdToId(created._id.toString());
			const createdLike = await LikeProject.findOneAndUpdate({ _id: created._id }, { likeProjectId: encryptedId }, { new: true }).select("-_id -__v");

			// Update the project likes counter
			project.likes = project.likes + 1;

			// Save the updated project
			await project.save();

			logger.info(`Project liked successfully. Project ID: ${projectId} - User ID: ${userId} - LikeProject ID: ${encryptedId}`);
			return { status: "success", message: "Project liked successfully." };
		}

		if (updateType === "unlike") {
			const alreadyLikedProject = await LikeProject.findOne({ project: objectIdProjectId, user: objectIdUserId });
			if (!alreadyLikedProject) {
				return { status: "error", message: "User does not already likes this project." };
			}

			// Remove crush project
			await alreadyLikedProject.deleteOne();

			// Update the project likes counter
			project.likes = project.likes - 1;

			// Save the updated project
			await project.save();

			logger.info(`Project unliked successfully. Project ID: ${projectId} - User ID: ${userId}`);
			return { status: "success", message: "Project unliked successfully." };
		}
	} catch (error) {
		return { status: "error", message: error.message };
	}
};
const retrieveUserLikes = async (userId) => {
	try {
		// Convert id to ObjectId
		const objectIdUserId = encryptTools.convertIdToObjectId(userId);
		if (objectIdUserId.status == "error") {
			return { status: "error", message: objectIdUserId.message };
		}

		const userLikes = await LikeProject.find({ user: objectIdUserId })
			.select("-_id likeProjectId createdAt")
			.sort({ createdAt: -1 })
			.populate([
				{
					path: "project",
					select: "-_id title summary category subCategory goal likes cover projectId",
					populate: {
						path: "category",
						select: "-_id name",
					},
				},
			]);

		const nbUserLikes = userLikes.length;

		// If no like found for the project
		if (!userLikes || nbUserLikes === 0) {
			logger.info(`No like found for this user.`);
			return { status: "success", message: `No like found for this user.`, userLikes };
		} else if (nbUserLikes === 1) {
			logger.info(`${nbUserLikes} like for this user retrieved successfully.`);
			return { status: "success", message: `${nbUserLikes} like for this user retrieved successfully.`, userLikes };
		} else logger.info(`${nbUserLikes} likes for this user retrieved successfully.`);
		return { status: "success", message: `${nbUserLikes} likes for this user retrieved successfully.`, userLikes };
	} catch (error) {
		logger.error("Error while retrieving likes:", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the likes.",
		};
	}
};

const retrieveProjectLikes = async (projectId) => {
	try {
		// Convert id to ObjectId
		const objectIdProjectId = encryptTools.convertIdToObjectId(projectId);
		if (objectIdProjectId.status == "error") {
			return { status: "error", message: objectIdProjectId.message };
		}

		const project = await Project.findOne({ _id: objectIdProjectId });
		if (!project) {
			return { status: "error", message: "Project not found." };
		}

		const projectLikes = await LikeProject.aggregate(aggregateQueries.projectLikePublicQuery(objectIdProjectId));

		// If no like found for the project
		if (!projectLikes || projectLikes.length === 0) {
			logger.info(`No like found for this project.`);
			return { status: "success", message: `No like found for this project.`, projectLikes };
		}

		//Filter users public data from comment
		for (let pl of projectLikes) {
			if (pl.user.username) {
				pl.user = filterTools.filterUserOutputFields(pl.user, "unknown").user;
			}
		}

		const nbProjectLikes = projectLikes.length;

		if (nbProjectLikes === 1) {
			logger.info(`${nbProjectLikes} like for this project retrieved successfully.`);
			return { status: "success", message: `${nbProjectLikes} like for this project retrieved successfully.`, projectLikes };
		} else logger.info(`${nbProjectLikes} likes for this project retrieved successfully.`);
		return { status: "success", message: `${nbProjectLikes} likes for this project retrieved successfully.`, projectLikes };
	} catch (error) {
		logger.error("Error while retrieving likes:", error);
		return {
			status: "error",
			message: "An error occurred while retrieving the likes.",
		};
	}
};

module.exports = {
	updateLike,
	retrieveUserLikes,
	retrieveProjectLikes,
};
