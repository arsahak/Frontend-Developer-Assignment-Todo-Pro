import { baseApi } from "./baseApi";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
  tags?: string[];
  dueDate?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  tags?: string[];
  dueDate?: string;
}

export interface UpdateTodoRequest {
  id: string;
  title?: string;
  description?: string;
  status?: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
  tags?: string[];
  dueDate?: string;
  order?: number;
}

export interface TodosQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: "createdAt" | "dueDate" | "priority" | "order";
  sortOrder?: "asc" | "desc";
}

export interface TodosResponse {
  todos: Todo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const todosApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodos: builder.query<TodosResponse, TodosQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.status) searchParams.append("status", params.status);
        if (params.search) searchParams.append("search", params.search);
        if (params.sortBy) searchParams.append("sortBy", params.sortBy);
        if (params.sortOrder)
          searchParams.append("sortOrder", params.sortOrder);

        return {
          url: `/todos?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Todo"],
    }),

    getTodo: builder.query<Todo, string>({
      query: (id) => `/todos/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Todo", id }],
    }),

    createTodo: builder.mutation<Todo, CreateTodoRequest>({
      query: (newTodo) => ({
        url: "/todos",
        method: "POST",
        body: newTodo,
      }),
      invalidatesTags: ["Todo"],
    }),

    updateTodo: builder.mutation<Todo, UpdateTodoRequest>({
      query: ({ id, ...updates }) => ({
        url: `/todos/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Todo", id },
        "Todo",
      ],
    }),

    deleteTodo: builder.mutation<void, string>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todo"],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todosApi;
