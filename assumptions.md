# Assumptions Made During Development

## Project Setup & Architecture

### 1. Technology Stack
- **Framework**: Next.js 13+ with App Router (production-ready as specified)
- **Language**: TypeScript for both frontend and backend
- **Database**: SQLite with Prisma ORM (chosen for simplicity and file-based storage)
- **Styling**: Tailwind CSS (for responsive card layouts as referenced in requirements)
- **State Management**: React hooks with client-side state
- **Authentication**: JWT-based authentication system

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
- **User Sessions**: Client-side login state management
- **Protected Routes**: Server-side authentication checks for sensitive operations

### 7. Error Handling Strategy
- **Client-side Errors**: Network failures, validation errors, and user feedback
- **Server-side Errors**: Database errors, authentication failures, and API errors
- **Fallback UI**: Error boundaries and fallback components for graceful degradation

### 8. Performance Considerations
- **Database Queries**: Optimized with proper includes and filtering
- **Client-side Filtering**: URL-based filtering for posts by userId
- **Lazy Loading**: On-demand data fetching to reduce initial load time

### 9. Security Assumptions
- **Input Validation**: Server-side validation for all user inputs
- **SQL Injection Prevention**: Using Prisma's parameterized queries
- **XSS Prevention**: Proper escaping and sanitization of user content
- **CORS**: Configured for cross-origin requests (though not explicitly required)

### 10. Deployment & Environment
- **Environment Variables**: DATABASE_URL configuration (committed to repo as specified)
- **Build Process**: Standard Next.js build and deployment pipeline
- **Database Initialization**: Automatic migration and seeding on first run

## Business Logic Assumptions

### 11. Post Management
- **Ownership**: Users can only delete their own posts (authentication required)
- **Soft Delete**: Posts remain in database but are hidden from listings
- **Unique Constraints**: Post IDs are auto-incrementing integers

### 12. User Experience Flow
- **Navigation**: Direct URL access to filtered post listings
- **State Persistence**: URL parameters maintain filter state on page refresh
- **Offline Considerations**: Basic error handling for network issues (though full PWA features not implemented)

### 13. Data Validation
- **Required Fields**: Title and body are mandatory for post creation
- **Data Types**: String validation and trimming for text inputs
- **Length Limits**: Reasonable limits on text content (though not explicitly enforced)

## Technical Implementation Details

### 14. Component Architecture
- **Reusable Components**: Modular design with props interfaces
- **Client/Server Components**: Proper separation of concerns in Next.js 13+
- **Type Safety**: Full TypeScript coverage for all components and API routes

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
- **Pagination**: Basic listing without pagination (could be added for large datasets)

### 18. Feature Extensions
- **Comments System**: Not implemented (could be added to posts)
- **User Profiles**: Basic user info only (could be expanded)
- **Search Functionality**: No search beyond userId filtering
- **Rich Text Editor**: Plain text only (could be enhanced with markdown/WYSIWYG)

This document captures all assumptions made during development to ensure transparency and facilitate future maintenance and enhancements.
