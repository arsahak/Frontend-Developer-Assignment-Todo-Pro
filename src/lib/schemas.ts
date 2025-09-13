import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Todo schemas
export const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).optional(),
  tags: z.array(z.string()).optional(),
  dueDate: z.string().optional(),
});

export const todoUpdateSchema = todoSchema.partial();

export const todoFiltersSchema = z.object({
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "dueDate", "priority"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type TodoFormData = z.infer<typeof todoSchema>;
export type TodoUpdateFormData = z.infer<typeof todoUpdateSchema>;
export type TodoFiltersFormData = z.infer<typeof todoFiltersSchema>;
