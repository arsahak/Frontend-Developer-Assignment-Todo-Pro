# 📋 Todo Pro - Modern React Todo Application

A full-featured, production-ready todo application built with React 18, TypeScript, and Redux Toolkit. Features authentication, CRUD operations, advanced filtering, pagination, and a beautiful dark mode interface.

## 🚀 Features

### 🔐 Authentication

- **User Registration** with form validation
- **Secure Login** with credential verification
- **Token Persistence** using localStorage
- **Protected Routes** with automatic redirects
- **Session Management** with logout functionality

### 📝 Todo Management

- **Full CRUD Operations** - Create, Read, Update, Delete
- **Rich Todo Fields**:
  - Title (required)
  - Description (optional)
  - Status (todo, in_progress, done)
  - Priority (low, medium, high)
  - Tags (array of strings)
  - Due Date (optional)
- **Status Management** with one-click status updates
- **Confirmation Dialogs** before destructive actions

### 🔍 Advanced Filtering & Search

- **Status Filtering** - Filter by todo, in_progress, or done
- **Text Search** - Search across titles and descriptions
- **Multi-field Sorting** - Sort by created date, due date, or priority
- **Sort Order Control** - Ascending or descending order
- **Real-time Updates** - Filters apply instantly

### 📄 Pagination

- **Configurable Page Sizes** - 5, 10, 20, or 50 items per page
- **Page Navigation** - Previous/Next buttons and direct page selection
- **Item Counter** - "Showing X to Y of Z todos" display
- **Responsive Pagination** - Works on all screen sizes

### 🎨 User Experience

- **Responsive Design** - Mobile-first approach
- **Dark Mode Toggle** - Complete dark theme support
- **Loading States** - Skeleton loaders during data fetching
- **Empty States** - Helpful messages when no data is available
- **Toast Notifications** - Success/error feedback
- **Optimistic Updates** - Immediate UI updates with rollback on error

### ♿ Accessibility

- **ARIA Labels** - Screen reader support
- **Keyboard Navigation** - Full keyboard accessibility
- **High Contrast** - Accessible color schemes
- **Focus Management** - Proper focus indicators

## 🛠️ Tech Stack

### Core Technologies

- **React 18+** - Modern React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server

### State Management

- **Redux Toolkit** - Predictable state container
- **RTK Query** - Data fetching and caching
- **Redux Slices** - Modular state management

### Routing & Forms

- **React Router v6** - Client-side routing with protected routes
- **React Hook Form** - Performant form handling
- **Zod** - Runtime type validation and form schemas

### Styling & UI

- **Tailwind CSS v4** - Utility-first CSS framework
- **React Toastify** - Toast notifications
- **Custom Components** - Reusable UI components

### Testing & Development

- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities
- **MSW (Mock Service Worker)** - API mocking for development and testing
- **ESLint & Prettier** - Code quality and formatting

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/arsahak/Frontend-Developer-Assignment-Todo-Pro.git
cd todo-pro

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── forms/          # Form components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── TodoForm.tsx
│   ├── Layout.tsx      # Main app layout
│   ├── ProtectedRoute.tsx
│   ├── TodoFilters.tsx
│   ├── TodoItem.tsx
│   └── TodoSkeleton.tsx
├── lib/                # Utility libraries
│   └── schemas.ts      # Zod validation schemas
├── mocks/              # MSW mock API
│   ├── browser.ts
│   ├── handlers.ts     # API route handlers
│   └── server.ts
├── pages/              # Page components
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── TodosPage.tsx
├── store/              # Redux store
│   ├── api/           # RTK Query APIs
│   │   ├── authApi.ts
│   │   ├── baseApi.ts
│   │   └── todosApi.ts
│   ├── slices/        # Redux slices
│   │   ├── authSlice.ts
│   │   └── uiSlice.ts
│   ├── hooks.ts       # Typed Redux hooks
│   └── index.ts       # Store configuration
├── test/              # Test files
│   ├── auth.test.tsx
│   ├── forms.test.tsx
│   ├── routing.test.tsx
│   ├── todos.test.tsx
│   ├── setup.ts
│   └── utils.tsx
├── App.tsx            # Root component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## 🔧 Architecture Decisions

### State Management Strategy

- **Redux Toolkit** for predictable state management
- **RTK Query** for server state and caching
- **Normalized State** for efficient updates
- **Typed Hooks** for type safety

### API Design

