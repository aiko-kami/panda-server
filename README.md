# 🐼 Panda Server

[![author - @aiko-kami](https://img.shields.io/badge/author-%40aiko--kami-blue)](https://www.github.com/aiko-kami)
![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/t/aiko-kami/panda-server)
![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/aiko-kami/panda-server/master)
![GitHub repo size](https://img.shields.io/github/repo-size/aiko-kami/panda-server)
![Static Badge](https://img.shields.io/badge/_-JavaScript-brightgreen?logo=nodedotjs&labelColor=gray)

The backend part of Sheepy my project management application.

![Logo](https://github.com/aiko-kami/panda-server/blob/master/docs/logo%20Panda_server_Sheepy_blue.png?raw=true)

Sheepy is a collaborative platform for projects creation and tracking. Our mission: To help you bring your projects to life !
You can either create your own project or you can join a project. Create your dream project in a minute and find the talents you need. Find the project that inspires you and start contributing.

| What                          | How                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------- |
| Materialize your ideas        | Let us help you build up your next idea                                          |
| Put your skills into practice | Help people looking for your talent and improve your skills by joining a project |
| Work as a team                | You cannot achieve it alone? Find help from our community                        |
| Have fun                      | The most important thing is to do what you like!                                 |

## 🧰 Features

- [x] Sign-up
- [x] Login
- [ ] Logout
- [ ] Forgot password
- [ ] Create new project
- [ ] Edit project
- [ ] Edit user profile
- [ ] Talents
- [ ] Friends
- [ ] O-auth
- [ ] Messenger
- [ ] Q&A, comments
- [ ] Search

## 📦 Installation

Panda server require [Node.js](https://nodejs.org/) to run.

Install the dependencies with npm:

```bash
  cd panda-server
  npm install
```

Start the server in dev mode:

```bash
  npm run dev
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--docs\           # Swagger files
 |--middlewares\    # Custom middlewares
 |--models\         # Mongoose models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--server.js       # App entry point
```

## API Documentation

Not available right now.

### API Endpoints

List of available routes:

**Auth routes**:\
`POST /auth/sign-up` - Sign-up\
`POST /auth/login` - login\
`POST /auth/forgot-password` - send reset password email\
`POST /auth/reset-password` - reset password\

**User routes**:\

## 🛠 Environment Variables

To run this project, you will need the following environment variables in your .env file

`PORT`

`COOKIE_SECRET`

`MONGODB_URI`

`MONGODB_URI_PUBLIC`

`MONGODB_URI_PRIVATE`

`MONGODB_URI_COPY`

`DB_PUBLIC`

`DB_PRIVATE`

`NODE_ENV`

`WEBSITE_URL`

`GITHUB_ID`

`GITHUB_SECRET`

`JWT_SECRET`

`ACCESS_TOKEN_SECRET`

`REFRESH_TOKEN_SECRET`

`ENCRYPT_KEY`

`JWT_ACCESS_LOGIN_EXPIRATION`

`JWT_ACCESS_LOGOUT_EXPIRATION`

`JWT_ACCESS_SIGNUP_EXPIRATION`

`JWT_REFRESH_EXPIRATION_DAYS`

`JWT_RESET_PASSWORD_EXPIRATION_MINUTES`

`JWT_VERIFY_EMAIL_EXPIRATION_MINUTES`

`EMAILJS_SERVICE_ID`

`EMAILJS_TEMPLATE_ID_VERIF`

`EMAILJS_USER_ID`

`EMAILJS_ACCESS_TOKEN`

## 🐱‍💻 Authors

- [@aiko-kami](https://www.github.com/aiko-kami)

## 🍻 Contributing

Contributions are always welcome!

Please contact neutroneer100@gmail.com

## 🌮 Demo

NextJS version: [Sheepy](https://www.neutroneer.com/)
