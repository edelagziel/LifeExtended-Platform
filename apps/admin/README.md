# LifeExtended - Admin Dashboard

A modern, real-time polling administration dashboard built with React, TypeScript, and AWS services. This application enables administrators to create, manage, and monitor live polls with real-time results visualization.

## 🎯 Project Overview

LifeExtended Admin Dashboard is a comprehensive polling management system that provides:
- **Real-time poll monitoring** with live updates via WebSocket subscriptions
- **Poll lifecycle management** (create, activate, close, delete)
- **Live statistics visualization** with automatic updates
- **Responsive design** with dark/light theme support
- **Type-safe development** with TypeScript

## 🚀 Tech Stack

### Frontend Framework & Build Tools
- **React 19.2** - Modern UI library with latest features
- **TypeScript 5.9** - Type-safe JavaScript development
- **Vite (Rolldown)** - Lightning-fast build tool and dev server
- **React Router DOM 7.11** - Client-side routing

### State Management & Data Flow
- **Redux Toolkit 2.11** - Centralized state management
- **React Redux 9.2** - React bindings for Redux
- **Custom Hooks** - Reusable logic for polls, local storage, and API calls

### Backend Integration
- **AWS Amplify 6.16** - AWS services integration
- **AWS AppSync** - GraphQL-based real-time subscriptions
- **DynamoDB** - NoSQL database for poll storage
- **Lambda Functions** - Serverless API endpoints

### UI & Styling
- **Chakra UI 3.30** - Component library
- **Material-UI 7.3** - Additional UI components
- **Emotion** - CSS-in-JS styling
- **Framer Motion 12.23** - Animation library
- **Custom CSS** - Tailored component styles

### HTTP & API
- **Axios 1.13** - HTTP client for REST API calls
- **GraphQL Subscriptions** - Real-time data updates

## 📁 Project Structure

```
frontAdmin/
├── src/
│   ├── app/
│   │   ├── App.tsx              # Root application component
│   │   └── router.tsx           # Route configuration
│   ├── aws/
│   │   ├── amplify.ts           # AWS Amplify configuration
│   │   └── subscriptions.ts     # GraphQL subscription definitions
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AdminLayout.tsx  # Main admin layout wrapper
│   │   │   └── AdminNavbar.tsx  # Navigation bar
│   │   ├── live/
│   │   │   └── LiveResults.tsx  # Real-time poll results component
│   │   └── Footer/              # Footer component
│   ├── customHooks/
│   │   ├── usePolls.ts          # Poll management hooks
│   │   ├── useFetch.ts          # Generic fetch hook
│   │   └── useLocalStorage.ts   # Local storage management
│   ├── pages/
│   │   ├── Dashboard/           # Main dashboard page
│   │   ├── CreatePoll/          # Poll creation page
│   │   ├── LivePoll/            # Live monitoring page
│   │   └── Register/            # Registration page
│   ├── services/
│   │   └── pollService.ts       # API service layer
│   ├── store/
│   │   ├── store.ts             # Redux store configuration
│   │   └── themeSlice.ts        # Theme state management
│   ├── types/
│   │   └── poll.types.ts        # TypeScript type definitions
│   └── main.jsx                 # Application entry point
├── package.json
└── vite.config.js
```

## 🔧 Installation & Setup

### Prerequisites
- **Node.js** 18.x or higher
- **npm** or **yarn**
- **AWS Account** with configured services (DynamoDB, AppSync, Lambda)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/edelagziel/LifeExtended.git
   cd LifeExtended/frontAdmin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure AWS Services**
   - Update `src/aws/amplify.ts` with your AWS Amplify configuration
   - Ensure Lambda functions are deployed and accessible
   - Configure API Gateway endpoints in `src/services/pollService.ts`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎨 Features

### 1. Dashboard Page
- **Quick Stats**: Display active polls and participant counts
- **Current Poll Management**: View, close, or delete active polls
- **Status Monitoring**: Real-time poll status with visual indicators
- **Case-insensitive Status Handling**: Robust status checking (ACTIVE/active)

### 2. Create Poll Page
- **Intuitive Form**: Simple interface for poll creation
- **Dynamic Options**: Add/remove poll options on the fly
- **Optional Description**: Include context for your polls
- **Validation**: Client-side validation before submission
- **Success/Error Feedback**: Clear user feedback on actions

