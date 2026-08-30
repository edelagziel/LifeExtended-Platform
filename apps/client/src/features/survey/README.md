# Survey Feature Documentation

## 📁 Structure

```
survey/
├── survey.api.js        # API functions (getActivePoll, submitVote)
├── survey.config.js     # Fallback/default survey configuration
├── useSurvey.js         # Custom hook for survey state management
├── SurveyPage.jsx       # Main survey component
├── survey.css           # Styling
├── API_FORMAT.md        # API response format documentation
└── README.md            # This file
```

## 🚀 Quick Start

### 1. Configure API Endpoint

Edit `.env` in project root:

```bash
# For AWS API Gateway
VITE_API_BASE_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod

# For local development (leave empty to use same origin)
VITE_API_BASE_URL=
```

### 2. Ensure Backend is Ready

Your backend should have an endpoint: `GET /api/active-poll`

See `API_FORMAT.md` for response format details.

### 3. Run the App

```bash
npm run dev
```

Navigate to `/survey` to see the survey page.

## 🎯 How It Works

### Architecture Flow

```
User visits /survey
    ↓
SurveyPage renders
    ↓
useSurvey hook loads
    ↓
getActivePoll() fetches from API
    ↓
Poll data displayed (or fallback config if API fails)
    ↓
User selects option
    ↓
submitVote() sends to API
    ↓
Success message shown
```

### Key Features

✅ **Dynamic Poll Loading** - Fetches survey from AWS on page load
✅ **Fallback Configuration** - Uses `survey.config.js` if API fails
✅ **Email Auto-fill** - Pre-fills email from UserContext
✅ **Error Handling** - Graceful error messages for all scenarios
✅ **Loading States** - Clear feedback during async operations
✅ **Responsive Design** - Works on mobile and desktop

## 🔧 Development

### Testing Locally Without Backend

The survey will automatically fall back to `survey.config.js` if:
- `VITE_API_BASE_URL` is empty
- Backend is not reachable
- API returns an error

### Adding New Fields

To add new fields to the survey:

1. Update the API response format in your backend
2. Update `survey.config.js` fallback
3. Modify `SurveyPage.jsx` to render the new fields

Example:
```javascript
// In survey.config.js
export const surveyConfig = {
  title: "Survey Title",
  description: "Description",
  options: ["Option 1", "Option 2"],
  newField: "New value" // Add here
};
```

### Custom Hook API

The `useSurvey()` hook returns:

```javascript
{
  // Poll data
  pollData,        // Current poll configuration
  pollLoading,     // Loading state for poll fetch
  pollError,       // Error loading poll
  
  // Vote form
  email,           // Current email value
  setEmail,        // Update email
  voteLoading,     // Loading state for vote submission
  voteError,       // Error submitting vote
  voteSuccess,     // Vote submitted successfully
  
  // Actions
  handleVote,      // Function to submit a vote
  resetSurvey,     // Function to reset after voting
  isEmailLocked,   // Whether email is locked (from UserContext)
}
```

## 🐛 Troubleshooting

### Poll Not Loading

1. Check browser console for errors
2. Verify `VITE_API_BASE_URL` in `.env`
3. Check CORS settings on your API Gateway
4. Verify Lambda function is returning correct format

### Already Voted Error

- The backend tracks votes by email
- To test multiple times, use different email addresses
- Or implement a reset mechanism in your backend

### Styling Issues

- Dark mode styles are in `src/main.css`
- Survey-specific styles in `survey.css`
- Uses CSS variables from theme system

## 📝 Notes

- Survey is protected by `ProtectedRoute` - user must be authenticated
- Email is auto-filled from `UserContext` if available
- All API calls have proper error handling and fallbacks
- TypeScript types can be added later for better type safety
