const { projectValidation } = require("../../../utils");

const { validateNewProjectInputs } = projectValidation;

//validateNewProjectInputs

describe("validateNewProjectInputs", () => {
	test("should return success when valid project data is provided", () => {
		const projectData = {
			title: "Project Title",
			goal: "Project Goal",
			summary: "Project Summary",
			description: "Project Description with correct length",
			categoryId: "12345",
			subCategory: "Subcategory",
			tagsIds: ["tag1", "tag2"],
			location: {
				city: "City",
				country: "Country",
			},
			talentsNeeded: ["Skill1", "Skill2"],
			startDate: 1630000000,
			objectives: "Project Objectives",
			creatorMotivation: "Motivation",
			visibility: "public",
			attachments: "Attachment1, Attachment2",
		};

		const result = validateNewProjectInputs(projectData);

		expect(result).toEqual({
			status: "success",
			message: "All project inputs are valid.",
		});
	});

	test("should return error when invalid data types are provided", () => {
		const projectData = {
			title: "Project Title",
			goal: "Project Goal",
			// Invalid data type for summary (should be a string)
			summary: 123,
			description: "Project Description with correct length",
			// Invalid data type for categoryId (should be a string)
			categoryId: 123,
			subCategory: "Subcategory",
			tagsIds: ["tag1", "tag2"],
			location: {
				city: "City",
				country: "Country",
			},
			talentsNeeded: ["Skill1", "Skill2"],
			startDate: 1630000000,
			objectives: "Project Objectives",
			creatorMotivation: "Motivation",
			visibility: "public",
			attachments: "Attachment1, Attachment2",
		};

		const result = validateNewProjectInputs(projectData);

		expect(result).toEqual({
			status: "error",
			message: "Invalid type of data.",
		});
	});

	test("should return error when title is missing", () => {
		const projectData = {
			// Missing title
			title: "",
			goal: "Project Goal",
			summary: "Project Summary",
			description: "Project Description with correct length",
			categoryId: "12345",
			subCategory: "Subcategory",
			tagsIds: ["tag1", "tag2"],
			location: {
				city: "City",
				country: "Country",
			},
			talentsNeeded: ["Skill1", "Skill2"],
			startDate: 1630000000,
			objectives: "Project Objectives",
			creatorMotivation: "Motivation",
			visibility: "public",
			attachments: "Attachment1, Attachment2",
		};

		const result = validateNewProjectInputs(projectData);

		expect(result).toEqual({
			status: "error",
			message: "Title is required.",
		});
	});

	test("should return error when goal is missing", () => {
		const projectData = {
			title: "Project Title",
			goal: "",
			summary: "Project Summary",
			description: "Project Description with correct length",
			categoryId: "12345",
			subCategory: "Subcategory",
			tagsIds: ["tag1", "tag2"],
			location: {
				city: "City",
				country: "Country",
			},
			talentsNeeded: ["Skill1", "Skill2"],
			startDate: 1630000000,
			objectives: "Project Objectives",
			creatorMotivation: "Motivation",
			visibility: "public",
			attachments: "Attachment1, Attachment2",
		};

		const result = validateNewProjectInputs(projectData);

		expect(result).toEqual({
			status: "error",
			message: "Goal is required.",
		});
	});

	test("should return error when summary is missing", () => {
		const projectData = {
			title: "Project Title",
			goal: "Project Goal",
			summary: "",
			description: "Project Description with correct length",
			categoryId: "12345",
			subCategory: "Subcategory",
			tagsIds: ["tag1", "tag2"],
			location: {
				city: "City",
				country: "Country",
			},
			talentsNeeded: ["Skill1", "Skill2"],
			startDate: 1630000000,
			objectives: "Project Objectives",
			creatorMotivation: "Motivation",
			visibility: "public",
			attachments: "Attachment1, Attachment2",
		};

		const result = validateNewProjectInputs(projectData);

		expect(result).toEqual({
			status: "error",
			message: "Summary is required.",
		});
	});

	test("should return error when description is missing", () => {
		const projectData = {
			title: "Project Title",
			goal: "Project Goal",
			summary: "Project Summary",
			description: "",
			categoryId: "12345",
			subCategory: "Subcategory",
			tagsIds: ["tag1", "tag2"],
			location: {
				city: "City",
				country: "Country",
			},
			talentsNeeded: ["Skill1", "Skill2"],
			startDate: 1630000000,
			objectives: "Project Objectives",
			creatorMotivation: "Motivation",
			visibility: "public",
			attachments: "Attachment1, Attachment2",
		};

		const result = validateNewProjectInputs(projectData);

		expect(result).toEqual({
			status: "error",
			message: "Description is required.",
		});
	});

	test("should return error when categoryId is missing", () => {
		const projectData = {
			title: "Project Title",
			goal: "Project Goal",
			summary: "Project Summary",
			description: "Project Description with correct length",
			categoryId: "",
			subCategory: "Subcategory",
			tagsIds: ["tag1", "tag2"],
			location: {
				city: "City",
				country: "Country",
			},
			talentsNeeded: ["Skill1", "Skill2"],
			startDate: 1630000000,
			objectives: "Project Objectives",
			creatorMotivation: "Motivation",
			visibility: "public",
			attachments: "Attachment1, Attachment2",
		};

		const result = validateNewProjectInputs(projectData);

		expect(result).toEqual({
			status: "error",
			message: "Category is required.",
		});
	});

	test("should return error when talentsNeeded is missing", () => {
		const projectData = {
			title: "Project Title",
			goal: "Project Goal",
			summary: "Project Summary",
			description: "Project Description with correct length",
			categoryId: "12345",
			subCategory: "Subcategory",
			tagsIds: ["tag1", "tag2"],
			location: {
				city: "City",
				country: "Country",
			},
			talentsNeeded: [],
			startDate: 1630000000,
			objectives: "Project Objectives",
			creatorMotivation: "Motivation",
			visibility: "public",
			attachments: "Attachment1, Attachment2",
		};

		const result = validateNewProjectInputs(projectData);

		expect(result).toEqual({
			status: "error",
			message: "Talents needed are required.",
		});
	});

	test("should return error when visibility is missing", () => {
		const projectData = {
			title: "Project Title",
			goal: "Project Goal",
			summary: "Project Summary",
			description: "Project Description with correct length",
			categoryId: "12345",
			subCategory: "Subcategory",
			tagsIds: ["tag1", "tag2"],
			location: {
				city: "City",
				country: "Country",
			},
			talentsNeeded: ["Skill1", "Skill2"],
			startDate: 1630000000,
			objectives: "Project Objectives",
			creatorMotivation: "Motivation",
			visibility: "",
			attachments: "Attachment1, Attachment2",
		};

		const result = validateNewProjectInputs(projectData);

		expect(result).toEqual({
			status: "error",
			message: "Visibility is required.",
		});
	});

	test("should return error when title is too long", () => {
		const projectData = {
			title:
				"This is a very long title that exceeds the maximum character limit of 100 characters.iuoewrfhawilefuahwelif", // Title is too long (more than 100 characters)
			goal: "Project Goal",
			summary: "Project Summary",
			description: "Project Description with correct length",
			categoryId: "12345",
			subCategory: "Subcategory",
			tagsIds: ["tag1", "tag2"],
			location: {
				city: "City",
				country: "Country",
			},
			talentsNeeded: ["Skill1", "Skill2"],
			startDate: 1630000000,
			objectives: "Project Objectives",
			creatorMotivation: "Motivation",
			visibility: "public",
			attachments: "Attachment1, Attachment2",
		};

		const result = validateNewProjectInputs(projectData);

		expect(result).toEqual({
			status: "error",
			message: "Title must be 4-100 characters.",
		});
	});

	test("should return error when goal is too short", () => {
		const projectData = {
			title: "Project Title",
			// Goal is too short (less than 10 characters)
			goal: "Short",
			summary: "Project Summary",
			description: "Project Description with correct length",
			categoryId: "12345",
			subCategory: "Subcategory",
			tagsIds: ["tag1", "tag2"],
			location: {
				city: "City",
				country: "Country",
			},
			talentsNeeded: ["Skill1", "Skill2"],
			startDate: 1630000000,
			objectives: "Project Objectives",
			creatorMotivation: "Motivation",
			visibility: "public",
			attachments: "Attachment1, Attachment2",
		};

		const result = validateNewProjectInputs(projectData);

		expect(result).toEqual({
			status: "error",
			message: "Goal must be 10-500 characters.",
		});
	});

	test("should return error when summary is too short", () => {
		const projectData = {
			title: "Project Title",
			goal: "Project Goal",
			summary: "S", // Summary is too short (less than 10 characters)
			description: "Project Description with correct length",
			categoryId: "12345",
			subCategory: "Subcategory",
			tagsIds: ["tag1", "tag2"],
			location: {
				city: "City",
				country: "Country",
			},
			talentsNeeded: ["Skill1", "Skill2"],
			startDate: 1630000000,
			objectives: "Project Objectives",
			creatorMotivation: "Motivation",
			visibility: "public",
			attachments: "Attachment1, Attachment2",
		};

		const result = validateNewProjectInputs(projectData);

		expect(result).toEqual({
			status: "error",
			message: "Summary must be 10-300 characters.",
		});
	});

	test("should return error when description is too short", () => {
		const projectData = {
			title: "Project Title",
			goal: "Project Goal",
			summary: "Project Summary",
			description: "Project Desc",
			categoryId: "12345",
			subCategory: "Subcategory",
			tagsIds: ["tag1", "tag2"],
			location: {
				city: "City",
				country: "Country",
			},
			talentsNeeded: ["Skill1", "Skill2"],
			startDate: 1630000000,
			objectives: "Project Objectives",
			creatorMotivation: "Motivation",
			visibility: "public",
			attachments: "Attachment1, Attachment2",
		};

		const result = validateNewProjectInputs(projectData);

		expect(result).toEqual({
			status: "error",
			message: "Description must be 20-2000 characters.",
		});
	});

	test("should return error when visibility is not in the correct list", () => {
		const projectData = {
			title: "Project Title",
			goal: "Project Goal",
			summary: "Project Summary",
			description: "Project Desc",
			categoryId: "12345",
			subCategory: "Subcategory",
			tagsIds: ["tag1", "tag2"],
			location: {
				city: "City",
				country: "Country",
			},
			talentsNeeded: ["Skill1", "Skill2"],
			startDate: 1630000000,
			objectives: "Project Objectives",
			creatorMotivation: "Motivation",
			visibility: "wrong",
			attachments: "Attachment1, Attachment2",
		};

		const result = validateNewProjectInputs(projectData);

		expect(result).toEqual({
			status: "error",
			message: "Invalid project visibility.",
		});
	});
});
