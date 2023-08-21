const { validation } = require("../../utils");

const { validateRegistrationInputs, validateLoginInputs, validateEmail, validatePassword } =
	validation;

//validateRegistrationInputs

test("Testing valid registration inputs", () => {
	const result = validateRegistrationInputs(
		"john_doe123",
		"john@example.com",
		"StrongPass123$",
		"StrongPass123$"
	);
	expect(result.status).toBe("success");
	expect(result.message).toBe("All registration inputs are valid.");
});

test("Testing empty username", () => {
	const result = validateRegistrationInputs(
		"",
		"john@example.com",
		"StrongPass123$",
		"StrongPass123$"
	);
	expect(result.status).toBe("error");
	expect(result.message).toBe("Username required.");
});

test("Testing empty email", () => {
	const result = validateRegistrationInputs("john_doe123", "", "StrongPass123$", "StrongPass123$");
	expect(result.status).toBe("error");
	expect(result.message).toBe("Email required.");
});

test("Testing empty password", () => {
	const result = validateRegistrationInputs(
		"john_doe123",
		"john@example.com",
		"",
		"StrongPass123$"
	);
	expect(result.status).toBe("error");
	expect(result.message).toBe("Password required.");
});

test("Testing empty password confirmation", () => {
	const result = validateRegistrationInputs(
		"john_doe123",
		"john@example.com",
		"StrongPass123$",
		""
	);
	expect(result.status).toBe("error");
	expect(result.message).toBe("Password confirmation required.");
});

test("Testing invalid username format", () => {
	const result = validateRegistrationInputs(
		"john_doe 123",
		"john@example.com",
		"StrongPass123$",
		"StrongPass123$"
	);
	expect(result.status).toBe("error");
	expect(result.message).toBe("Username can contain letters, numbers, dashes and underscores.");
});

test("Testing email not a string", () => {
	const result = validateRegistrationInputs("john_doe123", 123, "StrongPass123$", "StrongPass123$");
	expect(result.status).toBe("error");
	expect(result.message).toBe("Invalid type of data.");
});

test("Testing username too short", () => {
	const result = validateRegistrationInputs(
		"jo",
		"john@example.com",
		"StrongPass123$",
		"StrongPass123$"
	);
	expect(result.status).toBe("error");
	expect(result.message).toBe("Username can be 3-32 characters.");
});

test("Testing email too long", () => {
	const longEmail = "a".repeat(255) + "@example.com";
	const result = validateRegistrationInputs(
		"john_doe123",
		longEmail,
		"StrongPass123$",
		"StrongPass123$"
	);
	expect(result.status).toBe("error");
	expect(result.message).toBe("Email can contain up to 255 characters.");
});

test("Testing password too long", () => {
	const longPassword = "a".repeat(126) + "StrongPass123$";
	const result = validateRegistrationInputs(
		"john_doe123",
		"john@example.com",
		longPassword,
		longPassword
	);
	expect(result.status).toBe("error");
	expect(result.message).toBe("Password can contain up to 125 characters.");
});

test("Testing password and confirmation not matching", () => {
	const result = validateRegistrationInputs(
		"john_doe123",
		"john@example.com",
		"StrongPass123$",
		"MismatchedPass123$"
	);
	expect(result.status).toBe("error");
	expect(result.message).toBe("Password and confirmation don't match.");
});

//validateLoginInputs

test("Testing valid login inputs with email", () => {
	const result = validateLoginInputs("test@example.com", "Password123$");
	expect(result.status).toBe("success");
	expect(result.message).toBe("All login inputs are valid.");
});

test("Testing valid login inputs with username", () => {
	const result = validateLoginInputs("testusername", "Password123$");
	expect(result.status).toBe("success");
	expect(result.message).toBe("All login inputs are valid.");
});

test("Testing empty identifier (empty string)", () => {
	const result = validateLoginInputs("", "Password123$");
	expect(result.status).toBe("error");
	expect(result.message).toBe("Identifier is required.");
});

