import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";
import App from "../App";
import { baseApi } from "../store/api/baseApi";
import { authSlice } from "../store/slices/authSlice";
import { uiSlice } from "../store/slices/uiSlice";

describe("Routing", () => {
  const createStore = (preloadedState = {}) => {
    return configureStore({
      reducer: {
        auth: authSlice.reducer,
        ui: uiSlice.reducer,
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
      preloadedState,
    });
  };

  it("should redirect to login when not authenticated", () => {
    const store = createStore();
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Should redirect to login page
    expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
  });

  it("should redirect to todos when authenticated", () => {
    const preloadedState = {
      auth: {
        user: { id: "1", email: "test@example.com", name: "Test User" },
        token: "mock-token",
        isAuthenticated: true,
        isLoading: false,
      },
    };

    const store = createStore(preloadedState);
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Should show todos page
    expect(screen.getByText(/my todos/i)).toBeInTheDocument();
  });

  it("should show navigation links when authenticated", () => {
    const preloadedState = {
      auth: {
        user: { id: "1", email: "test@example.com", name: "Test User" },
        token: "mock-token",
        isAuthenticated: true,
        isLoading: false,
      },
    };

    const store = createStore(preloadedState);
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Should show navigation
    expect(screen.getByText(/todo pro/i)).toBeInTheDocument();
    expect(screen.getByText(/todos/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });
});
