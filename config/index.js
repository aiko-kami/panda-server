//Configuration variables

const config = {
	// Project possible values
	// Note: the first value is used for defaulvalue
	project_status: ["draft", "submitted", "active", "on hold", "completed", "archived", "cancelled", "rejected"],
	project_visibility: ["public", "private"],
	project_members_roles: ["owner", "member"],
	project_approval: ["approved", "rejected"],

	// Join Project possible values
	// Note: the first value is used for defaulvalue
	join_project_status: ["draft", "sent", "read", "accepted", "refused", "cancelled"],

	// User data visibility possible values
	// Note: the first value is used for defaulvalue
	user_visibility: ["public", "private", "friends"],
};

module.exports = config;
