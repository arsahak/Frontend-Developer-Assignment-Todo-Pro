import { toast } from "react-toastify";
import { useUpdateTodoMutation, type Todo } from "../store/api/todosApi";

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  isDragDisabled?: boolean;
}

export function TodoItem({
  todo,
  onEdit,
  onDelete,
  isDeleting,
  isDragDisabled = false,
}: TodoItemProps) {
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "done":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const handleStatusChange = async (
    newStatus: "todo" | "in_progress" | "done"
  ) => {
    try {
      await updateTodo({
        id: todo.id,
        status: newStatus,
      }).unwrap();
      toast.success("Todo status updated!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update todo status");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue =
    todo.dueDate &&
    new Date(todo.dueDate) < new Date() &&
    todo.status !== "done";

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-all hover:shadow-md ${
        isOverdue ? "border-l-4 border-red-500" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {todo.title}
          </h3>
          {todo.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              {todo.description}
            </p>
          )}
        </div>

        <div className="flex space-x-2">
          {/* Drag Handle */}
          <div
            data-testid="drag-handle"
            className={`flex items-center p-1 rounded transition-colors ${
              isDragDisabled
                ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
                : "cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            title={
              isDragDisabled
                ? "Change sort to 'Custom Order' to drag"
                : "Drag to reorder"
            }
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
          </div>

          <button
            onClick={() => onEdit(todo)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            disabled={isUpdating}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <button
            onClick={() => onDelete(todo.id)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            disabled={isDeleting}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(todo.status)}`}
        >
          {todo.status.replace("_", " ").toUpperCase()}
        </span>

        {todo.priority && (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}
          >
            {todo.priority.toUpperCase()} PRIORITY
          </span>
        )}

        {isOverdue && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-800">
            OVERDUE
          </span>
        )}
      </div>

      {todo.tags && todo.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {todo.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div>Created: {formatDate(todo.createdAt)}</div>

        {todo.dueDate && (
          <div
            className={
              isOverdue ? "text-red-600 dark:text-red-400 font-medium" : ""
            }
          >
            Due: {formatDate(todo.dueDate)}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => handleStatusChange("todo")}
            disabled={isUpdating || todo.status === "todo"}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              todo.status === "todo"
                ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200"
            } disabled:cursor-not-allowed`}
          >
            To Do
          </button>

          <button
            onClick={() => handleStatusChange("in_progress")}
            disabled={isUpdating || todo.status === "in_progress"}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              todo.status === "in_progress"
                ? "bg-blue-200 text-blue-800 dark:bg-blue-600 dark:text-blue-200"
                : "bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 dark:text-blue-200"
            } disabled:cursor-not-allowed`}
          >
            In Progress
          </button>

          <button
            onClick={() => handleStatusChange("done")}
            disabled={isUpdating || todo.status === "done"}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              todo.status === "done"
                ? "bg-green-200 text-green-800 dark:bg-green-600 dark:text-green-200"
                : "bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-700 dark:hover:bg-green-600 dark:text-green-200"
            } disabled:cursor-not-allowed`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
