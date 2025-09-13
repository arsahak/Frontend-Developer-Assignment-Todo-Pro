import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TodosPage } from "../pages/TodosPage";
import { renderWithProviders } from "./utils";

describe("Todos CRUD", () => {
  it("should display todos list", async () => {
    renderWithProviders(<TodosPage />);

    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByText(/learn react/i)).toBeInTheDocument();
      expect(screen.getByText(/build todo app/i)).toBeInTheDocument();
    });
  });

  it("should create a new todo", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TodosPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText(/my todos/i)).toBeInTheDocument();
    });

    // Click add todo button
    await user.click(screen.getByRole("button", { name: /add todo/i }));

    // Fill in todo form
    await user.type(screen.getByLabelText(/title/i), "New Todo Item");
    await user.type(
      screen.getByLabelText(/description/i),
      "This is a new todo"
    );

    // Submit form
    await user.click(screen.getByRole("button", { name: /create todo/i }));

    // Should show new todo
    await waitFor(() => {
      expect(screen.getByText(/new todo item/i)).toBeInTheDocument();
    });
  });

  it("should update todo status", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TodosPage />);

    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByText(/learn react/i)).toBeInTheDocument();
    });

    // Click "Done" button for first todo
    const doneButtons = screen.getAllByRole("button", { name: /done/i });
    await user.click(doneButtons[0]);

    // Should update status
    await waitFor(() => {
      expect(screen.getByText(/todo status updated/i)).toBeInTheDocument();
    });
  });

  it("should delete todo with confirmation", async () => {
    const user = userEvent.setup();

    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    renderWithProviders(<TodosPage />);

    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByText(/learn react/i)).toBeInTheDocument();
    });

    // Click delete button for first todo
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]);

    // Should show confirmation dialog
    expect(confirmSpy).toHaveBeenCalledWith(
      "Are you sure you want to delete this todo?"
    );

    // Should delete todo
    await waitFor(() => {
      expect(
        screen.getByText(/todo deleted successfully/i)
      ).toBeInTheDocument();
    });

    confirmSpy.mockRestore();
  });

  it("should filter todos by status", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TodosPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText(/my todos/i)).toBeInTheDocument();
    });

    // Select "In Progress" filter
    await user.selectOptions(screen.getByLabelText(/status/i), "in_progress");

    // Apply filter
    await user.click(screen.getByRole("button", { name: /apply filters/i }));

    // Should show filtered results
    await waitFor(() => {
      expect(screen.getByText(/learn react/i)).toBeInTheDocument();
    });
  });

  it("should search todos", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TodosPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText(/my todos/i)).toBeInTheDocument();
    });

    // Type in search box
    await user.type(screen.getByLabelText(/search/i), "react");

    // Apply search
    await user.click(screen.getByRole("button", { name: /apply filters/i }));

    // Should show search results
    await waitFor(() => {
      expect(screen.getByText(/learn react/i)).toBeInTheDocument();
    });
  });
});
