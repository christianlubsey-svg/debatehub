# DebateHub Architecture Documentation

## Project Overview

DebateHub is a full-stack gamified debate platform that enables users to engage in structured debates with two distinct modes: unmoderated (free-for-all) and moderated (AI fact-checked). The platform emphasizes engagement through gamification elements while maintaining a robust and scalable architecture.

## Core Concepts

### Debate Modes

#### 1. Unmoderated Mode
- **Purpose**: Free-flowing discussions without AI intervention
- **Features**:
  - Real-time messaging
  - Community voting (upvotes/downvotes)
  - Basic point accumulation
  - No content validation or fact-checking
  - Lower latency, faster response times

#### 2. Moderated Mode
- **Purpose**: High-quality, fact-checked debates
- **Features**:
  - AI-powered fact-checking using OpenAI GPT models
  - Real-time claim verification
  - Citation suggestions
  - Misinformation flagging
  - Enhanced credibility scoring
  - Source validation

### Gamification System

Users earn points through various activities:
- Creating debates
- Participating in debates
- Receiving upvotes
- Providing well-sourced arguments (moderated mode)
- Consistency and engagement
- Winning debates (community-voted outcomes)

## System Architecture

### High-Level Architecture

```
┌─────────────┐
│   Frontend  │ (React + TypeScript + Tailwind)
│   (Port 3000)│
└──────┬──────┘
       │
       │ HTTP/REST + WebSocket
       │
┌──────▼──────┐
│   Backend   │ (Node.js + Express + TypeScript)
│   (Port 5000)│
└──────┬──────┘
       │
       ├─────────────┐
       │             │
┌──────▼──────┐ ┌───▼────────┐
│  PostgreSQL │ │  OpenAI API│
│  Database   │ │  (GPT-4)   │
└─────────────┘ └────────────┘
```

## Backend Architecture

### Directory Structure

```
backend/src/
├── config/
│   ├── database.ts          # PostgreSQL connection configuration
│   ├── app.ts               # Express app configuration
│   └── openai.ts            # OpenAI client configuration
│
├── controllers/
│   ├── authController.ts    # Authentication logic
│   ├── userController.ts    # User management
│   ├── debateController.ts  # Debate CRUD operations
│   ├── messageController.ts # Message handling
│   └── voteController.ts    # Voting system
│
├── middleware/
│   ├── auth.ts              # JWT authentication middleware
│   ├── validation.ts        # Request validation
│   ├── errorHandler.ts      # Global error handling
│   └── rateLimit.ts         # Rate limiting configuration
│
├── models/
│   ├── User.ts              # User model
│   ├── Debate.ts            # Debate model
│   ├── Message.ts           # Message model
│   ├── Vote.ts              # Vote model
│   └── FactCheck.ts         # Fact-check result model
│
├── routes/
│   ├── authRoutes.ts        # Authentication routes
│   ├── userRoutes.ts        # User routes
│   ├── debateRoutes.ts      # Debate routes
│   ├── messageRoutes.ts     # Message routes
│   └── voteRoutes.ts        # Vote routes
│
├── services/
│   ├── aiModerationService.ts    # AI fact-checking logic
│   ├── gamificationService.ts    # Points and rewards
│   ├── socketService.ts          # WebSocket event handling
│   └── notificationService.ts    # User notifications
│
├── types/
│   ├── express.d.ts         # Express type extensions
│   ├── models.ts            # Model type definitions
│   └── api.ts               # API request/response types
│
└── server.ts                # Application entry point
```

### Key Backend Components

#### 1. Authentication System
- JWT-based authentication
- Refresh token rotation
- Bcrypt password hashing
- Role-based access control (RBAC)

#### 2. Database Layer
- PostgreSQL with pg-promise
- Connection pooling
- Transaction support
- Migration management with node-pg-migrate

#### 3. Real-time Communication
- Socket.io for WebSocket connections
- Event-based architecture
- Room-based message broadcasting
- Connection state management

#### 4. AI Moderation Service
- OpenAI GPT-4 integration
- Fact-checking pipeline:
  1. Extract claims from messages
  2. Verify against knowledge base
  3. Search for supporting/contradicting evidence
  4. Generate confidence scores
  5. Suggest citations
- Caching layer for repeated fact-checks
- Rate limiting to manage API costs

#### 5. Gamification Service
- Point calculation algorithms
- Achievement tracking
- Leaderboard generation
- Streak tracking

### API Design

#### RESTful Endpoints

**Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

