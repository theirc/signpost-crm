# Signpost CRM
The Singpost CRM project is used by moderators to keep track of Twilio Flex sessions, perform annotations and set follow-up reminders. It was developed for usage by the El Salvador team and has now been hastily adapted to be used by the Italy team as well.

## Project structure
This project consists of two applications: a node web server as backend and a react-js frontend site.

## Debugging backend
Using VS Code, a launch.json has been configured to run `nodemon server` in debug mode, enabling breakpoints within the IDE. The default port for the server is 8080 on localhost.

## Debugging frontend
Simply starting the app with `npm start` will serve the CMS' frontend at [http://localhost:3000](http://localhost:3000). Debugging can be achieved using the browser's source inspector, console and react plugins.

**Note: This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
