# 📝 Next.js Blog Post App

A web application for blog post management built with Next.js 13+, TypeScript, and Prisma.

## ✨ Features

- 📝 **Post Management**: Create, read, and delete blog posts
- 👥 **User System**: JWT authentication with registration and login
- 🔍 **Advanced Filtering**: Filter posts by author (userId)
- 🌓 **Dark/Light Theme**: Full theme support
- 📱 **Responsive Design**: Optimized for mobile and desktop
- ⚡ **Error Handling**: Robust experience with unstable connections
- 🗃️ **Database**: SQLite with Prisma ORM
- 🔄 **Soft Delete**: Logical deletion of posts
- 🔐 **Route Protection**: Authentication required for create/delete operations
- 📊 **Loading States**: Visual indicators during async operations
- 🎯 **Enhanced UX**: Confirmation modals, toast notifications, intuitive navigation

### 📁 Folders Structure 

```
lib/
├── models/           # Centralized data models
│   ├── User.ts      # User interfaces and types
│   ├── Post.ts      # Post interfaces and types
│   └── index.ts     # Centralized exports
├── types/           # API and response types
│   ├── api.ts       # API response/error types
│   └── index.ts     # Centralized exports
├── services/        # Business services
│   ├── userService.ts    # User business logic
│   ├── postService.ts    # Post business logic
│   ├── authService.ts    # Authentication logic
│   └── index.ts          # Centralized exports
├── utils/           # Reusable utilities
│   ├── validation.ts     # Validation functions
│   ├── format.ts         # Formatting functions
│   ├── error.ts          # Error handling
│   └── index.ts          # Centralized exports
├── hooks/           # Custom React hooks
│   ├── usePosts.ts       # Hook for post management
│   ├── useUsers.ts       # Hook for user management
│   ├── useAuth.ts        # Hook for authentication
│   ├── useForm.ts        # Generic form hook
│   └── index.ts          # Centralized exports
└── auth.ts          # Authentication utilities (JWT)
```

## 🚀 Technologies Used

### Core Framework
- **Next.js** 16.1.1 - with App Router
- **React** 19.2.3
- **TypeScript** 5.x

### Database & ORM
- **Prisma** 7.2.0
- **SQLite**
- **@prisma/adapter-libsql** 7.2.0

### Authentication
- **jsonwebtoken** 9.0.3 - JWT tokens for authentication
- **@types/jsonwebtoken** 9.0.10 - Types for JWT

### UI & Styling
- **Tailwind CSS** 4.x - Utility-first CSS framework
- **next-themes** 0.4.6 - Theme management for Next.js
- **react-hot-toast** 2.6.0 - Toast notifications

### Development
- **ESLint** 9.x - Code linting
- **tsx** 4.21.0 - TypeScript executor
- **dotenv** 17.2.3 - Environment variables

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** 8.x or higher (comes with Node.js)
- **Git** for version control

## 🛠️ Installation and Setup

