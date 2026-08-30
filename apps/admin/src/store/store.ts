import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import pollReducer from "./pollSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    poll: pollReducer,
  },
});

// טיפוסים (חשוב ל-TS)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
