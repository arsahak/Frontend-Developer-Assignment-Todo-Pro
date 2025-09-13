import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useState } from "react";
import { toast } from "react-toastify";
import { TodoForm } from "../components/forms/TodoForm";
import { TodoFilters } from "../components/TodoFilters";
import { TodoItem } from "../components/TodoItem";
import { TodoSkeleton } from "../components/TodoSkeleton";
import {
  todosApi,
  useDeleteTodoMutation,
  useGetTodosQuery,
  useUpdateTodoMutation,
  type Todo,
} from "../store/api/todosApi";
import { useAppDispatch } from "../store/hooks";

export function TodosPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    search: "",
    sortBy: "order" as const,
    sortOrder: "asc" as const,
  });

  const { data, isLoading, error } = useGetTodosQuery(filters);
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const dispatch = useAppDispatch();

  const handleAddTodo = () => {
    setEditingTodo(null);
    setShowForm(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleDeleteTodo = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      try {
        await deleteTodo(id).unwrap();
        toast.success("Todo deleted successfully!");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete todo");
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !data?.todos) return;

    const { source, destination } = result;

    if (source.index === destination.index) return;

    const draggedTodo = data.todos[source.index];

    // Optimistic update: immediately reorder the list locally
    const newTodos = Array.from(data.todos);
    const [reorderedTodo] = newTodos.splice(source.index, 1);
    newTodos.splice(destination.index, 0, reorderedTodo);

    // Update each todo's order based on new positions
    const updatedTodos = newTodos.map((todo, index) => ({
      ...todo,
      order: index,
    }));

    // Immediately update the cache with reordered todos
    dispatch(
      todosApi.util.updateQueryData("getTodos", filters, (draft) => {
        draft.todos = updatedTodos;
      })
    );

    // Update the order in the backend
    try {
      await updateTodo({
        id: draggedTodo.id,
        order: destination.index,
      }).unwrap();

      toast.success("Todo order updated!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update todo order");
      // Revert the optimistic update on error
      dispatch(
        todosApi.util.updateQueryData("getTodos", filters, (draft) => {
          draft.todos = data.todos;
        })
      );
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Error Loading Todos
          </h3>
          <p className="text-red-600 dark:text-red-300">
            There was an error loading your todos. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Todos
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {filters.sortBy === "order"
              ? "Drag and drop to reorder your todos"
              : "Set sort to 'Custom Order' to enable drag and drop"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label
              htmlFor="pageSize"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Items per page:
            </label>
            <select
              id="pageSize"
              value={filters.limit}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  limit: parseInt(e.target.value),
                  page: 1,
                }))
              }
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <button
            onClick={handleAddTodo}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
          >
            Add Todo
          </button>
        </div>
      </div>

      <TodoFilters filters={filters} onFiltersChange={setFilters} />

      {showForm && (
        <div className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {editingTodo ? "Edit Todo" : "Add New Todo"}
          </h2>
          <TodoForm
            todo={editingTodo || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <>
            <TodoSkeleton />
            <TodoSkeleton />
            <TodoSkeleton />
          </>
        ) : data && data.todos.length > 0 ? (
          <DragDropContext
            onDragEnd={filters.sortBy === "order" ? handleDragEnd : () => {}}
          >
            <Droppable droppableId="todos">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  data-testid="todos-drop-zone"
                  className={`space-y-4 transition-all duration-200 ${
                    snapshot.isDraggingOver
                      ? "bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 border-2 border-dashed border-blue-300 dark:border-blue-600"
                      : ""
                  }`}
                >
                  {data.todos.map((todo, index) => (
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id}
                      index={index}
                      isDragDisabled={filters.sortBy !== "order"}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          data-testid="todo-item"
                          className={`${
                            snapshot.isDragging
                              ? "shadow-2xl transform rotate-1 scale-105 border-2 border-blue-300 dark:border-blue-600"
                              : "hover:shadow-md"
                          } transition-all duration-200 ease-in-out`}
                        >
                          <TodoItem
                            todo={todo}
                            onEdit={handleEditTodo}
                            onDelete={handleDeleteTodo}
                            isDeleting={isDeleting}
                            isDragDisabled={filters.sortBy !== "order"}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No todos found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {filters.search || filters.status
                ? "No todos match your current filters."
                : "Get started by creating your first todo!"}
            </p>
            {!filters.search && !filters.status && (
              <button
                onClick={handleAddTodo}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
              >
                Create Your First Todo
              </button>
            )}
          </div>
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(filters.page - 1) * filters.limit + 1} to{" "}
            {Math.min(filters.page * filters.limit, data.total)} of {data.total}{" "}
            todos
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={filters.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              ← Previous
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: pageNum }))
                    }
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                      pageNum === filters.page
                        ? "bg-blue-600 text-white dark:bg-blue-600"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={filters.page === data.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
