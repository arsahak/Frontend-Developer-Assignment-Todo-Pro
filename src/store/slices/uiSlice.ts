import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type Theme = "light" | "dark";

interface UiState {
  theme: Theme;
  sidebarOpen: boolean;
}

const applyThemeToDOM = (theme: Theme) => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

// Get initial theme from localStorage
const initialTheme = (localStorage.getItem("theme") as Theme) || "light";
// Apply it right away (prevents FOUC)
applyThemeToDOM(initialTheme);

const initialState: UiState = {
  theme: initialTheme,
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
      applyThemeToDOM(action.payload);
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      state.theme = newTheme;
      localStorage.setItem("theme", newTheme);
      applyThemeToDOM(newTheme);
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const { setTheme, toggleTheme, setSidebarOpen, toggleSidebar } =
  uiSlice.actions;

export { uiSlice };
