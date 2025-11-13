# QuickPolls - Real-time Polling Application

A modern, full-stack polling application built with Next.js, Express.js, MongoDB, and Socket.io. Features real-time updates, user authentication, and a sleek black & white dark theme.

## 🚀 Features

### Core Functionality
- **Real-time Polling**: Create polls and watch results update live as votes come in
- **User Authentication**: Secure JWT-based authentication with signup/login
- **Vote History**: Track your voting history in your account dashboard
- **Responsive Design**: Fully responsive UI that works on all devices
- **Live Updates**: Socket.io integration for instant poll result updates

### User Experience
- **Dark Theme**: Sleek black and white design with glass-morphism effects
- **Backend Status Monitoring**: Real-time backend health indicator with auto-refresh
- **Smart Error Handling**: Contextual error messages and backend status popups
- **Mobile Optimized**: Touch-friendly interface with proper mobile layouts
- **Auto-logout Protection**: Automatic redirects for unauthenticated users

### Technical Features
- **JWT Authentication**: Secure token-based authentication
- **MongoDB Integration**: Persistent data storage with Mongoose ODM
- **RESTful API**: Well-structured API endpoints with OpenAPI documentation
- **Socket.io Real-time**: Live poll updates without page refresh
- **TypeScript**: Full type safety across frontend and backend
- **Tailwind CSS**: Modern utility-first styling

## 🏗️ Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom dark theme
- **State Management**: React Context for authentication and backend status
- **Real-time**: Socket.io client for live updates
- **Authentication**: JWT token management with localStorage

### Backend (Express.js)
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs password hashing
- **Real-time**: Socket.io server for live poll updates
- **Documentation**: OpenAPI/Swagger documentation
- **Validation**: Zod schema validation

## 📁 Project Structure

```
Quick-Polls/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   │   ├── Poll.ts      # Poll model
│   │   │   ├── Vote.ts      # Vote model
│   │   │   └── User.ts      # User model
│   │   ├── urls/            # API routes
│   │   │   ├── auth.ts      # Authentication routes
│   │   │   ├── polls.ts     # Poll CRUD operations
│   │   │   └── user.ts      # User-specific routes
│   │   └── server.ts        # Express server setup
│   ├── package.json
│   └── .env                 # Environment variables
├── frontend/
│   ├── app/
│   │   ├── contexts/        # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── BackendStatusContext.tsx
│   │   ├── components/      # Reusable components
│   │   │   └── Navbar.tsx
│   │   ├── polls/           # Poll-related pages
│   │   │   ├── [id]/        # Individual poll page
│   │   │   ├── create/      # Create poll page
│   │   │   └── page.tsx     # Poll list page
│   │   ├── login/           # Authentication pages
│   │   ├── signup/
│   │   ├── account/         # User dashboard
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx        # Home page
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file in backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/quick-polls
   PORT=8080
   JWT_SECRET=your-secret-key-here
   ```

4. **Start backend server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env.local` file in frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

4. **Start frontend development server**
   ```bash
   npm run dev
   ```
   Application runs on `http://localhost:3000`

## 🔧 API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Authenticate user

### Polls
- `GET /polls` - List all polls
- `POST /polls` - Create new poll (requires auth)
- `GET /polls/:id` - Get specific poll
- `POST /polls/:id/vote` - Vote on poll (requires auth)

### User
- `GET /me/votes` - Get user's voting history (requires auth)

### Health
- `GET /health` - Backend health check

