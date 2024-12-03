# Smart Security API

API published at: [Smart Security API Postman Documentation](https://documenter.getpostman.com/view/32004002/2sAYBa8UpP)

## Overview

Smart Security API is a backend service for a smart security system. It offers functionalities such as user authentication, authorization, user verification, password reset, and approval processes. It uses **JWT** for authentication and integrates with **Mailtrap** for email notifications.

## Features

- User authentication (Signup, Login, Logout)
- Moderator login and approval functionality
- Admin authentication and user approval processes
- Password reset functionality
- Email verification
- Integration with **Mailtrap** for email testing in the development environment

## Tech Stack

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database for storing user and session data
- **Mongoose** - ODM (Object Data Modeling) for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **Mailtrap** - Email testing tool for development

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account for cloud database
- [Mailtrap](https://mailtrap.io/) account for email functionality (used in development)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/smart-security-api.git

