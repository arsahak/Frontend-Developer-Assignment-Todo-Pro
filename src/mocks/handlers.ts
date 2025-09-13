import { delay, http, HttpResponse } from "msw";

// Mock data
const todos = [
  {
    id: "1",
    title: "Learn React",
    description: "Master React fundamentals",
    status: "in_progress" as const,
    priority: "high" as const,
    tags: ["learning", "react"],
    dueDate: "2024-01-15",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    order: 0,
  },
  {
    id: "2",
    title: "Build Todo App",
    description: "Create a full-stack todo application",
    status: "todo" as const,
    priority: "medium" as const,
    tags: ["project", "todo"],
    dueDate: "2024-02-01",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
    order: 1,
  },
  {
    id: "3",
    title: "Write Tests",
    description: "Add comprehensive test coverage",
    status: "done" as const,
    priority: "low" as const,
    tags: ["testing", "quality"],
    dueDate: "2024-01-10",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
    order: 2,
  },
  {
    id: "4",
    title: "Deploy Application",
    description: "Deploy the application to production",
    status: "todo" as const,
    priority: "high" as const,
    tags: ["deployment", "production"],
    dueDate: "2024-01-20",
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
    order: 3,
  },
  {
    id: "5",
    title: "Code Review",
    description: "Review team member's code",
    status: "in_progress" as const,
    priority: "medium" as const,
    tags: ["review", "team"],
    dueDate: "2024-01-12",
    createdAt: "2024-01-04T00:00:00Z",
    updatedAt: "2024-01-04T00:00:00Z",
    order: 4,
  },
  {
    id: "6",
    title: "Update Documentation",
    description: "Update project documentation",
    status: "done" as const,
    priority: "low" as const,
    tags: ["documentation", "maintenance"],
    dueDate: "2024-01-08",
    createdAt: "2024-01-06T00:00:00Z",
    updatedAt: "2024-01-08T00:00:00Z",
    order: 5,
  },
  {
    id: "7",
    title: "Setup CI/CD Pipeline",
    description: "Configure continuous integration and deployment",
    status: "todo" as const,
    priority: "high" as const,
    tags: ["devops", "ci-cd"],
    dueDate: "2024-01-25",
    createdAt: "2024-01-07T00:00:00Z",
    updatedAt: "2024-01-07T00:00:00Z",
    order: 6,
  },
  {
    id: "8",
    title: "Performance Optimization",
    description: "Optimize application performance",
    status: "in_progress" as const,
    priority: "medium" as const,
    tags: ["performance", "optimization"],
    dueDate: "2024-01-18",
    createdAt: "2024-01-08T00:00:00Z",
    updatedAt: "2024-01-08T00:00:00Z",
    order: 7,
  },
  {
    id: "9",
    title: "Security Audit",
    description: "Conduct security audit of the application",
    status: "todo" as const,
    priority: "high" as const,
    tags: ["security", "audit"],
    dueDate: "2024-01-30",
    createdAt: "2024-01-09T00:00:00Z",
    updatedAt: "2024-01-09T00:00:00Z",
    order: 8,
  },
  {
    id: "10",
    title: "User Feedback Analysis",
    description: "Analyze user feedback and implement improvements",
    status: "done" as const,
    priority: "low" as const,
    tags: ["feedback", "analysis"],
    dueDate: "2024-01-14",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-14T00:00:00Z",
    order: 9,
  },
  {
    id: "11",
    title: "Database Migration",
    description: "Migrate database to new version",
    status: "todo" as const,
    priority: "medium" as const,
    tags: ["database", "migration"],
    dueDate: "2024-02-05",
    createdAt: "2024-01-11T00:00:00Z",
    updatedAt: "2024-01-11T00:00:00Z",
    order: 10,
  },
  {
    id: "12",
    title: "API Documentation",
    description: "Create comprehensive API documentation",
    status: "in_progress" as const,
    priority: "low" as const,
    tags: ["api", "documentation"],
    dueDate: "2024-01-22",
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-12T00:00:00Z",
    order: 11,
  },
];

// Mock users storage
const users: Array<{
  id: string;
  name: string;
  email: string;
  password: string;
}> = [];

