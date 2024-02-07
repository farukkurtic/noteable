## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Database Schema](#database-schema)
- [Demo](#demo)
- [Conclusion](#conclusion)

## Features
- Create, edit, filter, and delete notes
- User authentication and registration
- Modern and intuitive user interface

## Technologies Used
### Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [bcrypt](https://www.npmjs.com/package/bcrypt) - For securely hashing user passwords

### Frontend
- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/) - Facilitated API requests and data fetching
- [Formik](https://formik.org/) - For managing and validating forms efficiently
- [Yup](https://www.npmjs.com/package/yup) - Used for checking data integrity by defining and validating form schemas
- [React Cookie](https://www.npmjs.com/package/react-cookie)

## Installation
To run this application locally, follow these steps:
1. Clone the repository: `git clone https://github.com/farukkurtic/noteable.git`
2. Navigate to the project directory: `cd <project-folder>`
3. Install dependencies for both frontend and backend:
   - client: `cd client && npm install`
   - server: `cd server && npm install`
4. Start the development server:
   - client: `npm start`
   - server: `cd src && node index.js`

## Database Schema
The user schema is located in the `server/src/models` folder.

## Demo
![2024-02-07 16-13-50 (online-video-cutter com)](https://github.com/farukkurtic/noteable/assets/34779712/06672a82-eb66-4dfa-8ea4-ae71eb3f29c9)

## Conclusion
In conclusion, Noteable offers a modern and efficient solution for note-taking needs, providing users with essential features and a user-friendly interface. With its robust backend built on Node.js and Express.js, coupled with a responsive frontend powered by React, Noteable delivers a seamless experience for users to create, edit, and organize their notes effortlessly.



