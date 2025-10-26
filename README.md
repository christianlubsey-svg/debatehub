# DebateHub

A gamified debate platform with two distinct modes: unmoderated debates (free-for-all discussions) and moderated debates (AI fact-checked conversations). Built with modern web technologies to provide an engaging and interactive debating experience.

## Features

### Debate Modes

#### Unmoderated Mode (Free-for-all)
- Open discussions without AI intervention
- Real-time messaging and responses
- Upvoting and downvoting system
- Gamification with points and leaderboards
- No fact-checking or content moderation

#### Moderated Mode (AI Fact-Checked)
- AI-powered fact-checking using OpenAI's GPT models
- Real-time verification of claims and statements
- Citation suggestions and source validation
- Automatic flagging of misinformation
- Enhanced credibility scoring

### Core Features
- User authentication and authorization
- Real-time debate participation using WebSockets
- Points and ranking system
- User profiles and debate history
- Topic-based debate rooms
- Voting and engagement metrics
- Responsive design for mobile and desktop

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Socket.io Client** - Real-time communication
- **Zustand** - State management
- **React Query** - Server state management

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Relational database
- **Socket.io** - Real-time bidirectional communication
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **OpenAI API** - AI fact-checking capabilities
- **Helmet** - Security middleware
- **Express Rate Limit** - Rate limiting

### Database
- **PostgreSQL** - Primary database
- **node-pg-migrate** - Database migrations

## Project Structure

```
debatehub/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files (database, app settings)
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware (auth, validation)
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic (AI moderation, gamification)
│   │   ├── types/          # TypeScript type definitions
│   │   └── server.ts       # Application entry point
│   ├── .env.example        # Environment variables template
│   ├── package.json        # Backend dependencies
│   └── tsconfig.json       # TypeScript configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   ├── styles/         # Global styles
│   │   ├── utils/          # Utility functions
│   │   └── main.tsx        # Application entry point
│   ├── index.html          # HTML template
│   ├── .env.example        # Environment variables template
│   ├── package.json        # Frontend dependencies
│   ├── tsconfig.json       # TypeScript configuration
│   ├── vite.config.ts      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── postcss.config.js   # PostCSS configuration
│
├── database/
│   ├── migrations/         # Database migrations
│   └── seeds/              # Database seed files
│
├── .claude/
│   └── CLAUDE.md           # Architecture documentation
│
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14
- npm or yarn
- OpenAI API key (for moderated mode)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd debatehub
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:

Backend:
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

Frontend:
```bash
cd frontend
cp .env.example .env
# Edit .env with your configuration
```

5. Set up the database:
```bash
# Create PostgreSQL database
createdb debatehub

# Run migrations
cd backend
npm run migrate:up
```

### Running the Application

#### Development Mode

1. Start the backend server:
```bash
cd backend
npm run dev
```
The API will be available at `http://localhost:5000`

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:3000`

#### Production Mode

1. Build the backend:
```bash
cd backend
npm run build
npm start
```

2. Build the frontend:
```bash
cd frontend
npm run build
npm run preview
```

## Database Setup

### Creating Migrations

```bash
cd backend
npm run migrate create <migration-name>
```

### Running Migrations

```bash
# Run all pending migrations
npm run migrate:up

# Rollback last migration
npm run migrate:down
```

## API Documentation

The API follows RESTful conventions and is organized around the following resources:

- `/api/auth` - Authentication endpoints
- `/api/users` - User management
- `/api/debates` - Debate management
- `/api/messages` - Debate messages
- `/api/votes` - Voting system
- `/api/leaderboard` - Rankings and statistics

WebSocket events are handled through Socket.io for real-time features.

## Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## Linting

```bash
# Lint backend
cd backend
npm run lint

# Lint frontend
cd frontend
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Architecture

For detailed architecture documentation, see [.claude/CLAUDE.md](.claude/CLAUDE.md).

## Support

For issues and questions, please open an issue on the GitHub repository.
