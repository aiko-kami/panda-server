const useEmailAddressVerificationTemplate = (emailInputs) => {
	const usernameCapitalized = emailInputs.usernameCapitalized || "username";
	const verificationLink = emailInputs.verificationLink || "verification link";

	const emailContent = `<table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4"><tbody><tr><td><table style="max-width:600px;margin:auto;background-color:#fff;padding:20px" border="0" width="100%" cellspacing="0" cellpadding="0" align="center"><tbody><tr><td style="text-align:center;padding:20px"><img style="max-width:100%" src="https://media.istockphoto.com/id/1223088904/fr/vectoriel/drapeau-ruban-bienvenue-vieille-banni%C3%A8re-de-drapeau-d%C3%A9cole.jpg?s=612x612&amp;w=0&amp;k=20&amp;c=Moa0QDDHk8Y8b434e6pZpytkQ5EkWrxV8rSiScGJ0t0=" alt="Welcome Banner"></td></tr><tr><td style="text-align:center;padding:10px"><h2>Welcome to Sheppy!</h2></td></tr><tr><td style="padding:20px"><p>Hello <strong>${usernameCapitalized}</strong>,</p><p>Thank you for signing up! We're excited you're joining the community.</p><p>You're just a few clicks away from building your greatest projects. Ready to get started?</p><p>To complete your registration, please verify your email address by clicking the link below:</p><p>&nbsp;</p><p style="text-align:center"><a style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px" href="${verificationLink}">Activate my account</a></p><p>&nbsp;</p><p>If you did not create an account on Sheepy, you can safely ignore this email.</p><p>&nbsp;</p><p>See you soon.</p><p style="text-align:right"><br>Sheppy team</p></td></tr></tbody></table></td></tr></tbody></table>`;

	return emailContent;
};

const useResetPasswordTemplate = (emailInputs) => {
	const usernameCapitalized = emailInputs.usernameCapitalized || "username";
	const resetLink = emailInputs.resetLink || "reset link";

	const emailContent = `<table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4"><tbody><tr><td><table style="max-width:600px;margin:auto;background-color:#fff;padding:20px;height:435.812px" border="0" width="100%" cellspacing="0" cellpadding="0" align="center"><tbody><tr style="height:41.8125px"><td style="text-align:center;padding:10px;height:41.8125px"><h2>Password Reset</h2></td></tr><tr style="height:394px"><td style="padding:20px;height:394px"><p>Hello <strong>${usernameCapitalized}</strong>,</p><p>We received a request to reset the password for your account.</p><p>Please click the link below to reset your password:</p><p>&nbsp;</p><p style="text-align:center"><a style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px" href="${resetLink}">Reset Password</a></p><p>&nbsp;</p><p>If you did not request a password reset, you can safely ignore this email.</p><p>&nbsp;</p><p>See you soon.</p><p style="text-align:right"><br>Sheppy team</p></td></tr></tbody></table></td></tr></tbody></table>`;

	return emailContent;
};

const useProjectSubmittedTemplate = (emailInputs) => {
	const usernameCapitalized = emailInputs.usernameCapitalized || "project creator username";
	const projectTitle = emailInputs.projectTitle || "project title";
	const category = emailInputs.category || "project category";
	const subCategory = emailInputs.subCategory || "project sub-category";
	const submissionDateTime = emailInputs.submissionDateTime || "project submission date time";
	const projectSummary = emailInputs.projectSummary || "project summary";
	const projectId = emailInputs.projectId || "project ID";
	const adminLink = emailInputs.adminLink || "admin link";

	const emailContent = `<table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4"><tbody><tr><td><table style="max-width:600px;margin:auto;background-color:#fff;padding:20px" border="0" width="100%" cellspacing="0" cellpadding="0" align="center"><tbody><tr><td style="text-align:center;padding:20px"><img style="max-width:100%" src="https://media.istockphoto.com/id/1223088904/fr/vectoriel/drapeau-ruban-bienvenue-vieille-banni%C3%A8re-de-drapeau-d%C3%A9cole.jpg?s=612x612&amp;w=0&amp;k=20&amp;c=Moa0QDDHk8Y8b434e6pZpytkQ5EkWrxV8rSiScGJ0t0=" alt="Welcome Banner"></td></tr><tr><td style="text-align:center;padding:10px"><h2>A new project has arrived!</h2></td></tr><tr><td style="padding:20px"><div>Dear Admin,<br><div>&nbsp;</div><div>A new project has been submitted and requires your attention for approval. Please review the project details and take the necessary actions to either approve or reject the project.</div><br><div><h3>Project Details:</h3></div><div><b>Project Title:</b> ${projectTitle}</div><div><b>Category:</b> ${category}</div><div><b>Sub-category:</b> ${subCategory}</div><div><b>Submitted By:</b> ${usernameCapitalized}</div><div><b>Submission Date:</b> ${submissionDateTime}</div><div><b>Project Description:</b> ${projectSummary}</div><div><b>Project ID:</b> ${projectId}</div><br><div><h3>Action Required:</h3></div><div>If you approve the project, please log in with your admin account and process the approval.</div><div>If you reject the project, provide a reason for rejection.</div><br><div><b>Project Approval Link:</b> ${adminLink}</div><br><div>Thank you for your prompt attention to this matter.</div><br><div>Best regards,</div><br><div style="text-align:right">Sheppy team</div></div></td></tr></tbody></table></td></tr></tbody></table>`;

	return emailContent;
};

module.exports = {
	useEmailAddressVerificationTemplate,
	useResetPasswordTemplate,
	useProjectSubmittedTemplate,
};
