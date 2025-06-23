const FILE_SIZE_LIMITS = {
	profilePicture: 1024 * 1024 * 3, // 3MB
	backgroundPicture: 1024 * 1024 * 3, // 3MB
	cover: 1024 * 1024 * 6, // 6MB
	attachment: 1024 * 1024 * 10, // 10MB
};

const FILE_SIZE_ERRORS = {
	profilePicture: "Profile picture file is too large. Maximum size allowed is 3MB.",
	backgroundPicture: "Background picture file is too large. Maximum size allowed is 3MB.",
	cover: "Cover picture file is too large. Maximum size allowed is 6MB.",
	attachment: "Attachment file is too large. Maximum size allowed is 10MB.",
};

const ALLOWED_FILE_TYPES = {
	profilePicture: ["image"],
	backgroundPicture: ["image"],
	cover: ["image"],
	attachment: ["document", "image"],
};

const UPLOAD_PATHS = {
	profilePicture: "user_profile_pictures/",
	backgroundPicture: "user_background_pictures/",
	cover: "project_covers/",
	attachment: (projectId) => `project_attachments/${projectId}/`,
};

module.exports = {
	FILE_SIZE_LIMITS,
	FILE_SIZE_ERRORS,
	ALLOWED_FILE_TYPES,
	UPLOAD_PATHS,
};