export const handlers = [
  // Test endpoint
  http.get("/api/test", () => {
    console.log("MSW: Test endpoint called");
    return HttpResponse.json({ message: "MSW is working!" });
  }),

  // Auth endpoints
  http.post("/api/auth/register", async ({ request }) => {
    console.log("MSW: Registration endpoint called");
    await delay(100);
    const body = (await request.json()) as any;
    console.log("MSW: Registration data received:", body);

    // Check if user already exists
    const existingUser = users.find((user) => user.email === body.email);
    if (existingUser) {
      return HttpResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    const newUser = {
      id: "user-" + Date.now(),
      name: body.name,
      email: body.email,
      password: body.password, // In real app, this would be hashed
    };

    users.push(newUser);

    const user = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    const token = "mock-jwt-token-" + Date.now();

    console.log("MSW: Returning registration response:", { user, token });
    return HttpResponse.json({
      user,
      token,
    });
  }),

  http.post("/api/auth/login", async ({ request }) => {
    await delay(100);
    const body = (await request.json()) as any;

    // Find user by email
    const user = users.find((u) => u.email === body.email);

    if (!user) {
      return HttpResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password (in real app, this would be hashed comparison)
    if (user.password !== body.password) {
      return HttpResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = "mock-jwt-token-" + Date.now();

    return HttpResponse.json({
      user: userResponse,
      token,
    });
  }),

  http.get("/api/auth/profile", async () => {
    await delay(100);

    // In a real app, you'd validate the JWT token here
    // For mock purposes, we'll just return a mock user
    const mockUser = {
      id: "user-1",
      name: "Mock User",
      email: "mock@example.com",
    };

    return HttpResponse.json(mockUser);
  }),

  // Todo endpoints
  http.get("/api/todos", async ({ request }) => {
    await delay(100);
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    let filteredTodos = [...todos];

    // Apply filters
    if (status) {
      filteredTodos = filteredTodos.filter((todo) => todo.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredTodos = filteredTodos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchLower) ||
          todo.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filteredTodos.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "dueDate":
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          break;
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case "order":
          aValue = a.order || 0;
          bValue = b.order || 0;
          break;
        default:
          // Default to order field for drag and drop
          aValue = a.order || 0;
          bValue = b.order || 0;
      }

      if (sortOrder === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    // Apply pagination
    const total = filteredTodos.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTodos = filteredTodos.slice(startIndex, endIndex);

    return HttpResponse.json({
      todos: paginatedTodos,
      total,
      page,
      limit,
      totalPages,
    });
  }),

  http.post("/api/todos", async ({ request }) => {
    await delay(100);
    const body = (await request.json()) as any;

    const newTodo = {
      id: (todos.length + 1).toString(),
      ...body,
      status: body.status || "todo",
      order: todos.length, // Add to end of list
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    todos.push(newTodo);

    return HttpResponse.json(newTodo, { status: 201 });
  }),

  http.patch("/api/todos/:id", async ({ request, params }) => {
    await delay(100);
    const { id } = params;
    const body = (await request.json()) as any;

    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      return HttpResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    // If updating order, update all todos' order accordingly
    if (body.order !== undefined) {
      const newOrder = body.order;
      const oldOrder = todos[todoIndex].order;

      if (newOrder !== oldOrder) {
        // Update all todos' order
        todos.forEach((todo) => {
          if (todo.id === id) {
            todo.order = newOrder;
          } else if (newOrder < oldOrder) {
            // Moving up: increment order for todos between new and old position
            if (todo.order >= newOrder && todo.order < oldOrder) {
              todo.order += 1;
            }
          } else {
            // Moving down: decrement order for todos between old and new position
            if (todo.order > oldOrder && todo.order <= newOrder) {
              todo.order -= 1;
            }
          }
        });
      }
    }

    todos[todoIndex] = {
      ...todos[todoIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(todos[todoIndex]);
  }),

  http.delete("/api/todos/:id", async ({ params }) => {
    await delay(100);
    const { id } = params;

    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      return HttpResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    todos.splice(todoIndex, 1);

    return HttpResponse.json({ message: "Todo deleted successfully" });
  }),
];
