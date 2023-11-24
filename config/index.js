//Configuration variables

const config = {
	// Project possible values
	// Note: the first value is used for defaulvalue
	project_status: ["draft", "submitted", "active", "on hold", "completed", "archived", "cancelled"],
	project_visibility: ["public", "private"],
	project_members_roles: ["owner", "member"],

	// Join Project possible values
	// Note: the first value is used for defaulvalue
	join_project_status: ["draft", "sent", "read", "accepted", "refused", "cancelled"],

	// User data visibility possible values
	// Note: the first value is used for defaulvalue
	user_visibility: ["public", "private", "friends"],
};

module.exports = config;
