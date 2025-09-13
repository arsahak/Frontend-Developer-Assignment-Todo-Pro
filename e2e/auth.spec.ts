import { expect, test } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/app/todos");

    // Should redirect to login page
    await expect(page).toHaveURL("/login");
    await expect(page.getByText("Sign in to your account")).toBeVisible();
  });

  test("should register a new user", async ({ page }) => {
    await page.goto("/register");

    // Fill registration form
    await page.getByLabel("Full Name").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByLabel("Confirm Password").fill("password123");

    // Submit form
    await page.getByRole("button", { name: "Create Account" }).click();

    // Should redirect to todos page
    await expect(page).toHaveURL("/app/todos");
    await expect(page.getByText("My Todos")).toBeVisible();
  });

  test("should login with existing user", async ({ page }) => {
    // First register a user
    await page.goto("/register");
    await page.getByLabel("Full Name").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByLabel("Confirm Password").fill("password123");
    await page.getByRole("button", { name: "Create Account" }).click();

    // Logout
    await page.getByRole("button", { name: "Logout" }).click();

    // Login
    await page.goto("/login");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign In" }).click();

    // Should redirect to todos page
    await expect(page).toHaveURL("/app/todos");
    await expect(page.getByText("My Todos")).toBeVisible();
  });

  test("should show validation errors for invalid registration", async ({
    page,
  }) => {
    await page.goto("/register");

    // Submit empty form
    await page.getByRole("button", { name: "Create Account" }).click();

    // Should show validation errors
    await expect(
      page.getByText("Name must be at least 2 characters")
    ).toBeVisible();
    await expect(page.getByText("Invalid email address")).toBeVisible();
    await expect(
      page.getByText("Password must be at least 6 characters")
    ).toBeVisible();
  });

  test("should show validation errors for password mismatch", async ({
    page,
  }) => {
    await page.goto("/register");

    // Fill form with mismatched passwords
    await page.getByLabel("Full Name").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByLabel("Confirm Password").fill("different123");
    await page.getByRole("button", { name: "Create Account" }).click();

    // Should show validation error
    await expect(page.getByText("Passwords don't match")).toBeVisible();
  });
});
