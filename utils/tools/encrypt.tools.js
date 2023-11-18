const crypto = require("crypto");
const mongoose = require("mongoose");
const algorithm = "aes-256-ctr";
const encryptionKey = process.env.ID_ENCRYPT_KEY;

// Function to encrypt an ID
const convertObjectIdToId = (dataToEncrypt) => {
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey, "hex"), iv);
	let encrypted = cipher.update(dataToEncrypt, "utf-8", "hex");
	encrypted += cipher.final("hex");
	return `${iv.toString("hex")}-${encrypted}`;
};

// Function to decrypt an ID
const convertIdToObjectId = (encryptedData) => {
	try {
		const [iv, encrypted] = encryptedData.split("-");

		const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryptionKey, "hex"), Buffer.from(iv, "hex"));
		let decrypted = decipher.update(encrypted, "hex", "utf-8");
		decrypted += decipher.final("utf-8");
		return new mongoose.Types.ObjectId(decrypted);
	} catch (error) {
		return { status: "error", message: "wrong ID format" };
	}
};

/*
// Example usage
const originalId = "64ef1fe14db04fbf458c546a";

const encryptedId = convertObjectIdToId(originalId);
console.log("Encrypted ID:", encryptedId);

const decryptedId = convertIdToObjectId(encryptedId);
console.log("original ID:", originalId);
console.log("encrypted ID:", encryptedId);
console.log("decrypted ID:", decryptedId);
*/

module.exports = {
	convertObjectIdToId,
	convertIdToObjectId,
};
