// aggregateQueries.js

const projectLikePublicQuery = (objectIdProjectId) => [
	{
		$match: { project: objectIdProjectId }, // Filter by project ID
	},
	{
		$lookup: {
			from: "users", // Collection containing users
			localField: "user", // Field in LikeProject collection
			foreignField: "_id", // Field in users collection
			as: "user", // Output field containing user information
		},
	},
	{
		$unwind: "$user", // Flatten the user array
	},
	{
		$project: {
			_id: 0,
			likeProjectId: 1,
			createdAt: {
				$cond: {
					if: "$user.projectLikePublic",
					then: "$createdAt",
					else: "$$REMOVE",
				},
			},
			user: {
				$cond: {
					if: "$user.projectLikePublic",
					then: {
						username: "$user.username",
						profilePicture: "$user.profilePicture",
						userId: "$user.userId",
					},
					else: "private",
				},
			},
		},
	},
	{
		$sort: { createdAt: -1 }, // Sort by createdAt field
	},
];

module.exports = {
	projectLikePublicQuery,
};
