const bcrypt = require("bcryptjs");
const { loginService } = require("../../../services");

// Mock
jest.mock("bcryptjs");

// getUserByUsernameOrEmail

// comparePasswords

test("Testing comparePasswords function with matching passwords", async () => {
	const password = "password123";
	const hashedPassword = "hashedPassword123";

	bcrypt.compare.mockResolvedValue(true);

	const result = await loginService.comparePasswords(password, hashedPassword);

	expect(result).toBe(true);
});

test("Testing comparePasswords function with non-matching passwords", async () => {
	const password = "password123";
	const hashedPassword = "hashedPassword123";

	bcrypt.compare.mockResolvedValue(false);

	const result = await loginService.comparePasswords(password, hashedPassword);

	expect(result).toBe(false);
});

test("Testing comparePasswords function with an error", async () => {
	const password = "password123";
	const hashedPassword = "hashedPassword123";

	const errorMessage = "Some error occurred";
	bcrypt.compare.mockRejectedValue(new Error(errorMessage));

	const result = await loginService.comparePasswords(password, hashedPassword);

	expect(result).toEqual({
		status: "error",
		message: "An error occurred while comparing passwords.",
	});
});
