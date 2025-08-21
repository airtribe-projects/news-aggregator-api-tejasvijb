# News Aggregator API

[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=20124556&assignment_repo_type=AssignmentRepo)

A RESTful API service that aggregates news articles from multiple sources based on user preferences. This application allows users to register, set their news preferences, and receive personalized news feeds.

## Table of Contents

-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Environment Variables](#environment-variables)
-   [API Documentation](#api-documentation)
    -   [Authentication](#authentication)
    -   [Users](#users)
    -   [News](#news)
-   [Testing](#testing)
-   [Project Structure](#project-structure)

## Features

-   User authentication (signup, login) with JWT
-   Password hashing using bcrypt
-   User preference management
-   Personalized news feeds based on user preferences
-   Integration with News API for real-time news content
-   MongoDB database integration

## Tech Stack

-   Node.js (v18+)
-   Express.js
-   MongoDB with Mongoose
-   JWT for authentication
-   bcryptjs for password hashing
-   Axios for API requests
-   dotenv for environment variable management

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   MongoDB (local or Atlas)
-   News API key (from [newsapi.org](https://newsapi.org/))

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd news-aggregator-api
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory (see [Environment Variables](#environment-variables) section)

4. Start the development server:
    ```bash
    npm run dev
    ```

The server will start on http://localhost:3000

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGO_URI=mongodb://localhost:27017/news-api
JWT_SECRET=your_jwt_secret_key
NEWS_API_KEY=your_news_api_key
PORT=3000
```

-   `MONGO_URI`: MongoDB connection string
-   `JWT_SECRET`: Secret key for JWT token generation and verification
-   `NEWS_API_KEY`: API key from [newsapi.org](https://newsapi.org/)
-   `PORT`: Port number for the server (optional, defaults to 3000)

## API Documentation

### Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Users

#### Register a new user

```
POST /users/signup
```

**Request Body:**

```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "preferences": ["business", "technology", "sports"]
}
```

**Response:**

```json
{
    "message": "User created successfully"
}
```

#### Login

```
POST /users/login
```

**Request Body:**

```json
{
    "email": "john@example.com",
    "password": "securepassword"
}
```

**Response:**

```json
{
    "token": "your-jwt-token"
}
```

#### Get User Preferences

```
GET /users/preferences
```

**Authentication:** Required

**Response:**

```json
{
    "preferences": ["business", "technology", "sports"]
}
```

#### Update User Preferences

```
PUT /users/preferences
```

**Authentication:** Required

**Request Body:**

```json
{
    "preferences": ["business", "technology", "sports", "entertainment"]
}
```

**Response:**

```json
{
    "message": "Preferences updated successfully",
    "preferences": ["business", "technology", "sports", "entertainment"]
}
```

### News

#### Get Personalized News Feed

```
GET /news
```

**Authentication:** Required

**Response:**

```json
{
    "news": [
        {
            "category": "business",
            "articles": [
                {
                    "source": { "id": "source-id", "name": "Source Name" },
                    "author": "Author Name",
                    "title": "Article Title",
                    "description": "Article description",
                    "url": "https://article-url.com",
                    "urlToImage": "https://image-url.com",
                    "publishedAt": "2025-08-21T10:30:00Z",
                    "content": "Article content"
                }
                // More articles...
            ]
        }
        // More categories...
    ]
}
```

## Testing

Run the test suite:

```bash
npm test
```

## Project Structure

```
├── app.js                  # Application entry point
├── models/                 # Database models
│   └── User.js             # User model definition
├── routes/                 # API routes
│   ├── users.js            # User-related routes
│   └── news.js             # News-related routes
├── middleware/             # Custom middleware
│   └── auth.js             # Authentication middleware
├── test/                   # Test files
│   └── server.test.js      # API tests
├── .env                    # Environment variables
└── package.json            # Project dependencies and scripts
```

## License

ISC
