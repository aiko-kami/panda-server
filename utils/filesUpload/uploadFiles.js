const { S3Client, PutObjectTaggingCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

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

const fileUpload = function upload(destinationPath, name) {
	return multer({
		storage: multerS3({
			s3,
			bucket: process.env.AWS_BUCKET,
			acl: "public-read",
			metadata: (req, file, cb) => {
				cb(null, { fieldname: file.fieldname });
			},
			key: (req, file, cb) => {
				const fileName = Date.now() + name;
				var fullPath = destinationPath + fileName;
				cb(null, fullPath);
			},
		}),
		fileFilter: (req, file, callback) => {
			sanitizeFile(file, callback);
		},
		limits: {
			fileSize: 1024 * 1024 * 2, // 2mb file size
		},
	});
};

async function applyObjectTags(objectKey, tags) {
	console.log("🚀 ~ applyObjectTags ~ tags:", tags);

	console.log("🚀 ~ applyObjectTags ~ objectKey:", objectKey);

	try {
		const command = new PutObjectTaggingCommand({
			Bucket: process.env.AWS_BUCKET,
			Key: objectKey,
			Tagging: { TagSet: tags },
		});
		await s3.send(command);
		console.log(`Tags applied to ${objectKey}`);
		return true;
	} catch (err) {
		console.error("Error", err);
		return false;
	}
}

module.exports = {
	fileUpload,
	applyObjectTags,
};
