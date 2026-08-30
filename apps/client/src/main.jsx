import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App";
import { Amplify } from "aws-amplify";

// Configure AWS Cognito
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "eu-west-1_hNKfDgfvm",
      userPoolClientId: "3obrh7pt768esr9hhcnrmicajt",
    },
  },
});

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
