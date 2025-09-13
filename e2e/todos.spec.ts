import { expect, test } from "@playwright/test";

test.describe("Todo Management", () => {
  test.beforeEach(async ({ page }) => {
    // Register and login before each test
    await page.goto("/register");
    await page.getByLabel("Full Name").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByLabel("Confirm Password").fill("password123");
    await page.getByRole("button", { name: "Create Account" }).click();

    // Wait for todos page to load
    await expect(page.getByText("My Todos")).toBeVisible();
  });

  test("should display todos list", async ({ page }) => {
    // Should show sample todos
    await expect(page.getByText("Learn React")).toBeVisible();
    await expect(page.getByText("Build Todo App")).toBeVisible();
  });

  test("should create a new todo", async ({ page }) => {
    // Click add todo button
    await page.getByRole("button", { name: "Add Todo" }).click();

    // Fill todo form
    await page.getByLabel("Title").fill("E2E Test Todo");
    await page
      .getByLabel("Description")
      .fill("This is a test todo created by E2E test");
    await page.getByLabel("Priority").selectOption("high");
    await page.getByLabel("Status").selectOption("todo");

    // Submit form
    await page.getByRole("button", { name: "Create Todo" }).click();

    // Should show new todo
    await expect(page.getByText("E2E Test Todo")).toBeVisible();
    await expect(
      page.getByText("This is a test todo created by E2E test")
    ).toBeVisible();
  });

  test("should update todo status", async ({ page }) => {
    // Click "Done" button for first todo
    const doneButtons = page.getByRole("button", { name: "Done" });
    await doneButtons.first().click();

    // Should show success message
    await expect(page.getByText("Todo status updated!")).toBeVisible();
  });

  test("should delete todo with confirmation", async ({ page }) => {
    // Set up dialog handler
    page.on("dialog", (dialog) => dialog.accept());

    // Click delete button for first todo
    const deleteButtons = page.getByRole("button", { name: /delete/i });
    await deleteButtons.first().click();

    // Should show success message
    await expect(page.getByText("Todo deleted successfully!")).toBeVisible();
  });

  test("should filter todos by status", async ({ page }) => {
    // Select "In Progress" filter
    await page.getByLabel("Status").selectOption("in_progress");

    // Apply filter
    await page.getByRole("button", { name: "Apply Filters" }).click();

    // Should show filtered results
    await expect(page.getByText("Learn React")).toBeVisible();
  });

  test("should search todos", async ({ page }) => {
    // Type in search box
    await page.getByLabel("Search").fill("react");

    // Apply search
    await page.getByRole("button", { name: "Apply Filters" }).click();

    // Should show search results
    await expect(page.getByText("Learn React")).toBeVisible();
  });

  test("should sort todos by priority", async ({ page }) => {
    // Select priority sort
    await page.getByLabel("Sort By").selectOption("priority");
    await page.getByLabel("Order").selectOption("desc");

    // Apply filters
    await page.getByRole("button", { name: "Apply Filters" }).click();

    // Should show sorted results
    await expect(page.getByText("Learn React")).toBeVisible();
  });

  test("should change page size", async ({ page }) => {
    // Change page size to 5
    await page.getByLabel("Items per page:").selectOption("5");

    // Should update pagination
    await expect(page.getByText("Showing 1 to 5 of")).toBeVisible();
  });
});
