const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

let s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
	sslEnabled: false,
	s3ForcePathStyle: true,
	signatureVersion: "v4",
});

const s3Storage = multerS3({
	s3,
	bucket: process.env.AWS_BUCKET,
	acl: "public-read",
	metadata: (req, file, cb) => {
		cb(null, { fieldname: file.fieldname });
	},
	key: (req, file, cb) => {
		const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
		cb(null, fileName);
	},
});

// function to sanitize files and send error for unsupported files
function sanitizeFile(file, cb) {
	// Define the allowed extension
	const fileExts = [".png", ".jpg", ".jpeg", ".gif"];

	// Check allowed extensions
	const isAllowedExt = fileExts.includes(path.extname(file.originalname.toLowerCase()));

	// Mime type must be an image
	const isAllowedMimeType = file.mimetype === "image/jpeg" || file.mimetype === "image/png";

	if (isAllowedExt && isAllowedMimeType) {
		return cb(null, true); // no errors
	} else {
		// pass error msg to callback, which can be displaye in frontend
		cb("Error: File type not allowed.");
	}
}

// our middleware
const uploadFile = multer({
	storage: s3Storage,
	fileFilter: (req, file, callback) => {
		sanitizeFile(file, callback);
	},
	limits: {
		fileSize: 1024 * 1024 * 2, // 2mb file size
	},
});

module.exports = {
	uploadFile,
};