### 1. Clone the repository
```bash
git clone https://github.com/anjos0327/nextjs-blog-post.git
cd nextjs-blog-post
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure the database
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 4. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the application for production |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint to check code |
| `npm run db:generate` | Generates the Prisma client |
| `npm run db:migrate` | Runs database migrations |
| `npm run db:push` | Syncs schema with database |
| `npm run db:seed` | Seeds database with sample data |
| `npm run db:reset` | Completely resets the database |
| `npm run db:studio` | Opens Prisma Studio (database GUI) |

## 🗂️ Project Structure

```
nextjs-blog-post/
├── app/                    # Pages and API routes (App Router)
│   ├── api/               # API endpoints
│   │   ├── auth/         # Authentication (login, signup, logout)
│   │   ├── posts/        # Posts CRUD
│   │   └── users/        # User management
│   ├── posts/            # Posts listing page
│   ├── login/            # Login page
│   ├── signup/           # Registration page
│   └── page.tsx          # Main page
├── components/           # Reusable components
│   ├── PostCard.tsx     # Individual post card
│   ├── PostFilter.tsx   # Posts filter by user
│   ├── CreatePostModal.tsx # Modal for creating posts
│   ├── Header.tsx       # Navigation bar
│   └── ThemeToggle.tsx  # Theme toggle
├── lib/                 # Utilities and configuration
│   ├── prisma.ts        # Prisma client
│   ├── auth.ts          # Authentication utilities
│   └── auth-context.tsx # Authentication context
├── prisma/              # Database configuration
│   ├── schema.prisma    # Database schema
│   ├── seed.ts         # Seeding script
│   └── migrations/     # Database migrations
├── public/             # Static files
├── .env                # Environment variables
├── assumptions.md      # Development assumptions
└── package.json        # Dependencies and scripts
```

## 🗄️ Database

The application uses SQLite with Prisma ORM. The schema includes two main models:

### User
- `id`: Unique identifier (auto-incremental)
- `name`: User's full name
- `username`: Unique username
- `email`: Unique email address

### Post
- `id`: Unique identifier (auto-incremental)
- `title`: Post title
- `body`: Post content
- `userId`: Author ID (relationship with User)
- `deleted`: Soft delete flag
- `deletedAt`: Deletion timestamp (optional)

## 🔐 Authentication

The application implements JWT authentication with the following features:

- **Registration**: Create new user account
- **Login**: Authentication with email
- **Route Protection**: Routes requiring authentication
- **Persistence**: Session maintained in HTTP-only cookies

## 🎨 Funcionalidades

### ✅ Original Requirements Fulfilled

#### 📋 Posts Listing
- ✅ `/posts` page with posts listed in card format
- ✅ Posts filtering by `userId` (post author)
- ✅ Responsive and modern interface

#### 🗑️ Post Deletion
- ✅ "Delete" button on each post card
- ✅ Confirmation modal before deletion
- ✅ Soft delete (logical deletion)

#### ⚠️ Error Handling
- ✅ Error states for post loading failures
- ✅ Error states for deletion failures
- ✅ User-friendly error messages
- ✅ "Retry" buttons for error cases

### 🚀 Additional Features (Beyond Requirements)

#### 👥 Authentication System
- ✅ User registration (`/signup`)
- ✅ User login (`/login`)
- ✅ Secure logout
- ✅ Route protection (create/delete posts requires authentication)
- ✅ Session persistence with JWT in HTTP-only cookies

#### 📱 Enhanced Experience for Unstable Connections
- ✅ Loading states during async operations
- ✅ Automatic retries on network failures
- ✅ Informative error messages
- ✅ Interface optimized for slow connections
- ✅ Immediate visual feedback (toast notifications)

#### 🎨 Advanced User Interface
- ✅ Dark/light theme with persistence
- ✅ Responsive design (mobile and desktop)
- ✅ Smooth animations and transitions
- ✅ Modern iconography
- ✅ Loading states with spinners
- ✅ Modals and interactive dialogs

### For Unauthenticated Users
- ✅ View recent posts on main page (`/`)
- ✅ Navigate to full posts page (`/posts`)
- ✅ Filter posts by author using user selector
- ✅ View complete post details

### For Authenticated Users
- ✅ All previous features, plus:
- ✅ Create new posts ("Create Post" button)
- ✅ Delete own posts (with confirmation modal)
- ✅ Automatic access to `/posts` after login
- ✅ Logout button in navigation bar

## 🌐 API Endpoints

### Posts
- `GET /api/posts` - Lists all posts (with optional userId filtering)
- `POST /api/posts` - Creates a new post (requires authentication)
- `DELETE /api/posts/[id]` - Deletes a post (soft delete, requires authentication)

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Check current session

### Users
- `GET /api/users` - Lists all users

## 🔧 Development Configuration

### Environment Variables
```env
# .env file in project root
DATABASE_URL="file:./dev.db"
```

### Development Database
- File: `dev.db` (SQLite)
- Location: Project root
- Automatically included in version control

## 🚀 Deployment

### For Production
```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 📞 Support

If you find any issues or have questions:

1. Review the `assumptions.md` file to understand design decisions
2. Check console logs for errors

## ⚠️ Project Scope Notes

### 🎯 **Basic Requirements** (Original)
- ✅ NextJS + TypeScript
- ✅ SQLite + Prisma ORM
- ✅ Posts page with cards
- ✅ Deletion with confirmation modal
- ✅ Basic error handling

### 🚀 **Additional Improvements** (Not Required)
- 🔐 Complete JWT authentication system
- 🌓 Dark/light theme
- 📜 Infinite scroll pagination
- 🦴 Skeleton loading
- 🍞 Toast notifications
- 📱 Advanced UX for unstable connections
- ⚡ Advanced HTTP error handling

---
