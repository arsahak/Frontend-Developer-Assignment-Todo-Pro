import { expect, test } from "@playwright/test";

test.describe("Drag and Drop", () => {
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

  test("should drag and drop todos to reorder", async ({ page }) => {
    // Get the first todo item
    const firstTodo = page.locator('[data-testid="todo-item"]').first();
    const secondTodo = page.locator('[data-testid="todo-item"]').nth(1);

    // Perform drag and drop
    await firstTodo.dragTo(secondTodo);

    // Should show success message
    await expect(page.getByText("Todo order updated!")).toBeVisible();
  });

  test("should show drag handle on hover", async ({ page }) => {
    // Hover over first todo
    const firstTodo = page.locator('[data-testid="todo-item"]').first();
    await firstTodo.hover();

    // Should show drag handle
    await expect(page.locator('[data-testid="drag-handle"]')).toBeVisible();
  });

  test("should highlight drop zone during drag", async ({ page }) => {
    // Start dragging first todo
    const firstTodo = page.locator('[data-testid="todo-item"]').first();
    const dropZone = page.locator('[data-testid="todos-drop-zone"]');

    // Start drag operation
    await firstTodo.hover();
    await page.mouse.down();

    // Move to drop zone
    await page.mouse.move(400, 300);

    // Should highlight drop zone
    await expect(dropZone).toHaveClass(/bg-blue-50/);

    // Complete drag
    await page.mouse.up();
  });
});