### Documentation
- `GET /docs` - OpenAPI/Swagger documentation (https://quick-polls.onrender.com/docs/)

## 🎨 Design System

### Color Palette
- **Background**: Pure black (`#000000`)
- **Cards**: Dark gray (`#111111`) with gray borders (`#333333`)
- **Primary Buttons**: White background with black text
- **Secondary Buttons**: Transparent with gray borders
- **Text**: White primary, gray (`#888888`) muted
- **Accents**: Red for logout, white for links

### Typography
- **Headings**: Bold, responsive sizing (3xl → 5xl)
- **Body**: Clean, readable fonts
- **Mobile**: 16px input font size to prevent iOS zoom

### Components
- **Cards**: Glass-morphism effect with subtle shadows
- **Buttons**: Rounded corners, hover animations
- **Forms**: Transparent backgrounds with glass borders
- **Progress Bars**: White fill on dark backgrounds

## 🔐 Authentication Flow

1. **Signup**: User creates account with email/password
2. **Login**: JWT token stored in localStorage
3. **Protected Routes**: Automatic redirect to login if not authenticated
4. **Navbar Updates**: Instant UI updates on auth state changes
5. **Logout**: Token removal and redirect to home

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px - Single column layouts
- **Tablet**: 640px - 1024px - Two column grids
- **Desktop**: > 1024px - Three column grids

### Mobile Optimizations
- Touch-friendly button sizes
- Proper input font sizes
- Flexible layouts that stack vertically
- Optimized spacing and padding

## 🔄 Real-time Features

### Socket.io Integration
- **Poll Updates**: Live vote count updates
- **Room Management**: Users join poll-specific rooms
- **Automatic Reconnection**: Handles connection drops gracefully

### Backend Status Monitoring
- **Health Checks**: Automatic polling every 10 seconds
- **Status Indicator**: Visual backend status in navbar
- **Error Handling**: Smart popups for backend downtime
- **Auto-recovery**: Automatic retry when backend comes online

## 🚨 Error Handling

### Backend Status Popup
- **Trigger**: Network errors or backend downtime
- **Message**: Clear explanation of backend warming up
- **Duration**: Auto-closes after 5 seconds
- **Guidance**: Instructions to check status indicator

### Authentication Errors
- **Validation**: Client-side form validation
- **Server Errors**: Specific error messages from backend
- **Network Errors**: Backend status popup for connection issues

## 🧪 Testing the Application

### User Journey
1. **Visit Homepage**: See feature cards and navigation
2. **Sign Up**: Create account with email/password
3. **Create Poll**: Add question and multiple options
4. **Vote**: Cast votes and see real-time updates
5. **View History**: Check account page for past votes
6. **Logout**: Sign out and return to homepage

### Backend Testing
1. **Stop Backend**: Kill the backend server
2. **Try Actions**: Attempt login, voting, or poll creation
3. **See Popup**: Backend status popup appears
4. **Restart Backend**: Start server again
5. **Auto-recovery**: Status indicator turns green automatically

## 🚀 Deployment

### Backend (Render/Vercel)
1. Set environment variables:
   - `MONGODB_URI`: MongoDB Atlas connection string
   - `JWT_SECRET`: Strong secret key
   - `PORT`: Server port (usually 8080)

2. Deploy with:
   ```bash
   npm run build
   npm start
   ```

### Frontend (Vercel/Netlify)
1. Set environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend URL

2. Deploy with:
   ```bash
   npm run build
   npm start
   ```

## 🔧 Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server



**Frontend:**
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

**Backend (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/quick-polls
PORT=8080
JWT_SECRET=your-secret-key-here
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 📊 Database Schema

### User
```typescript
{
  email: string (unique)
  passwordHash: string
  createdAt: Date
}
```

### Poll
```typescript
{
  userId: ObjectId (optional)
  question: string
  options: [{
    text: string
    votes: number
  }]
  createdAt: Date
}
```

### Vote
```typescript
{
  pollId: ObjectId
  userId: ObjectId (optional)
  optionIndex: number
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


## 🎯 Future Enhancements

- [ ] Poll expiration dates
- [ ] Multiple choice polls
- [ ] Poll sharing via QR codes
- [ ] User profiles and avatars
- [ ] Poll categories and tags
- [ ] Advanced analytics
- [ ] Poll templates
- [ ] Email notifications
- [ ] Social media integration

---

**QuickPolls** - Making polling simple, fast, and beautiful! 🗳️✨
