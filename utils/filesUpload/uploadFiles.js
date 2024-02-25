const { S3Client, DeleteObjectCommand, PutObjectTaggingCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

const logger = require("../logger");

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

	// Check allowed extensions and Mime type
	const isAllowedExt = fileExts.includes(path.extname(file.originalname.toLowerCase()));
	const isAllowedMimeType = file.mimetype === "image/jpeg" || file.mimetype === "image/png";

	if (isAllowedExt && isAllowedMimeType) {
		return cb(null, true); // no errors
	} else {
		// pass error msg to callback, which can be displaye in frontend
		cb("Error: File type not allowed.");
	}
}

const fileUpload = (req, destinationPath, name) => {
	return multer({
		storage: multerS3({
			s3,
			bucket: process.env.AWS_BUCKET,
			acl: "public-read",
			metadata: (req, file, cb) => {
				cb(null, { fieldname: file.fieldname });
			},
			key: (req, file, cb) => {
				const fileName = Date.now() + name + path.extname(file.originalname.toLowerCase());
				var fullPath = destinationPath + fileName;
				cb(null, fullPath);
			},
			contentType: multerS3.AUTO_CONTENT_TYPE,
		}),
		fileFilter: (req, file, callback) => {
			sanitizeFile(file, callback);
		},
		limits: {
			fileSize: 1024 * 1024 * 2, // 2mb file size
		},
	});
};

const applyObjectTags = async (objectKey, tags) => {
	console.log("🚀 ~ applyObjectTags ~ tags:", tags);

	console.log("🚀 ~ applyObjectTags ~ objectKey:", objectKey);

	try {
		const command = new PutObjectTaggingCommand({
			Bucket: process.env.AWS_BUCKET,
			Key: objectKey,
			Tagging: { TagSet: tags },
		});
		await s3.send(command);
		return true;
	} catch (err) {
		console.error("Error", err);
		return false;
	}
};

const checkInputFile = (req) => {
	try {
		if (req.headers["content-type"] && req.headers["content-type"].startsWith("multipart/form-data")) {
			return { status: "success", message: "Input file found in the request.", isFile: true };
		} else {
			return { status: "success", message: "Input file not found in the request.", isFile: false };
		}
	} catch (error) {
		logger.error("Error while checking the input file:", error);
		return { status: "error", message: "An error occurred while checking the input file." };
	}
};

const deleteFile = async (objectKey) => {
	try {
		const params = { Bucket: process.env.AWS_BUCKET, Key: objectKey };
		const command = new DeleteObjectCommand(params);
		const output = await s3.send(command);

		logger.info(`File ${objectKey} deleted successfully`);
		return { status: "success", message: `File ${objectKey} deleted successfully.` };
	} catch (error) {
		logger.error(`Error while deleting file ${objectKey}:`, error);
		return { status: "error", message: `Error while deleting file ${objectKey}: ${error.message}` };
	}
};

module.exports = {
	fileUpload,
	applyObjectTags,
	checkInputFile,
	deleteFile,
};
