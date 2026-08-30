import { createSlice } from "@reduxjs/toolkit";

type ThemeState = {
  mode: "light" | "dark";
};

const THEME_STORAGE_KEY = "themeMode";

const getInitialMode = (): ThemeState["mode"] => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
};

const initialState: ThemeState = {
  mode: getInitialMode(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem(THEME_STORAGE_KEY, state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