### 3. Live Poll Monitoring
- **Real-time Updates**: WebSocket-based live data streaming
- **Participant Tracking**: Live participant count updates
- **Results Visualization**: Dynamic charts showing vote distribution
- **Connection Status**: Visual indicator of subscription status
- **Smart Data Normalization**: Handles various data formats from server

### 4. Theme System
- **Dark/Light Mode**: User preference with persistence
- **Smooth Transitions**: Animated theme switching
- **Redux-based**: Centralized theme state management

### 5. Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Flexible Layouts**: CSS Grid and Flexbox
- **Touch-Friendly**: Large tap targets for mobile devices

## 🔌 API Integration

### REST Endpoints
The application communicates with AWS Lambda functions via API Gateway:

- **GET** `/admin/active-poll` - Fetch currently active poll
- **POST** `/admin/create-poll` - Create a new poll
- **PUT** `/admin/update-poll` - Update existing poll
- **POST** `/admin/close-poll` - Close an active poll
- **DELETE** `/admin/delete-poll` - Delete a poll

### GraphQL Subscriptions
Real-time updates via AWS AppSync:

```graphql
subscription ListenToUpdates {
  onStatsUpdated {
    standings
  }
}
```

### Response Format Handling
The application intelligently handles multiple response formats:
- `{success: true, data: poll}` - Standard format
- `{poll: {...}, message: "..."}` - Alternative format
- `{pollId: "...", ...}` - Flat format
- `{Item: {...}}` - Direct DynamoDB format

All responses are normalized automatically for consistent handling.

## 🛠️ Key Technical Implementations

### 1. Custom Hooks
- **useActivePoll**: Fetches and manages active poll state
- **useCreatePoll**: Handles poll creation with loading/error states
- **useClosePoll**: Manages poll closure operations
- **useDeletePoll**: Handles poll deletion with confirmation

### 2. Error Handling
- Comprehensive try-catch blocks
- User-friendly error messages
- Console logging for debugging
- Graceful fallbacks for missing data

### 3. Type Safety
- Full TypeScript coverage for new components
- Type definitions for API responses
- Interface definitions for props and state
- Type guards for data validation

### 4. Performance Optimizations
- Lazy loading of routes
- Memoized components where appropriate
- Efficient state updates
- Optimized re-renders

### 5. Real-time Data Flow
```
AppSync Subscription → LiveResults Component → State Update → UI Refresh
                                          ↓
                                  Parent Component Update
                                  (Live Participant Count)
```

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server (default: http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

### Code Quality
- **ESLint**: Configured with React and TypeScript rules
- **TypeScript**: Strict type checking enabled
- **Component Structure**: Modular and reusable components
- **Separation of Concerns**: Services, hooks, and components clearly separated

## 🔐 Security Considerations

- API key-based authentication for Lambda functions
- CORS configuration for secure cross-origin requests
- Input validation on client and server side
- No sensitive data in client-side code

## 📊 Data Flow

1. **User Action** (Create/Close/Delete poll)
2. **Service Layer** (`pollService.ts`) - Prepares and sends request
3. **AWS Lambda Function** - Processes request, updates DynamoDB
4. **Response Handling** - Normalizes response format
5. **State Update** - Updates React state via hooks
6. **UI Update** - Components re-render with new data
7. **Real-time Sync** - AppSync subscription pushes updates to all connected clients

## 🎓 Learning Points

This project demonstrates:
- Modern React patterns with hooks and context
- TypeScript integration in React applications
- Redux Toolkit for state management
- AWS Amplify integration
- Real-time data with GraphQL subscriptions
- RESTful API consumption
- Responsive design principles
- Error handling and loading states
- Code organization and architecture

## 📝 Future Enhancements

Potential improvements:
- User authentication and role-based access
- Advanced analytics and reporting
- Export poll results to CSV/PDF
- Poll templates and duplication
- Scheduled poll activation
- Multi-language support
- Email notifications
- Advanced charting options

## 🤝 Contributing

This is an academic/demonstration project. For any questions or suggestions:
- Open an issue on GitHub
- Submit a pull request
- Contact: [GitHub Repository](https://github.com/edelagziel/LifeExtended)

## 📄 License

ISC License - See LICENSE file for details

## 👨‍💻 Author

Developed as part of a full-stack development course, showcasing modern web development practices and cloud integration.

---

**Built with ❤️ using React, TypeScript, and AWS**
