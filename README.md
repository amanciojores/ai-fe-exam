# Writer/Editor Dashboard Site

## Project Overview

This project implements a Writer/Editor Dashboard Site that allows users to create, edit, and publish articles related to various companies. It is built using Vue.js for the frontend and NestJS for the backend, with Firebase handling authentication and Firestore as the database.

The project provides two types of users: Writers and Editors, each with specific permissions and actions. Writers can create and edit unpublished articles, while Editors have additional privileges to publish articles and manage users and companies.

## Features

### Writer and Editor Dashboard:

- Writers can create and edit articles.
- Editors can manage articles, users, and companies.

### Article Management:

- Articles include fields such as title, content, related company, and images.
- Editors have the ability to publish articles.

### User Management:

- Editors can add and update users.
- Users include writers and editors with different access levels.

### Company Management:

- Editors can add and update company details.

### Firebase Authentication:

- Secured login system for writers and editors.

### Responsive Design:

- Frontend is built using Vue.js ensuring responsive and user-friendly design.

## Project Structure

```
/ai-fe-exam
├── frontend (Vue.js)
└── backend (NestJS)
```

### Frontend (Vue.js)

- Developed using Vue.js.
- Features a dashboard interface for Writers and Editors.
- Implements various forms for creating and editing articles, companies, and users.
- Image upload functionality for articles.

### Backend (NestJS)

- Built using NestJS.
- Uses Firebase Authentication for user login.
- Implements REST APIs for article, user, and company management.
- Stores article data, user data, and company data in Firestore.

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- Firebase Project (with Firestore and Authentication enabled)
- Vue CLI installed
- NestJS CLI installed

### 1. Clone the Repository

```bash
git clone https://github.com/justkeepdoingit/ai-fe-exam.git
```

### 2. Install Dependencies

Navigate into both frontend and backend folders to install dependencies:

```bash
cd frontend
npm install

cd ../backend
npm install
```

### 3. Firebase Setup

Create a Firebase project and enable Firestore and Authentication. Then, add your Firebase configuration in both frontend and backend projects.

#### Frontend Firebase Setup

In the frontend folder, create a `.env` file and add the following Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

#### Backend Firebase Setup

In the backend folder, create a `.env` file and add the Firebase admin credentials:

```env
TYPE="type"
PROJECT_ID="projectId"
PRIVATE_KEY_ID="privateKeyId"
PRIVATE_KEY="privateKey"
CLIENT_EMAIL="clientEmail"
CLIENT_ID="clientId"
AUTH_URI="authURI"
TOKEN_URI="tokenURI"
AUTH_CERT_URL="authCertUrl"
CLIENT_CERT_URL="clientCertUrl"
UNIVERSAL_DOMAIN="universlDomain"
```

### 4. Running the Application

#### Frontend

```bash
cd frontend
npm run serve
```

#### Backend

```bash
cd backend
npm run start:dev
```

### 5. Access the Application

After both frontend and backend servers are running, visit `http://localhost:5173/` to access the dashboard. You will be prompted to log in and will redirect you to your respective dashboard.

#### Sample Credentials

| Role   | Email                | Password                    |
| ------ | -------------------- | --------------------------- |
| Writer | writer8/uhn@test.com | writer8/uhn@test.comAmamiya |
| Editor | test@test.com        | testuser                    |

## Database Schema

### Company

- id - Unique identifier
- logo - URL for the company logo
- name - Company name
- status - Status of the company [Active, Inactive]

### User

- id - Unique identifier
- firstname - User's first name
- lastname - User's last name
- type - Type of user [Writer, Editor]
- status - User status [Active, Inactive]

### Article

- id - Unique identifier
- image - URL of the article's image
- title - Title of the article
- link - URL of the article
- date - Date of publication
- content - Content of the article
- status - Status of the article [For Edit, Published]
- writer - Document Reference to the Writer user
- editor - Document Reference to the Editor user
- company - Document Reference to the Company

## User Actions

### Writer

- Can create new articles, which will automatically be set to "For Edit".
- Can edit articles with "For Edit" status only.
- Dashboard shows articles in "For Edit" and "Published" status.

### Editor

- Can edit and publish articles.
- Has access to two buttons in the article editor: "Save" and "Publish".
- Can manage users and companies.
- Dashboard shows articles ready for publication and already published articles.

## Notes

- Ensure to deploy both the frontend and backend to the live environment and provide the live link in the required outputs.
- Provide access to the source code on GitHub or Bitbucket, along with this README file.
