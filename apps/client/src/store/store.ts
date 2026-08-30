import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice.js";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});

// טיפוסים (חשוב ל-TS)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
