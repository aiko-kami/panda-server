<div align="center">

[![author - @aiko-kami](https://img.shields.io/badge/author-%40aiko--kami-blue)](https://www.github.com/aiko-kami)
![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/t/aiko-kami/panda-server)
![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/aiko-kami/panda-server/master)
![GitHub repo size](https://img.shields.io/github/repo-size/aiko-kami/panda-server)

![Static Badge](https://img.shields.io/badge/-JavaScript-yellow?logo=nodedotjs&labelColor=gray)
![Static Badge](https://img.shields.io/badge/-ExpressJS-yellow?logo=express&labelColor=gray)
![Static Badge](https://img.shields.io/badge/-MongoDB-brightgreen?logo=mongodb&labelColor=grey)

</div>

## 🐣 Presentation

Panda Server is the backend part of Sheepy, a collaborative platform for projects creation and tracking.

![Logo](https://github.com/aiko-kami/panda-server/blob/master/docs/logo%20New_Panda_server_Sheepy_blue.png?raw=true)

Our mission in Sheepy: Help you bring your projects to life!

You have brilliant project ideas but don't know where to find the right talents to bring it to life? Or perhaps you're a skilled individual eager to contribute to exciting projects but struggle to find the right opportunities?

Sheepy is designed to connect passionate skilled individuals with groundbreaking project ideas. Whether you're a creative artist, a tech wizard, a culinary enthusiast, an aspiring entrepreneur, or a seasoned professional in any field, Sheepy provides you with the community and tools you need to turn your vision into reality.

**What is a project?**

You have an idea and a goal? You want to accomplish something meaningful? You have your project! It can be anything from making a short film about marine wildlife, creating a podcast about local history to forming a music band or developing an original video game...

**Main Features:**

- **<ins>Project Proposals:</ins>** You have an inspiring project idea but need specific talents to make it happen? Post your project proposal on Sheepy! Describe your project's goal and the skills you're seeking. Watch your idea come to life as talented individuals from around the world express their interest in joining your project.

- **<ins>Talent Showcase:</ins>** Are you a designer, developer, musician, writer, or have any other amazing talent to share? Sheepy enables you to create a stunning talent profile showcasing your expertise and experience. Share your portfolio and talents, making it easy for project creators to find and invite you to collaborate.

<br>

```
 Materialize your ideas            ➡ Let us help you build up your next idea
 Put your skills into practice     ➡ Help people looking for your talent and improve your skills by joining a project
 Work as a team                    ➡ You cannot achieve it alone? Find help from our community
 Have fun                          ➡ The most important thing is to do what you like!
```

<br>

Don't let your ideas and talents go to waste – join Sheepy now!

## Table of Contents

- [Presentation](#-presentation)
- [Features](#-features)
- [Installation](#-installation)
- [Code Structure](#-code-structure)
- [API Documentation](#-api-documentation)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Author](#-author)
- [Contributing](#-contributing)
- [Demo](#-demo)
- [Status](#️-status)

## 🧰 Features

- [x] Sign-up & Login
  - [x] Sign-up
  - [x] Validate email address
  - [x] Login
  - [x] Logout
  - [x] Forgot password
- [x] Projects
  - [x] Create new project category
  - [x] Update project category
  - [x] Delete project category
  - [x] Retrieve project category
  - [x] Retrieve project categories
  - [x] Define project model
  - [x] Create new project
  - [x] Define sub-categories in categories
    - [x] Add sub-category
    - [x] Update sub-category
    - [x] Delete sub-category
  - [x] Retrieve project public data (change project model for draft, public (parent level) vs private)
  - [x] Retrieve project overview (when project is public)
  - [x] Edit project
    - [x] Edit project data (title, goal, summary, description, cover, tags, phase, location, talentsNeeded, startDate, objectives, creatorMotivation, visibility)
    - [x] Edit user's project rights
    - [x] Set project owner rights
    - [x] Prevent project owner to change its own rights
    - [x] Edit project members
      - [x] Remove members from a project
      - [x] Edit member (role, talents, startDate)
    - [x] Edit project status
- [x] User profile
  - [x] Edit user profile
  - [x] Change password
  - [x] Talents
    - [x] Define Talent model (name, description, skills, experience, portfolio, certifications)
    - [x] Add talents to user
    - [x] Update talent (verify which info to update and filter on what is not to be updated)
    - [x] Delete talent
- [x] Join project
  - [x] Define join project model
  - [x] Send join project request
  - [x] Send join project invitation
  - [x] Create draft join project request
  - [x] Create draft join project invitation
  - [x] Update draft join project request
  - [x] Retrieve drafts join project requests
  - [x] Retrieve all join project requests
  - [x] Retrieve one join project request
  - [x] Send draft join project request
  - [x] Accept/decline join project request
  - [x] Add new member to a project and set new member project rights
  - [x] Update draft join project invitation
  - [x] Retrieve drafts join project invitations
  - [x] Retrieve all join project invitations
  - [x] Retrieve one join project invitation
  - [x] Send draft join project invitation
  - [x] Accept/decline join project invitation
- [x] Improvements (Brainstorms/clarifications needed)
  - [x] Retrieve specific data (GET requests)
    - [x] Retrieve project all data
    - [x] Retrieve last projects overview (when project is public)
    - [x] Count the number of projects on the plateform (public projects only)
    - [x] Count the number of projects per category (public projects only)
  - [x] Forward when possible the message from the service to the controller and the final output
  - [x] Allow multiple database connections
  - [x] Admin Login
  - [x] User routes (overview and public)
  - [x] Project
    - [x] New fields (coup de coeur)
    - [x] Project routes (creation, draft, submission)
      - [x] Create project draft
      - [x] Update project draft
      - [x] Remove project draft
      - [x] Submit project
      - [x] Send email notification to admin for project submission
      - [x] Retrieve submitted project for admin
      - [x] process project approval
      - [x] Send email notification to project creator for project approval
      - [x] Refactor email template
      - [x] Add project status history (array of updates dateTime and modifiedBy)
      - [x] Complete filterings public data
      - [x] Save project draft
    - [x] projectLikePublic
      - [x] When retrieving project likes: count all like but replace user private likes by "private user"
      - [x] When retrieving user likes: separate userlikes "Project I likes" (private, user userId from login info) and "public user page" (show only if projectLikePublic is true)
    - [x] Use Axios instead of fetch
- [x] likes
  - [x] Add likes to the project model
  - [x] Add like
  - [x] Remove like
  - [x] Retrieve likes
- [x] Q&A
  - [x] Add Q&A to the project model
  - [x] Add Q&A
  - [x] Update Q&A
  - [x] Remove Q&A
  - [x] Publish/Unpublish Q&A
  - [x] Retrieve Q&As
- [x] Steps
  - [x] Add Steps to the project model
  - [x] Add Step
  - [x] Update Step
  - [x] Remove Step
  - [x] Publish/Unpublish Step
  - [x] Retrieve Steps
- [x] Comments
  - [x] Define Comments model
  - [x] Add Comment
  - [x] Answer to a Comment
  - [x] Update Comment
  - [x] Remove Comment
  - [x] Report bad Comment
  - [x] Retrieve Comments
    - [x] Build comments tree by nesting answers in parent comments
    - [x] Reorder parent-comments from newest to oldest

---

### ❤ Last required improvements

- [ ] Fixes ❤
  - [ ] Retrieve project status details (image from user updater) ❤
- [ ] Project ❤
  - [ ] Finish the refactor of project status ❤
  - [ ] Retrieve all former project status ❤
- [ ] User ❤
  - [ ] Update user privacy data (also projectLikePublic to true or false) ❤
- [ ] Upload images ❤

---

### 💛&💚 Complementary features

- Complementary features:
  - [ ] Search 💛
    - [ ] Filter by categories/sub-categories 💛
    - [ ] Filter by locations 💛
    - [ ] Filter by talents needed 💛
    - [ ] Filter by tags 💛
  - [ ] Friends 💛
    - [ ] Define friend model 💛
    - [ ] Send friend request 💛
    - [ ] Cancel friend request 💛
    - [ ] Retrieve friend requests 💛
    - [ ] Accept/decline friend request 💛
  - [ ] Messenger 💛
    - [ ] Define messenger model 💛
  - [ ] O-Auth 💚
  - [ ] Set email templates in database to be editable 💚
  - [ ] Project: 💚
    - [ ] Edit project attachments 💚
    - [ ] Add properties to projects: 💚
      - [ ] Applications authorized 💚
      - [ ] Language(s) of the project 💚
  - [ ] User: 💚
    - [ ] Talents portfolio 💚
    - [ ] Share talent? 💚

Order of priorities: ❤ > 💛 > 💚

## 📦 Installation

Panda server requires [Node.js](https://nodejs.org/) and [MongoDB](https://mongodb.com/) to run.

Install the dependencies with npm:

```bash
  cd panda-server
  npm install
```

Start the server in dev mode:

```bash
  npm run dev
```

## 🗂 Code Structure

```
src
├───.jest                 # Jest imports
├───config                # Configuration related variables
├───controllers           # Route controllers
│   ├───auth
│   ├───project
│   └───user
├───docs                  # Documentation
├───middlewares           # Custom middlewares
├───models                # Mongoose models
├───routes                # Routes
├───services              # Business logic
│   ├───auth
│   ├───project
│   ├───token
│   └───user
├───tests                 # Tests
│   ├───front-end
│   ├───services
│   │   └───auth
│   └───utils
│       └───validation
└───utils                 # Utility classes and functions
    ├───email
    ├───queries
    ├───scripts
    ├───tools
    └───validation
app.js                    # App entry point
```

## 📖 API Documentation

Not available right now.

## 🧭 API Endpoints

List of available routes:

- **Main route**:

| Method | URI | Action |
| ------ | --- | ------ |
| `GET`  | `/` | Home   |

- **Auth routes**:

| Method | URI                                           | Action                    |
| ------ | --------------------------------------------- | ------------------------- |
| `POST` | `/auth/sign-up`                               | Sign-up                   |
| `GET`  | `/auth/sign-up/:emailValidationId`            | Verify the email address  |
| `POST` | `/auth/login`                                 | Login                     |
| `POST` | `/auth/logout`                                | Logout                    |
| `POST` | `/auth/forgotPassword`                        | Send reset password email |
| `POST` | `/auth/forgotPassword/reset/:resetPasswordId` | Reset password            |

- **User routes**:

| Method   | URI                           | Action                      |
| -------- | ----------------------------- | --------------------------- |
| `GET`    | `/users/lastUsersOverview`    | Retrieve new users          |
| `GET`    | `/users/userOverview/:userId` | Retrieve user's overview    |
| `GET`    | `/users/userPublic/:userId`   | Retrieve user public data   |
| `GET`    | `/users/me`                   | Retrieve user personal data |
| `PATCH`  | `/users/me`                   | Update user personal data   |
| `PATCH`  | `/users/me/changePassword`    | Change user's password      |
| `POST`   | `/users/me/talent/add`        | Add talent                  |
| `PATCH`  | `/users/me/talent/update`     | Update talent               |
| `DELETE` | `/users/me/talent/remove`     | Remove talent               |

- **Project core routes**:

| Method   | URI                                       | Action                          |
| -------- | ----------------------------------------- | ------------------------------- |
| `POST`   | `/projects/createProjectDraft`            | Create new project draft        |
| `PATCH`  | `/projects/updateProjectDraft/:projectId` | Update project draft            |
| `DELETE` | `/projects/removeProjectDraft/:projectId` | Remove project draft            |
| `POST`   | `/projects/submitProject`                 | Submit project                  |
| `PATCH`  | `/projects/updateProject/:projectId`      | Update project                  |
| `PATCH`  | `/projects/saveProjectDraft/:projectId`   | Save draft of project update    |
| `GET`    | `/projects/projectData/:projectId`        | Retrieve project data           |
| `GET`    | `/projects/projectOverview/:projectId`    | Retrieve project overview       |
| `GET`    | `/projects/projectPublic/:projectId`      | Retrieve project public data    |
| `GET`    | `/projects/lastProjectsOverview`          | Retrieve last project overview  |
| `GET`    | `/projects/nbProjects`                    | Retrieve nb of projects         |
| `GET`    | `/projects/nbProjectsPerCategory`         | Retrieve nb of projects per cat |

- **Categories and sub-categories routes**:

| Method   | URI            | Action                               |
| -------- | -------------- | ------------------------------------ |
| `GET`    | `/category`    | Retrieve a specific category         |
| `GET`    | `/categories`  | Retrieve all categories              |
| `POST`   | `/category`    | Create a new category                |
| `PATCH`  | `/category`    | Update a category                    |
| `DELETE` | `/category`    | Remove a category                    |
| `POST`   | `/subCategory` | Add a new sub-category to a category |
| `PATCH`  | `/subCategory` | Update a sub-category                |
| `DELETE` | `/subCategory` | Remove a sub-category                |

- **Project extended features routes**:

| Method   | URI                                 | Action                            |
| -------- | ----------------------------------- | --------------------------------- |
| `PATCH`  | `/addProjectCrush`                  | Add crush to a project            |
| `PATCH`  | `/removeProjectCrush`               | Remove crush from a project       |
| `GET`    | `/crushProjects`                    | Retrieve projects with crush      |
| `PATCH`  | `/likeProject`                      | Like a project                    |
| `PATCH`  | `/unlikeProject`                    | Unlike a project                  |
| `GET`    | `/projectsUserLikes`                | Retrieve projects liked by a user |
| `GET`    | `/projectLikes`                     | Retrieve project likes            |
| `PATCH`  | `/addProjectSteps`                  | Add steps to a project            |
| `PATCH`  | `/editProjectSteps`                 | Edit steps of a project           |
| `PATCH`  | `/publishProjectStep`               | Publish a project step            |
| `PATCH`  | `/unpublishProjectStep`             | Unpublish a project step          |
| `DELETE` | `/removeProjectStep`                | Remove a project step             |
| `GET`    | `/projectStepsPublished`            | Retrieve published project steps  |
| `GET`    | `/projectStepsAll`                  | Retrieve all project steps        |
| `PATCH`  | `/addProjectQAs`                    | Add Q&As to a project             |
| `PATCH`  | `/editProjectQAs`                   | Edit Q&As of a project            |
| `PATCH`  | `/publishProjectQA`                 | Publish a project QA              |
| `PATCH`  | `/unpublishProjectQA`               | Unpublish a project QA            |
| `DELETE` | `/removeProjectQA`                  | Remove a project QA               |
| `GET`    | `/projectQAsPublished`              | Retrieve published project Q&As   |
| `GET`    | `/projectQAsAll`                    | Retrieve all project Q&As         |
| `POST`   | `/addProjectComment`                | Add a comment to a project        |
| `POST`   | `/answerProjectComment`             | Answer a project comment          |
| `PATCH`  | `/editProjectComment`               | Edit a project comment            |
| `PATCH`  | `/reportProjectComment`             | Report a project comment          |
| `PATCH`  | `/unreportProjectComment`           | Unreport a project comment        |
| `DELETE` | `/removeProjectComment`             | Remove a project comment          |
| `GET`    | `/projectComments`                  | Retrieve project comments         |
| `PATCH`  | `/projectUserRights/:projectId`     | Update user rights for a project  |
| `PATCH`  | `/projectMembers/update/:projectId` | Update project member             |
| `DELETE` | `/projectMembers/remove/:projectId` | Remove project member             |
| `PATCH`  | `/projectStatus/:projectId`         | Update project status             |
| `PATCH`  | `/projectAttachments/:projectId`    | Update project attachments        |

- **Join project invitation routes**:

| Method   | URI                           | Action                              |
| -------- | ----------------------------- | ----------------------------------- |
| `POST`   | `/saveDraft`                  | Save draft invitation               |
| `PATCH`  | `/updateDraft`                | Update draft invitation             |
| `DELETE` | `/removeDraft`                | Remove draft invitation             |
| `POST`   | `/send`                       | Send project invitation             |
| `PATCH`  | `/cancel`                     | Cancel project invitation           |
| `POST`   | `/accept`                     | Accept project invitation           |
| `POST`   | `/refuse`                     | Refuse project invitation           |
| `GET`    | `/myDrafts`                   | Retrieve user's draft invitations   |
| `GET`    | `/myInvitations`              | Retrieve user's invitations         |
| `GET`    | `/myInvitation/:invitationId` | Retrieve user's specific invitation |

- **Join project request routes**:

| Method   | URI                     | Action                           |
| -------- | ----------------------- | -------------------------------- |
| `POST`   | `/saveDraft`            | Save draft request               |
| `PATCH`  | `/updateDraft`          | Update draft request             |
| `DELETE` | `/removeDraft`          | Remove draft request             |
| `POST`   | `/send`                 | Send project request             |
| `PATCH`  | `/cancel`               | Cancel project request           |
| `POST`   | `/accept`               | Accept project request           |
| `POST`   | `/refuse`               | Refuse project request           |
| `GET`    | `/myDrafts`             | Retrieve user's draft requests   |
| `GET`    | `/myRequests`           | Retrieve user's requests         |
| `GET`    | `/myRequest/:requestId` | Retrieve user's specific request |

## 🛠 Environment Variables

To run this project, you will need the following environment variables in your .env file:

`PORT`  
`COOKIE_SECRET`  
`MONGODB_URI`  
`MONGODB_URI_PUBLIC`  
`MONGODB_URI_PRIVATE`  
`MONGODB_URI_SECURE`  
`DB_PUBLIC`  
`DB_PRIVATE`  
`DB_SECURE`  
`DB_TEST`  
`NODE_ENV`  
`WEBSITE_URL`  
`ADMIN_EMAIL`  
`GITHUB_ID`  
`GITHUB_SECRET`  
`ACCESS_TOKEN_SECRET`  
`REFRESH_TOKEN_SECRET`  
`RESET_PASSWORD_TOKEN_SECRET`  
`ACCESS_TOKEN_ADMIN_SECRET`  
`ENCRYPT_KEY`  
`ID_ENCRYPT_KEY`  
`ACCESS_TOKEN_EXPIRATION`  
`ACCESS_TOKEN_EXPIRATION_SECONDS`  
`REFRESH_TOKEN_EXPIRATION`  
`REFRESH_TOKEN_EXPIRATION_SECONDS`  
`RESET_PASSWORD_TOKEN_EXPIRATION`  
`RESET_PASSWORD_TOKEN_EXPIRATION_SECONDS`  
`EMAILJS_SERVICE_ID`  
`EMAILJS_TEMPLATE_ID_STD_EMAIL`  
`EMAILJS_USER_ID`  
`EMAILJS_ACCESS_TOKEN`

## 🐱‍💻 Author

- [@aiko-kami](https://www.github.com/aiko-kami)

## 🍻 Contributing

Contributions are welcome!

Please contact neutroneer100@gmail.com

## 🌮 Demo

NextJS version: [Sheepy](https://www.neutroneer.com/)

## 🧗‍♂️ Status

I am currently working on... **Project improvements**
