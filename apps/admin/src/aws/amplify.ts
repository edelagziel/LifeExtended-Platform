import { Amplify } from "aws-amplify";

// אנחנו מריצים את זה ישירות, בלי לעטוף בפונקציה
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "eu-west-1_hNKfDgfvm",
      userPoolClientId: "3obrh7pt768esr9hhcnrmicajt",
    },
  },
  API: {
    GraphQL: {
      endpoint: import.meta.env.VITE_APPSYNC_ENDPOINT || "",
      region: import.meta.env.VITE_AWS_REGION || "eu-west-1",
      defaultAuthMode: "apiKey",
      apiKey: import.meta.env.VITE_APPSYNC_API_KEY || "",
    },
  },
});
