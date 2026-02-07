# Chat Application

A modern, responsive chat interface built with React and TypeScript.

## Features

### Core Functionality
- **Real-time messaging** - Send and receive messages with instant updates
- **Optimistic UI updates** - Messages appear immediately with shimmer effect while sending
- **Error handling** - User-friendly toast notifications for all error states
- **Loading states** - Skeleton screens while fetching messages
- **Keyboard shortcuts** - Press Enter to send, Shift+Enter for new line

### User Experience
- **Responsive design** - Optimized for mobile (≤768px) and desktop
- **Accessibility** - ARIA labels, semantic HTML, screen reader support
- **Visual feedback** - Shimmer animations for pending states
- **Smart input** - Auto-disabled when loading or errors occur or empty message
- **Message preservation** - Failed messages remain in input for retry

### Sending a message flow -> Optimistic Updates (add slow 4G/3G Throttling for noticing it)
- Messages appear immediately with their date shown with a shimmering effect
- Shimmer animation while pending (waiting for API responses)
- Replaced with real message on success
- Removed on failure (preserves input text)

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety and developer experience
- **Vite** - Fast build tool and dev server
- **Vitest** - Testing framework with 50 comprehensive tests
- **React Hot Toast** - Toast notifications
- **CSS Custom Properties** - Themeable design system

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:3000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Backend Setup

This frontend requires the [Frontend Challenge Chat API](https://github.com/DoodleScheduling/frontend-challenge-chat-api) running locally.

```bash
# In a separate terminal, clone and run the backend
git clone https://github.com/DoodleScheduling/frontend-challenge-chat-api
cd frontend-challenge-chat-api
npm install
follow the instructions to run it
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run type-check   # Check TypeScript types
npm run lint         # Lint code with Biome
npm run format       # Format code with Biome
npm run validate     # Run all checks (tests, lint, types)
npm run biome-check  # Run checks with Biome
npm run biome-check:fix  # Run checks with Biome and fix errors safe when possible
npm run biome-check:fix:unsafe  # Run checks with Biome and fix safe and unsafe errors when possible
...
```

## Project Structure

```
src/
├── api/              # API client layer
│   └── messageClient.ts      # Fetch/send messages
├── components/       # React components
│   ├── Chat.tsx              # Main chat container
│   ├── Message.tsx           # Individual message
│   ├── MessageInput.tsx      # Input form
│   ├── MessageList.tsx       # Message list with loading
│   └── MessageSkeleton.tsx   # Loading skeleton
├── helpers/          # Utility functions
│   ├── createOptimisticMessage.ts  # Optimistic updates
│   ├── formatMessageDate.ts        # Date formatting
│   └── getErrorMessage.ts          # Error formatting
└── types/            # TypeScript definitions
    └── message.ts
```

## Architecture Decisions

## Code Quality
- **Test-Driven Development** - All features were built using TDD when possible
- **TypeScript strict mode** - Full type safety
- **DRY principles** - Shared helpers, no duplication
- **Clean architecture** - Separation of concerns
- **Zero linting errors** - Enforce Biome checks on stagged files for precommit and for all files on prepush


### Error Handling Strategy
Three-layer approach:
1. **API Layer** - Catches network/HTTP errors, formats messages
2. **Component Layer** - Handles errors, updates UI state
3. **User Layer** - Toast notifications with clear messages


### Accessibility Features
- ARIA labels on all interactive elements
- `role="log"` with `aria-live="polite"` for message updates
- Keyboard navigation support
- Semantic HTML structure
- Screen reader friendly


## Responsive Design
### Desktop (>768px)
### Mobile (≤768px)


## License
This project was created with MIT License.
