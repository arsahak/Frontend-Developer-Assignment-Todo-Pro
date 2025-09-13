import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { renderWithProviders } from "./utils";

describe("Authentication", () => {
  it("should redirect to todos after successful login", async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />);

    // Fill in login form
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");

    // Submit form
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // Should redirect to todos page
    await waitFor(() => {
      expect(screen.getByText(/my todos/i)).toBeInTheDocument();
    });
  });

  it("should redirect to todos after successful registration", async () => {
    const user = userEvent.setup();

    renderWithProviders(<RegisterPage />);

    // Fill in registration form
    await user.type(screen.getByLabelText(/full name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "password123");

    // Submit form
    await user.click(screen.getByRole("button", { name: /create account/i }));

    // Should redirect to todos page
    await waitFor(() => {
      expect(screen.getByText(/my todos/i)).toBeInTheDocument();
    });
  });

  it("should show validation errors for invalid email", async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginPage />);

    // Fill in invalid email
    await user.type(screen.getByLabelText(/email/i), "invalid-email");
    await user.type(screen.getByLabelText(/password/i), "password123");

    // Submit form
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it("should show validation errors for short password", async () => {
    const user = userEvent.setup();

    renderWithProviders(<RegisterPage />);

    // Fill in short password
    await user.type(screen.getByLabelText(/full name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/password/i), "123");
    await user.type(screen.getByLabelText(/confirm password/i), "123");

    // Submit form
    await user.click(screen.getByRole("button", { name: /create account/i }));

    // Should show validation error
    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 6 characters/i)
      ).toBeInTheDocument();
    });
  });

  it("should show validation error for password mismatch", async () => {
    const user = userEvent.setup();

    renderWithProviders(<RegisterPage />);

    // Fill in mismatched passwords
    await user.type(screen.getByLabelText(/full name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.type(screen.getByLabelText(/confirm password/i), "different123");

    // Submit form
    await user.click(screen.getByRole("button", { name: /create account/i }));

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    });
  });
});
