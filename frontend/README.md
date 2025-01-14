# Karma Accommodation Platform

## Overview
The Karma Accommodation Platform is a web application designed to simplify finding, booking, and reviewing accommodations. Users can search for their ideal stay, view recommendations, manage their accounts, and leave reviews for past bookings.

## Features
- **Search Functionality**: Users can search for accommodations based on location and budget.
- **Recommendations**: Displays personalized recommendations for accommodations.
- **Authentication**: Supports user registration and login with JWT-based authentication.
- **User Profiles**: Allows users to view and manage their profiles, including points balance.
- **Accommodations Management**: Users can add, edit, and delete accommodations they own.
- **Reviews and Ratings**: Users can leave reviews and ratings for past bookings.

## Project Structure
```
src/
├── components/          # Reusable components
├── pages/               # Main pages of the application
│   ├── AccommodationDetails/
│   ├── AuthForm/
│   ├── Recommendations/
│   ├── SearchForm/
│   └── ...
├── api/                 # Centralized API calls
├── styles/              # CSS and CSS Modules
├── utils/               # Helper functions
├── App.jsx              # Main application component
└── index.jsx            # Entry point of the application
```

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/karma-accommodation.git
   cd karma-accommodation
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser:
   ```
   http://localhost:3000
   ```

## Scripts
- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run preview`: Preview the production build locally.

## Environment Variables
Create a `.env` file in the root directory with the following keys:
```
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_SECRET_KEY=your_secret_key
```

## API Endpoints
| Endpoint                        | Method | Description                              |
|---------------------------------|--------|------------------------------------------|
| `/api/accommodations`           | GET    | Fetch all accommodations.               |
| `/api/accommodations/search`    | POST   | Search accommodations by criteria.       |
| `/api/accommodations/:id`       | GET    | Fetch details of a specific accommodation.|
| `/api/users/register`           | POST   | Register a new user.                     |
| `/api/users/login`              | POST   | Log in an existing user.                 |
| `/api/users/:userId`            | GET    | Fetch user profile data.                 |
| `/api/users/points`             | GET    | Fetch user's points balance.             |

## Technology Stack
- **Frontend**: React, React Router, Axios
- **Styling**: CSS Modules, Global CSS
- **Backend**: Express.js (API endpoints assumed)
- **Database**: MySQL (or other relational database assumed)

## Development Notes
- Ensure that the backend server is running on `http://localhost:3000`.
- Update API URLs in `.env` as needed for production.

## Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
For questions or suggestions, feel free to reach out at `your-email@example.com`.

