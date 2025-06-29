const { S3Client, CopyObjectCommand, GetObjectCommand, DeleteObjectCommand, PutObjectTaggingCommand } = require("@aws-sdk/client-s3");
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
function sanitizeFile(file, allowedFileTypes, cb) {
	// Define the allowed extension
	const fileTypes = {
		document: {
			extensions: [".pdf", ".doc", ".docx"],
			mimeTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
		},
		image: {
			extensions: [".png", ".jpg", ".jpeg", ".gif"],
			mimeTypes: ["image/jpeg", "image/png"],
		},
	};

	const fileExt = path.extname(file.originalname.toLowerCase());
	const fileMimeType = file.mimetype;

	let validType = false;
	// Iterate over allowed file types
	allowedFileTypes.forEach((type) => {
		const fileTypeData = fileTypes[type];

		if (fileTypeData) {
			const isAllowedExt = fileTypeData.extensions.includes(fileExt);
			const isAllowedMimeType = fileTypeData.mimeTypes.includes(fileMimeType);
			if (isAllowedExt && isAllowedMimeType) {
				validType = true;
			}
		}
	});

	if (!validType) {
		cb(`File type not allowed.`);
	} else {
		cb(null, true); // no errors
	}
}

const fileUpload = (req, destinationPath, name, fileTypes, maxFileSize = 1024 * 1024 * 2) => {
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
			sanitizeFile(file, fileTypes, callback);
		},

		limits: {
			fileSize: maxFileSize,
		},
	});
};

const renameFile = async (projectId, fileKey, attachmentNewTitle) => {
	try {
		const filePath = `project_attachments/${projectId}/`;
		const fileNewKey = filePath + Date.now() + "__projectAttachments__" + projectId + "__" + attachmentNewTitle + path.extname(fileKey.toLowerCase());

		// Copy file with new title
		const paramsCopy = {
			CopySource: `${process.env.AWS_BUCKET}/${fileKey}`,
			Bucket: process.env.AWS_BUCKET,
			Key: fileNewKey,
			MetadataDirective: "COPY",
		};
		const commandCopy = new CopyObjectCommand(paramsCopy);
		const outputCopy = await s3.send(commandCopy);

		// Delete former file
		const paramsDelete = { Bucket: process.env.AWS_BUCKET, Key: fileKey };
		const commandDelete = new DeleteObjectCommand(paramsDelete);
		const outputDelete = await s3.send(commandDelete);

		// Retrieve new file data
		const commandGetObject = new GetObjectCommand({
			Bucket: process.env.AWS_BUCKET,
			Key: fileNewKey,
		});
		const outputGetObject = await s3.send(commandGetObject);

		// Generate new file Url
		const url = `https://${outputGetObject.Body.socket.servername}/${fileNewKey}`;

		// Gather new file data to be returned
		const file = {
			key: fileNewKey,
			size: outputGetObject.ContentLength,
			extension: path.extname(fileNewKey.toLowerCase()).slice(1),
			mimetype: outputGetObject.ContentType,
			link: url,
		};

		logger.info(`File ${fileNewKey} renamed successfully.`);
		return { status: "success", message: `File ${fileNewKey} renamed successfully.`, file };
	} catch (error) {
		logger.error(`Error while renaming file:`, error);
		return { status: "error", message: `Error while renaming file: ${error.message}` };
	}
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

		logger.info(`File ${objectKey} deleted successfully.`);
		return { status: "success", message: `File deleted successfully.` };
	} catch (error) {
		logger.error(`Error while deleting file ${objectKey}:`, error);
		return { status: "error", message: `Error while deleting file ${objectKey}: ${error.message}` };
	}
};

module.exports = {
	fileUpload,
	renameFile,
	applyObjectTags,
	checkInputFile,
	deleteFile,
};
