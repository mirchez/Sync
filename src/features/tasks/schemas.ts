import z from "zod";
import { TaskStatus } from "./types";

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  status: z.enum(TaskStatus, "Required"),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  dueDate: z.coerce.date().optional(),
  assigneeId: z.string().trim().min(1, "Required"),
  description: z.string().optional(),
});

export type EditTaskFormValues = Omit<
  z.infer<typeof createTaskSchema>,
  "workspaceId"
> & { workspaceId?: string };