**Users**
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/debates` - Get user's debates
- `GET /api/users/:id/stats` - Get user statistics

**Debates**
- `GET /api/debates` - List all debates (with pagination)
- `POST /api/debates` - Create new debate
- `GET /api/debates/:id` - Get debate details
- `PUT /api/debates/:id` - Update debate
- `DELETE /api/debates/:id` - Delete debate
- `GET /api/debates/:id/messages` - Get debate messages
- `POST /api/debates/:id/join` - Join a debate

**Messages**
- `POST /api/debates/:id/messages` - Post a message
- `PUT /api/messages/:id` - Edit a message
- `DELETE /api/messages/:id` - Delete a message
- `GET /api/messages/:id/fact-check` - Get fact-check results

**Votes**
- `POST /api/messages/:id/vote` - Vote on a message
- `DELETE /api/messages/:id/vote` - Remove vote

**Leaderboard**
- `GET /api/leaderboard` - Get global leaderboard
- `GET /api/leaderboard/:timeframe` - Get leaderboard by timeframe

#### WebSocket Events

**Client → Server**
- `join_debate` - Join a debate room
- `leave_debate` - Leave a debate room
- `send_message` - Send a message in real-time
- `typing` - Notify others of typing status
- `vote` - Cast a vote

**Server → Client**
- `new_message` - New message received
- `message_edited` - Message was edited
- `message_deleted` - Message was deleted
- `user_joined` - User joined the debate
- `user_left` - User left the debate
- `fact_check_result` - AI fact-check completed
- `vote_update` - Vote count updated
- `debate_ended` - Debate has concluded

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    points INTEGER DEFAULT 0,
    rank VARCHAR(50) DEFAULT 'Novice',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Debates Table
```sql
CREATE TABLE debates (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    topic VARCHAR(100),
    mode VARCHAR(20) NOT NULL, -- 'unmoderated' or 'moderated'
    creator_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'closed', 'archived'
    max_participants INTEGER,
    time_limit INTEGER, -- in minutes
    created_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP
);
```

#### Messages Table
```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    debate_id INTEGER REFERENCES debates(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    is_fact_checked BOOLEAN DEFAULT FALSE,
    fact_check_score DECIMAL(3,2), -- 0.00 to 1.00
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    edited_at TIMESTAMP
);
```

#### Votes Table
```sql
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    vote_type VARCHAR(10) NOT NULL, -- 'upvote' or 'downvote'
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(message_id, user_id)
);
```

#### Fact Checks Table
```sql
CREATE TABLE fact_checks (
    id SERIAL PRIMARY KEY,
    message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
    claim TEXT NOT NULL,
    verdict VARCHAR(50), -- 'verified', 'false', 'misleading', 'unverifiable'
    confidence_score DECIMAL(3,2),
    explanation TEXT,
    sources JSONB, -- Array of source URLs and titles
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### User Stats Table
```sql
CREATE TABLE user_stats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) UNIQUE,
    debates_created INTEGER DEFAULT 0,
    debates_participated INTEGER DEFAULT 0,
    messages_posted INTEGER DEFAULT 0,
    upvotes_received INTEGER DEFAULT 0,
    downvotes_received INTEGER DEFAULT 0,
    fact_check_accuracy DECIMAL(5,2), -- Percentage
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## Frontend Architecture

### Directory Structure

```
frontend/src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── debate/
│   │   ├── DebateCard.tsx
│   │   ├── DebateList.tsx
│   │   ├── DebateRoom.tsx
│   │   └── MessageBubble.tsx
│   │
│   ├── user/
│   │   ├── UserProfile.tsx
│   │   ├── UserStats.tsx
│   │   └── Leaderboard.tsx
│   │
│   └── moderation/
│       ├── FactCheckBadge.tsx
│       └── FactCheckModal.tsx
│
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── DebatePage.tsx
│   ├── ProfilePage.tsx
│   └── LeaderboardPage.tsx
│
├── services/
│   ├── api.ts              # Axios configuration
│   ├── authService.ts      # Authentication API calls
│   ├── debateService.ts    # Debate API calls
│   ├── userService.ts      # User API calls
│   └── socketService.ts    # Socket.io client
│
├── hooks/
│   ├── useAuth.ts          # Authentication hook
│   ├── useDebate.ts        # Debate state hook
│   ├── useSocket.ts        # WebSocket hook
│   └── usePoints.ts        # Points/gamification hook
│
├── types/
│   ├── auth.ts
│   ├── debate.ts
│   ├── user.ts
│   └── api.ts
│
├── styles/
│   └── index.css           # Global styles + Tailwind imports
│
├── utils/
│   ├── formatters.ts       # Date/number formatting
│   ├── validators.ts       # Form validation
│   └── constants.ts        # App constants
│
└── main.tsx                # Application entry point
```

### State Management

**Zustand Stores**:
1. **Auth Store** - User authentication state
2. **Debate Store** - Current debate state
3. **UI Store** - UI state (modals, notifications)
4. **User Store** - User profile and stats

### Key Frontend Components

#### 1. Authentication Flow
- Login/Register forms with validation
- JWT token storage in localStorage
- Automatic token refresh
- Protected route wrapper

#### 2. Debate Interface
- Real-time message display
- Message composition with rich text
- Voting interface
- Fact-check result display (moderated mode)
- Participant list
- Debate timer

#### 3. Gamification Display
- Points counter
- Rank badge
- Achievement notifications
- Leaderboard table with filtering

#### 4. Responsive Design
- Mobile-first approach
- Tailwind CSS utility classes
- Adaptive layouts for debate rooms
- Touch-friendly controls

## Real-time Communication Flow

### Message Flow in Moderated Mode

```
User types message
       ↓
Frontend validates & sends via WebSocket
       ↓
Backend receives message
       ↓
Save to database
       ↓
Broadcast to debate room (immediate)
       ↓
Queue AI fact-check (async)
       ↓
OpenAI analyzes message
       ↓
Save fact-check results
       ↓
Emit fact-check event to room
       ↓
Frontend displays fact-check badge
```

## Security Considerations

1. **Authentication**:
   - Secure password hashing with bcrypt
   - JWT with short expiration times
   - Refresh token rotation
   - HTTPS only in production

2. **Authorization**:
   - Role-based access control
   - Resource ownership validation
   - Rate limiting per user

3. **Input Validation**:
   - Joi schema validation on backend
   - Frontend form validation
   - XSS prevention
   - SQL injection prevention (parameterized queries)

4. **API Security**:
   - Helmet.js security headers
   - CORS configuration
   - Rate limiting
   - Request size limits

## Scalability Considerations

1. **Database**:
   - Connection pooling
   - Indexes on frequently queried fields
   - Pagination for large datasets
   - Potential for read replicas

2. **Caching**:
   - Redis for session storage
   - Cache fact-check results
   - Cache leaderboard data

3. **WebSocket**:
   - Socket.io with Redis adapter for horizontal scaling
   - Room-based message targeting
   - Connection state management

4. **AI Service**:
   - Queue-based fact-checking to manage costs
   - Caching for repeated claims
   - Rate limiting per user
   - Fallback to simpler checks if API unavailable

## Development Workflow

### Adding a New Feature

1. **Database Changes**:
   - Create migration file
   - Update models
   - Run migration

2. **Backend**:
   - Create/update models
   - Add service logic
   - Create controller methods
   - Add routes
   - Update types

3. **Frontend**:
   - Update types
   - Create/update services
   - Build components
   - Add pages/routes
   - Update state management

4. **Testing**:
   - Write unit tests
   - Test API endpoints
   - Test WebSocket events
   - Manual testing

### Code Style Guidelines

- Use TypeScript strict mode
- Follow ESLint rules
- Use functional components in React
- Prefer async/await over promises
- Write descriptive variable names
- Comment complex logic
- Keep functions small and focused

## Deployment Architecture

### Production Setup

```
┌─────────────────┐
│   CloudFront    │ (CDN for static assets)
│   or Nginx      │
└────────┬────────┘
         │
    ┌────▼─────┐
    │  Frontend│ (Static hosting: S3, Vercel, Netlify)
    └──────────┘
         │
         │ HTTPS
         │
    ┌────▼─────┐
    │   ALB    │ (Load balancer)
    └────┬─────┘
         │
    ┌────▼─────────────┐
    │  Backend (ECS)   │ (Container orchestration)
    │  Multiple instances│
    └────┬─────────────┘
         │
    ┌────▼────┐
    │   RDS   │ (Managed PostgreSQL)
    └─────────┘
```

## Future Enhancements

1. **Video/Audio Debates**: Integrate WebRTC for live debates
2. **Advanced Analytics**: Detailed debate statistics and insights
3. **Mobile Apps**: Native iOS and Android applications
4. **Moderation Tools**: Admin dashboard for content moderation
5. **Advanced AI**: Custom fine-tuned models for fact-checking
6. **Social Features**: Following users, debate recommendations
7. **Monetization**: Premium features, ad-free experience
8. **Internationalization**: Multi-language support

## Monitoring and Observability

1. **Logging**:
   - Winston for structured logging
   - Log aggregation (e.g., CloudWatch, Datadog)
   - Error tracking (e.g., Sentry)

2. **Metrics**:
   - API response times
   - Database query performance
   - WebSocket connection counts
   - AI fact-check latency

3. **Alerts**:
   - High error rates
   - Database connection issues
   - API rate limit exceeded
   - High WebSocket latency

## Testing Strategy

1. **Unit Tests**:
   - Service layer logic
   - Utility functions
   - Component rendering

2. **Integration Tests**:
   - API endpoints
   - Database operations
   - WebSocket events

3. **End-to-End Tests**:
   - User flows
   - Authentication
   - Debate participation

## Conclusion

DebateHub is designed to be a scalable, engaging, and educational platform for debates. The architecture supports both casual discussions and serious, fact-checked debates while maintaining performance and user experience. The modular design allows for easy feature additions and modifications as the platform grows.
