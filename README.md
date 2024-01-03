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
- [Authors](#-authors)
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
- [ ] Improvements (Brainstorms/clarifications needed) ❤💚
  - [x] Retrieve specific data (GET requests)
    - [x] Retrieve project all data
    - [x] Retrieve last projects overview (when project is public)
    - [x] Count the number of projects on the plateform (public projects only)
    - [x] Count the number of projects per category (public projects only)
  - [x] Forward when possible the message from the service to the controller and the final output
  - [x] Allow multiple database connections
  - [x] Admin Login
  - [x] User routes (overview and public)
  - [ ] Project 💚❤
    - [x] New fields (coup de coeur)
    - [ ] Project routes (creation, draft, submission) ❤
      - [x] Create project draft
      - [x] Update project draft
      - [x] Remove project draft
      - [x] Submit project
      - [ ] Send email notification to admin for project submission ❤
      - [x] Retrieve submitted project for admin ❤
      - [ ] process project approval ❤
      - [ ] Send email notification to project creator for project approval ❤
      - [ ] Save project draft ❤
    - [ ] Upload images ❤
    - [ ] Edit project attachments 💚
  - [ ] User 💚
    - [ ] Talents portfolio 💚
    - [ ] Share talent? 💚
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
- [ ] Friends 💛
  - [ ] Define friend model 💛
  - [ ] Send friend request 💛
  - [ ] Cancel friend request 💛
  - [ ] Retrieve friend requests 💛
  - [ ] Accept/decline friend request 💛
- [ ] Messenger 💛
  - [ ] Define messenger model 💛
- [ ] Search 💛
  - [ ] Filter by categories/sub-categories 💛
  - [ ] Filter by locations 💛
  - [ ] Filter by talents needed 💛
  - [ ] Filter by tags 💛
- [ ] O-Auth 💚
- [ ] Add properties to projects: 💚
  - [ ] Applications authorized 💚
  - [ ] Language(s) of the project 💚

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
| `PATCH`  | `/users/changePassword`       | Change user's password      |
| `POST`   | `/users/talent/add/me`        | Add talent                  |
| `PATCH`  | `/users/talent/update/me`     | Update talent               |
| `DELETE` | `/users/talent/remove/me`     | Remove talent               |

- **Project Core routes**:

| Method   | URI                                        | Action                       |
| -------- | ------------------------------------------ | ---------------------------- |
| `POST`   | `/projects/project/createDraft`            | Create new project draft     |
| `POST`   | `/projects/project/updateDraft/:projectId` | Update project draft         |
| `POST`   | `/projects/project/create`                 | Create new project           |
| `POST`   | `/projects/project/submit/:projectId`      | Create new project           |
| `PATCH`  | `/projects/project/:projectId`             | Update project               |
| `PATCH`  | `/projects/project/status/:projectId`      | Update project status        |
| `GET`    | `/projects/project/:projectId`             | Retrieve project             |
| `GET`    | `/projectOverview/:projectId`              | Retrieve project overview    |
| `GET`    | `/projectPublic/:projectId`                | Retrieve project public data |
| `POST`   | `/projects/category`                       | Create new project category  |
| `PATCH`  | `/projects/category`                       | Update project category      |
| `DELETE` | `/projects/category`                       | Remove project category      |

- **Project Extended routes**:

| Method   | URI                                   | Action                       |
| -------- | ------------------------------------- | ---------------------------- |
| `PATCH`  | `/projects/project/:projectId`        | Update project               |
| `PATCH`  | `/projects/project/status/:projectId` | Update project status        |
| `GET`    | `/projects/project/:projectId`        | Retrieve project             |
| `GET`    | `/projectOverview/:projectId`         | Retrieve project overview    |
| `GET`    | `/projectPublic/:projectId`           | Retrieve project public data |
| `POST`   | `/projects/category`                  | Create new project category  |
| `PATCH`  | `/projects/category`                  | Update project category      |
| `DELETE` | `/projects/category`                  | Remove project category      |

## 🛠 Environment Variables

To run this project, you will need the following environment variables in your .env file:

`PORT`  
`COOKIE_SECRET`  
`MONGODB_URI`  
`MONGODB_URI_PUBLIC`  
`MONGODB_URI_PRIVATE`  
`DB_PUBLIC`  
`DB_PRIVATE`  
`DB_TEST`  
`NODE_ENV`  
`WEBSITE_URL`  
`GITHUB_ID`  
`GITHUB_SECRET`  
`ACCESS_TOKEN_SECRET`  
`REFRESH_TOKEN_SECRET`  
`RESET_PASSWORD_TOKEN_SECRET`  
`ENCRYPT_KEY`  
`ACCESS_TOKEN_EXPIRATION`  
`ACCESS_TOKEN_EXPIRATION_SECONDS`  
`REFRESH_TOKEN_EXPIRATION`  
`REFRESH_TOKEN_EXPIRATION_SECONDS`  
`RESET_PASSWORD_TOKEN_EXPIRATION`  
`RESET_PASSWORD_TOKEN_EXPIRATION_SECONDS`  
`EMAILJS_SERVICE_ID`  
`EMAILJS_TEMPLATE_ID_VERIF`  
`EMAILJS_TEMPLATE_RESET_PASSWORD`  
`EMAILJS_USER_ID`  
`EMAILJS_ACCESS_TOKEN`

## 🐱‍💻 Authors

- [@aiko-kami](https://www.github.com/aiko-kami)

## 🍻 Contributing

Contributions are welcome!

Please contact neutroneer100@gmail.com

## 🌮 Demo

NextJS version: [Sheepy](https://www.neutroneer.com/)

## 🧗‍♂️ Status

I am currently working on... **Project creation features**
