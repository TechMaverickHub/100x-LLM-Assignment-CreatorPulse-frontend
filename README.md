# AI Newsletter Frontend

A React-based web application for managing AI newsletters with user authentication, topic selection, and admin functionality.

## Features

- **User Authentication**: JWT-based login/register system
- **Topic Selection**: Users can choose their AI interests
- **Newsletter Viewing**: Display personalized newsletters
- **Admin Panel**: Manage content sources (superadmin only)
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

- **React 18** with Vite
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- Backend API running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Create environment file:
```bash
# Create .env file with:
VITE_API_BASE_URL=http://localhost:8000/api
```

3. Start development server:
```bash
yarn dev
```

The application will be available at `http://localhost:3000`.

### Build for Production

```bash
yarn build
```

## Project Structure

```
src/
├── components/          # Reusable components
├── pages/             # Page components
├── services/          # API services
├── store/             # Redux store and slices
├── hooks/             # Custom hooks
├── App.jsx            # Main app component
└── main.jsx           # Entry point
```

## API Integration

The app expects a Django REST API with the following endpoints:

- `POST /user/login/` - User login
- `POST /auth/register/` - User registration
- `GET /auth/user/` - Get current user
- `GET /topics/` - Get available topics
- `GET /user/topics/` - Get user's selected topics
- `POST /user/topics/` - Update user topics
- `GET /newsletter/latest/` - Get latest newsletter
- `GET /admin/sources/` - Manage sources (admin only)

## User Roles

- **User**: Can select topics and view newsletters
- **Superadmin**: Can manage content sources and system settings

## Development

The project uses:
- **Vite** for fast development and building
- **ESLint** for code linting
- **Prettier** for code formatting
- **Tailwind CSS** for utility-first styling

## Deployment

The app can be deployed to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

Make sure to set the `VITE_API_BASE_URL` environment variable to your production API URL.
