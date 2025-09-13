import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LoginForm } from "../components/forms/LoginForm";
import { RegisterForm } from "../components/forms/RegisterForm";
import { TodoForm } from "../components/forms/TodoForm";
import { renderWithProviders } from "./utils";

describe("Form Validation", () => {
  it("should show validation errors for login form", async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginForm />);

    // Submit empty form
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // Should show validation errors
    expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    expect(
      screen.getByText(/password must be at least 6 characters/i)
    ).toBeInTheDocument();
  });

  it("should show validation errors for registration form", async () => {
    const user = userEvent.setup();

    renderWithProviders(<RegisterForm />);

    // Submit empty form
    await user.click(screen.getByRole("button", { name: /create account/i }));

    // Should show validation errors
    expect(
      screen.getByText(/name must be at least 2 characters/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    expect(
      screen.getByText(/password must be at least 6 characters/i)
    ).toBeInTheDocument();
  });

  it("should show validation errors for todo form", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TodoForm />);

    // Submit empty form
    await user.click(screen.getByRole("button", { name: /create todo/i }));

    // Should show validation error
    expect(screen.getByText(/title is required/i)).toBeInTheDocument();
  });

  it("should clear validation errors when user types", async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginForm />);

    // Submit empty form to trigger validation
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // Should show validation error
    expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();

    // Type valid email
    await user.type(screen.getByLabelText(/email/i), "test@example.com");

    // Validation error should be cleared
    expect(
      screen.queryByText(/invalid email address/i)
    ).not.toBeInTheDocument();
  });
});
