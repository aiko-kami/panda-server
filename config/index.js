//Configuration variables

const config = {
	// Project possible values
	// Note: the first value is used for default value
	project_status: ["draft", "submitted", "active", "on hold", "completed", "archived", "cancelled", "rejected"],
	project_visibility: ["public", "private"],
	project_members_roles: ["owner", "member"],
	project_approval: ["approved", "rejected"],
	project_step_status: ["not started", "in progress", "completed"],

	// Join Project possible values
	// Note: the first value is used for default value
	join_project_status: ["draft", "sent", "read", "accepted", "refused", "cancelled"],

	// User data visibility possible values
	// Note: the first value is used for default value
	user_visibility: ["public", "private", "friends"],

	// Website display mode possible values
	// Note: the first value is used for default value
	website_display_mode: ["table", "cards"],

	// Website appearance possible values
	// Note: the first value is used for default value
	website_appearance: ["night", "dark", "light", "unreal"],

	// Website language possible values
	// Note: the first value is used for default value
	website_language: ["English", "Français", "Español"],

	// User email min and max length
	user_email_min_length: 1,
	user_email_max_length: 255,
	// User username min and max length
	user_username_min_length: 3,
	user_username_max_length: 32,
	// User password min and max length
	user_password_min_length: 8,
	user_password_max_length: 125,
	// User description max length
	user_description_max_length: 200,
	// User bio max length
	user_bio_max_length: 700,

	// Project title min and max length
	project_title_min_length: 4,
	project_title_max_length: 100,
	// Project goal min and max length
	project_goal_min_length: 10,
	project_goal_max_length: 500,
	// Project summary min and max length
	project_summary_min_length: 10,
	project_summary_max_length: 300,
	// Project description min and max length
	project_description_min_length: 20,
	project_description_max_length: 10000,
};

module.exports = config;
