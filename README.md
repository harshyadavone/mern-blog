Sure, here's a revised version of the README:

# MERN Blog App

Welcome to the MERN Blog App! This is a full-stack web application built using the MERN (MongoDB, Express.js, React, Node.js) stack. The app allows users to create, read, update, and delete blog posts, along with several other features.

## Features

- **Authentication**: Users can sign up, log in, and log out securely.
- **Create Posts**: Authenticated users can create new blog posts.
- **Read Posts**: Users can view all existing blog posts.
- **Update Posts**: Authenticated users can edit and update their own blog posts.
- **Delete Posts**: Authenticated users can delete their own blog posts.
- **Search Posts**: Users can search for specific blog posts using keywords.
- **Comment on Posts**: Users can comment on blog posts.
- **Admin Dashboard**: Admin users have access to a dashboard for managing posts and users.
- **Responsive Design**: The app is optimized for various screen sizes and devices.

## Technologies Used

- **MongoDB**: Database used to store blog post data.
- **Express.js**: Node.js framework used for building the server-side application.
- **React**: Frontend library used for building the user interface.
- **Node.js**: JavaScript runtime environment used for server-side development.
- **tailwind**: used for styling.
- **JWT**: JSON Web Tokens used for user authentication.
- **bcrypt**: Library used for hashing user passwords.
- **Render**: Cloud platform used for deploying the application.

## Installation

To run this application locally, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd mern-blog-app`
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     MONGO=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     ```
4. Set up environment variable for client:
   - Create a `.env` file in the `client` directory.
   - Add the following variable:
     ```
     VITE_FIREBASE_API_KEY=<your-firebase-api-key>
     ```
5. Install dependencies for frontend and backend:
   -frontend :-
    ```bash
   npm install
   ```
   Backend :-
   cd client
   ```bash
   npm install
   ```
    
7. Run the app in development mode:
   ```bash
   npm run dev
   ```
   and for running the client
   cd client
   ```bash
   npm run dev
   ```

8. Open your browser and navigate to `http://localhost:5173` to view the app.

## Deployment

This app is deployed on the Render platform. You can access the deployed app [here](https://mern-blog-s3eo.onrender.com/).

## Contributor

- Harsh Yadav ([@harshyadavone](https://github.com/harshyadavone))
