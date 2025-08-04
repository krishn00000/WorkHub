# WorkHub - Premium Job & Networking Portal

A modern, premium job portal and networking platform built with React.js, Node.js, and MongoDB. Features a dark theme with glassmorphism effects, MetaMask wallet integration, and professional Gen-Z aesthetics.

## Features

### Frontend
- **Modern UI**: Dark theme with glassmorphism effects and smooth animations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **MetaMask Integration**: Wallet connection and address display
- **JWT Authentication**: Secure login/register with protected routes
- **Job Management**: Browse, post, and apply to jobs
- **Social Features**: User profiles, networking, and activity feed
- **Real-time Updates**: Dynamic content updates and interactions

### Backend
- **RESTful API**: Express.js server with comprehensive endpoints
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Security**: Helmet, CORS, rate limiting, and input validation
- **File Handling**: Support for profile images and job attachments
- **Search & Filtering**: Advanced job and user search capabilities

## Tech Stack

**Frontend:**
- React.js 18
- React Router DOM
- Tailwind CSS
- Lucide React (icons)
- Ethers.js (Web3 integration)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Express Validator for input validation

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- MetaMask browser extension (for wallet features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd workhub
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/workhub
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:5173
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

### Running the Application

**Development Mode (Frontend + Backend):**
```bash
npm run dev:full
```

**Frontend Only:**
```bash
npm run dev
```

**Backend Only:**
```bash
npm run server:dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:userId` - Get user profile
- `GET /api/users/search/:query` - Search users
- `POST /api/users/connect/:userId` - Send connection request

### Jobs
- `GET /api/jobs` - Get all jobs (with filtering)
- `GET /api/jobs/:jobId` - Get single job
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:jobId` - Update job
- `POST /api/jobs/:jobId/apply` - Apply to job
- `GET /api/jobs/user/posted` - Get user's posted jobs

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `POST /api/posts/:postId/like` - Like/unlike post
- `POST /api/posts/:postId/comment` - Add comment
- `GET /api/posts/user/:userId` - Get user's posts

## Project Structure

```
workhub/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts (Auth, Wallet)
│   ├── pages/              # Page components
│   ├── services/           # API service layer
│   └── index.css           # Global styles
├── server/
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── index.js            # Server entry point
└── public/                 # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.