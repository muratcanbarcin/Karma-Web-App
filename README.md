# KARMA - Sustainable Accommodation Sharing & Booking Platform

## Project Overview

KARMA is a full-stack web application developed as a **sustainable and cost-free accommodation platform** designed specifically for budget-conscious travelers. It introduces an innovative **point-based mutual exchange system**, allowing users to earn "karma" points by hosting others or being highly-rated guests. These points can then be redeemed for free stays within the community, fostering a culture of hospitality, resource sharing, and mutual aid.

Built on a robust and modern technology stack (MySQL, Express.js, React, Node.js), KARMA prioritizes security, functionality, and a seamless user experience for both hosts and guests. By enabling access to free lodging, KARMA aims to reduce the environmental impact associated with traditional accommodation and build a strong community based on shared values.

## Core Features

The platform offers a comprehensive set of features to manage the entire accommodation sharing lifecycle:

* **Secure User Authentication:** Robust user registration and login system utilizing `bcrypt` for secure password hashing and JSON Web Tokens (`jsonwebtoken`) for session management, ensuring user data privacy.
* **Dynamic Accommodation Management:**
    * **Easy Listing:** Hosts can easily list their available spaces, providing comprehensive details like location, description, pricing (or point cost), amenities, house rules, and uploading multiple photos.
    * **Intuitive Browsing & Searching:** Guests can explore available accommodations through an engaging interface, utilizing powerful search and filtering options based on location, dates, price/points, amenities, etc..
    * **Detailed Accommodation View:** Each listing features a dedicated page displaying all essential information, high-quality images, host details, availability, and user reviews.
    * **Listing Updates:** Hosts have full control to edit and update their accommodation details as needed.
* **Seamless Booking System:** A straightforward process for guests to request and confirm bookings for desired dates, integrated with the Karma point system.
* **Comprehensive User Profiles:** Users have personalized dashboards (`MyAccount`) displaying their information, karma point balance, listed properties, past and upcoming bookings, received messages, and reviews.
* **Unique Karma Point System:** The heart of the platform (`PointTransactions` table). Users earn points through positive actions like hosting or receiving good reviews, which can be spent on future stays, creating a self-sustaining ecosystem.
* **Integrated Messaging:** An in-app messaging feature (`Messaging` table) enables direct and secure communication between hosts and potential guests regarding inquiries and booking details.
* **Trustworthy Ratings & Reviews:** A transparent system (`RatingsAndReviews` table) allowing guests and hosts to rate and review each other after a stay, building trust within the community.
* **Personalized Recommendations:** (Implemented/Planned) A recommendation engine suggests accommodations based on user behavior, preferences, and past interactions.

## Technology Stack

KARMA leverages a modern, efficient, and scalable technology stack:

* **Backend:**
    * **Runtime:** Node.js
    * **Framework:** Express.js for building robust APIs
    * **Database:** MySQL - A reliable relational database for structured data storage (using the `mysql2` driver)
    * **Authentication:** bcrypt & JSON Web Token (JWT) for secure user sessions
    * **Environment Config:** `dotenv` for managing sensitive credentials
    * **Development:** `nodemon` for efficient development workflow
* **Frontend:**
    * **Library:** React for building dynamic and interactive user interfaces
    * **Build Tool:** Vite for lightning-fast development and optimized builds
    * **Routing:** `react-router-dom` for seamless single-page application navigation
    * **Styling:** Modular and maintainable styling using CSS Modules and global CSS
* **Database Design:**
    * **Modeling:** A well-structured Entity-Relationship Diagram (ERD) defines the database schema and relationships.
    * **Schema & Data:** Includes SQL scripts for easy table creation (`DBCreateTablesCode.sql`) and populating the database with initial/sample data (`KARMA_Insert_Statements.sql`, `.csv` files).

 ## Setup and Installation

### Prerequisites

* Node.js (v18+ recommended, includes npm)
* MySQL Server (v8+)

### Database Setup

1.  Start your MySQL server.
2.  Create a new database (e.g., `karma_db`).
3.  Execute the table creation script: `Database/DBCreateTablesCode.sql`.
4.  Populate the database using one of the following methods:
    * Execute the insert script: `Database/KARMA_Insert_Statements.sql`.
    * Alternatively, use a MySQL client tool to import data from the `.csv` files located in the `Database/` directory.

### Backend Setup

1.  Navigate to the `backend` directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Create a `.env` file (copy `.env` if available or create new) and fill in your MySQL credentials and a secure JWT secret key.
    ```env
    DB_HOST=localhost
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_NAME=karma_db
    JWT_SECRET=replace_with_a_strong_random_secret
    ```
4.  Start the server: `npm run dev`

### Frontend Setup

1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`

## Running the Application

1.  Ensure MySQL is running.
2.  Start the backend server (`cd backend && npm run dev`).
3.  Start the frontend server (`cd frontend && npm run dev`).
4.  Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

## Future Enhancements

Based on the project report, potential future developments include:

* Advanced Search Filters (amenities, rules, accommodation types, attractions).
* Interactive Map Integration.
* Enhanced User Profiles (pictures, bios, verification).
* Community Features (forums, wish lists).
* Gamification (badges, achievements).
* Full KARMA Token Integration for rewards/discounts.
* Multi-Language Support.
* Dedicated Mobile Applications (iOS/Android).

## Project Structure

```markdown
├── Database/                 # SQL scripts, ER diagrams, CSV datasets
│   ├── DBCreateTablesCode.sql
│   ├── KARMA_Final_ER_Diagram.png
│   ├── KARMA_Insert_Statements.sql
│   └── *.csv                   # Dataset files
├── backend/                  # Node.js Express backend API
│   ├── database/
│   │   └── connection.js     # MySQL connection setup
│   ├── node_modules/
│   ├── routes/               # API endpoints (users, accommodations, etc.)
│   ├── .env                  # Environment config (DB credentials, JWT secret)
│   ├── app.js                # Express app core setup
│   ├── index.js              # Server entry point
│   └── package.json          # Backend dependencies & scripts
└── frontend/                 # React user interface
    ├── dist/                 # Production build output
    ├── node_modules/
    ├── public/               # Static assets (images, logos)
    ├── src/                  # React source code
    │   ├── pages/            # Page-level components (Home, Login, Profile, etc.)
    │   ├── App.jsx           # Main application component & routing
    │   ├── global.css        # Global styles
    │   └── index.jsx         # React DOM entry point
    ├── .gitignore
    ├── index.html            # Vite HTML template
    ├── package.json          # Frontend dependencies & scripts
    └── vite.config.mjs       # Vite configuration