- **RESTful Endpoints** following standard conventions
- **Bearer Token Authentication** for security
- **Consistent Error Handling** across all endpoints
- **Mock Service Worker** for realistic API simulation

### Form Handling

- **React Hook Form** for performance and developer experience
- **Zod Schemas** for runtime validation and type inference
- **Controlled Components** for complex form logic
- **Error Boundaries** for graceful error handling

### Styling Approach

- **Tailwind CSS** for rapid UI development
- **Mobile-First** responsive design
- **CSS Custom Properties** for theming
- **Component-Scoped Styles** for maintainability

## 🔌 API Endpoints

### Authentication

```typescript
POST /api/auth/register  # User registration
POST /api/auth/login     # User login
GET  /api/auth/profile   # Get user profile
```

### Todos

```typescript
GET    /api/todos        # Get todos with filters/pagination
POST   /api/todos        # Create new todo
PATCH  /api/todos/:id    # Update todo
DELETE /api/todos/:id    # Delete todo
```

### Query Parameters (GET /api/todos)

- `status` - Filter by status (todo, in_progress, done)
- `search` - Search in title and description
- `sortBy` - Sort field (createdAt, dueDate, priority)
- `sortOrder` - Sort direction (asc, desc)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

## 🧪 Testing Strategy

### Test Coverage

- **Authentication Flow** - Login, register, logout
- **CRUD Operations** - Create, read, update, delete todos
- **Form Validation** - Client-side validation with Zod
- **Routing Protection** - Protected route redirects
- **Filter Functionality** - Search and status filtering

### Testing Tools

- **Vitest** - Fast test runner with ES modules support
- **React Testing Library** - Component testing with user-centric queries
- **MSW** - Mock API responses for integration tests
- **User Event** - Realistic user interaction simulation

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## 🌙 Dark Mode Implementation

The application features a complete dark mode implementation:

- **System Preference Detection** - Respects user's OS theme preference
- **Manual Toggle** - Theme switcher in the navigation
- **Persistent Choice** - Theme preference saved to localStorage
- **Comprehensive Coverage** - Every component supports dark mode
- **Smooth Transitions** - Animated theme switching

## 📱 Responsive Design

- **Mobile-First** approach with progressive enhancement
- **Breakpoint Strategy**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Flexible Layouts** with CSS Grid and Flexbox
- **Touch-Friendly** interfaces for mobile devices

## 🔒 Security Considerations

- **Input Validation** with Zod schemas
- **XSS Protection** through React's built-in escaping
- **Token Storage** in localStorage (consider httpOnly cookies for production)
- **Route Protection** with authentication checks
- **Error Handling** without exposing sensitive information

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_BASE_URL=https://your-api.com
VITE_APP_TITLE=Todo Pro
```

### Deployment Platforms

- **Vercel** - Recommended for React apps
- **Netlify** - Great for static sites
- **Railway** - Full-stack deployment
- **AWS S3 + CloudFront** - Enterprise solution

## 🔄 Future Enhancements

### Planned Features

- [ ] **Real-time Collaboration** - Multiple users working on shared todos
- [ ] **File Attachments** - Add files to todos
- [ ] **Recurring Tasks** - Repeat todos on schedule
- [ ] **Categories/Projects** - Organize todos into projects
- [ ] **Time Tracking** - Track time spent on tasks
- [ ] **Calendar Integration** - Sync with external calendars
- [ ] **Offline Support** - PWA with offline functionality
- [ ] **Push Notifications** - Remind users of due dates

### Technical Improvements

- [ ] **Real Backend Integration** - Replace MSW with actual API
- [ ] **Database Migration** - Structured data persistence
- [ ] **Advanced Caching** - Redis for performance
- [ ] **Search Engine** - Full-text search with Elasticsearch
- [ ] **Analytics** - User behavior tracking
- [ ] **Monitoring** - Error tracking and performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Write tests for new features
- Use conventional commit messages
- Ensure all linting passes
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Redux Toolkit Team** - For simplifying Redux
- **Tailwind CSS Team** - For the utility-first CSS framework
- **Testing Library Team** - For excellent testing utilities
- **MSW Team** - For seamless API mocking

## 📧 Contact

- **Author**: AR Sahak
- **Email**: arsahakbd@gmail.com
- **GitHub**: https://github.com/arsahak
- **LinkedIn**: https://linkedin.com/in/arsahak

---

**Built with ❤️ using React, TypeScript, and Redux Toolkit**
