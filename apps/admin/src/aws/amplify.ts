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
      endpoint: "https://lumxugy7kfeuvkowlqdp4copr4.appsync-api.eu-west-1.amazonaws.com/graphql",
      region: "eu-west-1",
      defaultAuthMode: "apiKey",
      apiKey: "da2-j6sx6iorjjazradtpriqfjj4ce",
    },
  },
});