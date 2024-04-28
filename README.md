# Spam Buster API Server

## Overview

The Spam Buster API server is a robust backend solution designed to facilitate a spam identification service through a REST API. This server interacts with a PostgreSQL database hosted on Supabase to manage and serve data related to users and their contacts within a global database. The system is designed with production-level considerations for performance and security, utilizing only essential server and database resources.

## Key Features

- **User Registration and Authentication:** Users must register with a name and phone number, and optionally an email address, to access the application. Each phone number is unique to one user.
- **Contact Management:** The API simulates the automatic import of a user’s phone contacts into the database, reflecting each user’s network within the global database.
- **Spam Reporting:** Users can mark phone numbers as spam. These markings help other users identify potential spammers, enhancing community-driven spam awareness.
- **Search Functionality:** The API supports searching for persons by name or phone number. It prioritizes search results based on the relevance of the name and the direct match of the phone number. Search results include the spam likelihood rating to aid in identifying potential spam.
- **Privacy and Access Control:** Detailed information about a contact, including their email, is only accessible to users who have that contact in their personal contact list, ensuring privacy and data protection.

## Intended Use

This API is intended to be consumed by a front-end application, which will handle all user interactions. The API provides all necessary endpoints for managing users, contacts, and spam reports, as well as for querying the global database based on various criteria.

## Development and Deployment:

The project is set up for development with a structure that can be directly transitioned to a production environment. Instructions for local setup, usage, and deployment guidelines are provided to ensure ease of use for developers and seamless integration into potential production scenarios.

### Prerequisites
- Git for cloning the repository and its submodules.

## Configuration

Before running the application, ensure you have a `.env` file in the project root with the following configurations:

```env
PORT=3000
DB_USERNAME='your db username'
DB_PASSWORD='your db password'
DB_NAME=postgres
DB_HOST='your db host'
SECRET_KEY=jkh123vb4jh12b4!&*!
```

The secret key is used to generate jwt token. 

## Running the Services
To run the service you can follow the scripts under `package.json`

### development server: `pnpm run dev`
### build server: `pnpm run build`
### production server: `pnpm run start`

Can check out the different routes under the **routes** folder in **api** folder.

## Routes
- **User Routes:**
```
POST /user/create
POST /user/login
POST /user/logout
POST /user/update
DELETE /user/:id
```

- **Spam Routes:**
```
POST /spam/markNumber
POST /spam/removeSpamVote
```

- **Search Routes:**
```
POST /search/findByName
POST /search/findByNumber
GET /details/:belongsTo/:id
```

## Database filling Script
You can run the script using `pnpm run fill-db`

Before running the script, ensure you have a `.env` file in the project root with the following configurations:

```env
SUPABASE_KEY=<your supabase key>
SUPABASE_URL=<your supabase url>
```