test("Testing empty identifier (undefined passed)", () => {
	const result = validateLoginInputs(undefined, "Password123$");
	expect(result.status).toBe("error");
	expect(result.message).toBe("Invalid type of data.");
});

test("Testing empty password (empty string)", () => {
	const result = validateLoginInputs("test@example.com", "");
	expect(result.status).toBe("error");
	expect(result.message).toBe("Password is required.");
});

test("Testing empty password (no data passed)", () => {
	const result = validateLoginInputs("test@example.com");
	expect(result.status).toBe("error");
	expect(result.message).toBe("Invalid type of data.");
});

test("Testing invalid input type", () => {
	const result = validateLoginInputs(null, "Password123$");
	expect(result.status).toBe("error");
	expect(result.message).toBe("Invalid type of data.");
});

//validateEmail

test("Testing a valid email address", () => {
	const result = validateEmail("test@example.com");
	expect(result.status).toBe("success");
});

test("Testing an invalid email address format (invalid-email)", () => {
	const result = validateEmail("invalid-email");
	expect(result.status).toBe("error");
	expect(result.message).toBe("Email wrongly formatted.");
});

test("Testing an invalid email address format (@)", () => {
	const result = validateEmail("@");
	expect(result.status).toBe("error");
	expect(result.message).toBe("Email wrongly formatted.");
});

test("Testing an invalid data type (number)", () => {
	const result = validateEmail(123); // Passing a number instead of a string
	expect(result.status).toBe("error");
	expect(result.message).toBe("Invalid type of data.");
});

test("Testing a missing email address (no data passed)", () => {
	const result = validateEmail(); // Passing nothing
	expect(result.status).toBe("error");
	expect(result.message).toBe("Invalid type of data.");
});

test("Testing a missing email address (empty string)", () => {
	const result = validateEmail(""); // Calling the function without an argument
	expect(result.status).toBe("error");
	expect(result.message).toBe("Email required");
});

// validatePassword

test("Testing a valid password", () => {
	const result = validatePassword("StrongPass123$", "StrongPass123$");
	expect(result.status).toBe("success");
});

test("Testing a password without a confirmation", () => {
	const result = validatePassword("StrongPass123$", "");
	expect(result.status).toBe("error");
	expect(result.message).toBe("Password confirmation required.");
});

test("Testing a password confirmation without a password", () => {
	const result = validatePassword("", "StrongPass123$");
	expect(result.status).toBe("error");
	expect(result.message).toBe("Password required.");
});

test("Testing a missing password and confirmation (empty strings)", () => {
	const result = validatePassword("", "");
	expect(result.status).toBe("error");
	expect(result.message).toBe("Password required.");
});

test("Testing a missing password and confirmation (no data passed)", () => {
	const result = validatePassword();
	expect(result.status).toBe("error");
	expect(result.message).toBe("Password required.");
});

test("Testing a short password", () => {
	const result = validatePassword("Short", "Short");
	expect(result.status).toBe("error");
	expect(result.message).toBe(
		"Password must contain at least 8 characters, a lowercase letter, an uppercase letter, a number, and a special character."
	);
});

test("Testing a password without an uppercase letter", () => {
	const result = validatePassword("weakpassword123$", "weakpassword123$");
	expect(result.status).toBe("error");
	expect(result.message).toBe(
		"Password must contain at least 8 characters, a lowercase letter, an uppercase letter, a number, and a special character."
	);
});

test("Testing a password without a number", () => {
	const result = validatePassword("NoNumberPass$", "NoNumberPass$");
	expect(result.status).toBe("error");
	expect(result.message).toBe(
		"Password must contain at least 8 characters, a lowercase letter, an uppercase letter, a number, and a special character."
	);
});

test("Testing a password without a special character", () => {
	const result = validatePassword("NoSpecialChar123", "NoSpecialChar123");
	expect(result.status).toBe("error");
	expect(result.message).toBe(
		"Password must contain at least 8 characters, a lowercase letter, an uppercase letter, a number, and a special character."
	);
});
