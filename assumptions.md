# Assumptions Made During Development

## Project Setup & Architecture

### 1. Technology Stack
- **Framework**: Next.js 16.1.1 with App Router (latest production-ready version)
- **Language**: TypeScript for both frontend and backend
- **Database**: SQLite with Prisma ORM (chosen for simplicity and file-based storage as specified)
- **Styling**: Tailwind CSS 4.x (for responsive card layouts as referenced in requirements)
- **State Management**: React hooks with client-side state + Context API for authentication
- **Authentication**: JWT-based authentication system (implemented as enhancement for better UX)

### 2. Database Schema
- **Users Table**: Stores user information with unique email constraint
- **Posts Table**: Stores blog posts with foreign key relationship to users
- **Soft Delete**: Posts are marked as deleted rather than physically removed
- **Relationships**: One-to-many relationship (User has many Posts)

### 3. API Design
- **RESTful API**: Following REST conventions for CRUD operations
- **Route Structure**: `/api/posts` for listing/creating, `/api/posts/[id]` for individual post operations
- **Authentication**: Protected routes using middleware for user authentication
- **Error Responses**: Standardized error response format with appropriate HTTP status codes

### 4. User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Loading States**: Spinner indicators during async operations
- **Error Handling**: User-friendly error messages and retry mechanisms
- **Confirmation Dialogs**: Modal confirmations for destructive actions (delete)
- **Toast Notifications**: Success/error feedback using react-hot-toast

## Development Decisions

### 5. Data Seeding
- **Source APIs**: Using JSONPlaceholder APIs for initial data population
- **Data Integrity**: Maintaining referential integrity during seeding
- **Duplicate Handling**: Upsert operations to handle existing data gracefully

### 6. Authentication System
- **JWT Tokens**: Stateless authentication with HTTP-only cookies
- **User Sessions**: Client-side login state management with React Context
- **Protected Routes**: Server-side authentication checks for sensitive operations
- **Session Persistence**: Cookies maintain login state across browser sessions

### 6.1 Authentication Implementation Decisions
- **JWT vs Session**: JWT chosen for stateless authentication and API flexibility
- **Cookie Storage**: HTTP-only cookies for security (XSS protection)
- **Client State**: React Context for global authentication state management
- **Route Protection**: Client-side redirects + server-side API validation
- **Registration**: Email-based registration with uniqueness constraints

### 7. Error Handling Strategy
- **Client-side Errors**: Network failures, validation errors, and user feedback
- **Server-side Errors**: Database errors, authentication failures, and API errors
- **Fallback UI**: Error boundaries and fallback components for graceful degradation

### 8. Performance Considerations
- **Database Queries**: Optimized with proper includes and filtering
- **Client-side Filtering**: URL-based filtering for posts by userId
- **Lazy Loading**: On-demand data fetching to reduce initial load time

### 10. Deployment & Environment
- **Environment Variables**: DATABASE_URL configuration (committed to repo as specified)
- **Build Process**: Standard Next.js build and deployment pipeline
- **Database Initialization**: Automatic migration and seeding on first run

## Business Logic Assumptions

### 11. Post Management
- **Ownership**: Users can only delete their own posts (authentication required)
- **Soft Delete**: Posts remain in database but are hidden from listings
- **Unique Constraints**: Post IDs are auto-incrementing integers

### 11.1 Enhanced Post Features
- **Authentication Protection**: Create and delete operations require valid user session
- **Input Validation**: Client and server-side validation for post creation
- **Error Recovery**: Retry mechanisms for failed operations due to network issues

### 12. User Experience Flow
- **Navigation**: Direct URL access to filtered post listings
- **State Persistence**: URL parameters maintain filter state on page refresh
- **Offline Considerations**: Comprehensive error handling for network issues with user feedback

### 12.1 UX Enhancements for Unstable Connections
- **Loading States**: Visual indicators during all async operations
- **Error Boundaries**: Graceful error handling with retry options
- **Network Resilience**: Automatic retries for failed requests
- **User Feedback**: Toast notifications for all operations (success/error)
- **Optimistic UI**: Immediate UI updates with error rollback if needed
- **Progressive Enhancement**: App works with minimal features during connectivity issues

### 13. Data Validation
- **Required Fields**: Title and body are mandatory for post creation
- **Data Types**: String validation and trimming for text inputs
- **Length Limits**: Reasonable limits on text content (though not explicitly enforced)

## Technical Implementation Details

### 14. Component Architecture
- **Reusable Components**: Modular design with props interfaces
- **Client/Server Components**: Proper separation of concerns in Next.js 16+
- **Type Safety**: Full TypeScript coverage for all components and API routes
- **Custom Hooks**: Business logic extracted into reusable hooks (usePosts, useAuth, etc.)

### 15. API Response Format
- **Success Responses**: Consistent JSON structure with data and metadata
- **Error Responses**: Standardized error objects with descriptive messages
- **HTTP Status Codes**: Appropriate status codes for different scenarios

### 16. Database Connection
- **Connection Pooling**: Prisma handles connection management automatically
- **Migration Strategy**: Version-controlled schema changes with Prisma migrations
- **Development Database**: Local SQLite file for development and testing

## Future Considerations

### 17. Scalability
- **Database Choice**: SQLite chosen for simplicity, could be upgraded to PostgreSQL/MySQL for production
- **Caching**: No caching implemented, could be added for performance

### 18. Feature Extensions
- **Comments System**: Not implemented (could be added to posts)
- **User Profiles**: Basic user info only (could be expanded)
- **Search Functionality**: No search beyond userId filtering
- **Rich Text Editor**: Plain text only (could be enhanced with markdown/WYSIWYG)

## Implementation Beyond Original Requirements

### 19. Enhanced Features Implemented
- **Complete Authentication System**: Login, signup, logout with session management
- **Theme System**: Dark/light mode with user preference persistence
- **Advanced Error Handling**: Comprehensive error states with recovery options
- **Loading States**: Visual feedback for all async operations
- **Toast Notifications**: User feedback for all actions (success/error)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Form Validation**: Client and server-side validation with error display
- **Infinite Scroll**: Automatic pagination for better UX with many posts
- **Skeleton Loading**: Realistic loading states that simulate content
- **Optimistic UI**: Immediate updates with rollback on error

### 20. Debt Technical Analysis

#### ✅ **Requirements Fulfilled**
All original requirements from the specification have been implemented:
- ✅ NextJS application with TypeScript
- ✅ SQLite database with Prisma ORM
- ✅ Posts listing with card UI
- ✅ Post deletion with confirmation modal
- ✅ Error handling for API failures
- ✅ Database seeding from JSONPlaceholder APIs
- ✅ Public repository with assumptions.md documentation

### 20. UX Improvements for Unstable Connections
- **Network Error Recovery**: Automatic retry mechanisms
- **Offline-Friendly UI**: Graceful degradation during connectivity issues
- **Optimistic Updates**: Immediate UI feedback with error rollback
- **Loading Indicators**: Clear visual states during operations
- **Error Messages**: User-friendly error communication

### 21. Code Quality & Maintainability
- **TypeScript Strict Mode**: Full type safety across the application
- **ESLint Configuration**: Consistent code style and error prevention
- **Modular Architecture**: Separated concerns with services, hooks, and components
- **Documentation**: Comprehensive README and assumptions documentation
