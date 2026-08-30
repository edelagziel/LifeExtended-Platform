# Survey API Format Documentation

## Endpoint: GET /api/active-poll

This endpoint should return the currently active survey/poll configuration.

## Supported Response Formats

The `getActivePoll()` function supports three different response formats from AWS:

### Option 1: Direct Format (Recommended)
```json
{
  "title": "LifeExtended – Health Decision Perception Survey",
  "description": "This question helps us understand how people reason about long-term health risks and prevention.",
  "options": [
    "I prefer to react only when a medical problem appears",
    "I believe lifestyle changes matter more than medical monitoring",
    "I trust medical tests more than daily habits",
    "I am unsure what actually reduces long-term health risks"
  ]
}
```

### Option 2: Wrapped in "poll" Property
```json
{
  "poll": {
    "title": "LifeExtended – Health Decision Perception Survey",
    "description": "This question helps us understand how people reason about long-term health risks and prevention.",
    "options": [
      "I prefer to react only when a medical problem appears",
      "I believe lifestyle changes matter more than medical monitoring",
      "I trust medical tests more than daily habits",
      "I am unsure what actually reduces long-term health risks"
    ]
  }
}
```

### Option 3: DynamoDB Format
```json
{
  "Item": {
    "title": "LifeExtended – Health Decision Perception Survey",
    "description": "This question helps us understand how people reason about long-term health risks and prevention.",
    "options": [
      "I prefer to react only when a medical problem appears",
      "I believe lifestyle changes matter more than medical monitoring",
      "I trust medical tests more than daily habits",
      "I am unsure what actually reduces long-term health risks"
    ]
  }
}
```

## Required Fields

- **title** (string): The survey title/question
- **description** (string): Additional context or instructions
- **options** (array of strings): List of available choices

## Error Handling

- If the endpoint returns a non-200 status, the app will fall back to the static configuration in `survey.config.js`
- If the response doesn't match any of the expected formats, the normalization will attempt to extract the data
- Network errors are caught and logged, with fallback to static config

## Lambda Function Example

```javascript
// AWS Lambda handler example
export const handler = async (event) => {
  // Fetch from DynamoDB or return static config
  const poll = {
    title: "Survey Title",
    description: "Survey description",
    options: ["Option 1", "Option 2", "Option 3"]
  };
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(poll)
  };
};
```

## Testing

You can test the integration by:
1. Setting `VITE_API_BASE_URL` in your `.env` file
2. Ensuring your API Gateway has CORS enabled
3. Navigating to `/survey` in the app
4. Checking browser console for any fetch errors
