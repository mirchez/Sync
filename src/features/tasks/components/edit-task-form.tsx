"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EditTaskFormValues, createTaskSchema } from "../schemas";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Task, TaskStatus } from "../types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useUpdateTask } from "../api/use-update-task";

interface EditTaskFormProps {
  onCancel?: () => void;
  projectOptions: { id: string; name: string; imageUrl: string }[];
  memberOptions: { id: string; name: string }[];
  initialValues: Task;
}

export const EditTaskForm = ({
  onCancel,
  projectOptions,
  memberOptions,
  initialValues,
}: EditTaskFormProps) => {
  // @ts-ignore - Temporal fix for TypeScript resolver issues
  const form = useForm({
    resolver: zodResolver(
      createTaskSchema.omit({ workspaceId: true, description: true })
    ) as any,
    defaultValues: {
      name: initialValues.name || "",
      status: initialValues.status || TaskStatus.TODO,
      projectId: initialValues.projectId || "",
      assigneeId: initialValues.assigneeId || "",
      dueDate: initialValues.dueDate
        ? new Date(initialValues.dueDate)
        : undefined,
    },
  });

  const { mutate, isPending } = useUpdateTask();

  const onSubmit = (values: any) => {
    mutate(
      { json: values, param: { taskId: initialValues.$id } },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="text-xl font-bold">Edit a task</CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter task name"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <DatePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee</FormLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {memberOptions.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-x-2">
                            <MemberAvatar
                              className="size-6"
                              name={member.name}
                            />
                            {member.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TaskStatus.BACKLOG}>
                        Backlog
                      </SelectItem>
                      <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                      <SelectItem value={TaskStatus.IN_PROGRESS}>
                        In Progress
                      </SelectItem>
                      <SelectItem value={TaskStatus.IN_REVIEW}>
                        In Review
                      </SelectItem>
                      <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projectOptions.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          <div className="flex items-center gap-x-2">
                            <ProjectAvatar
                              className="size-6"
                              name={project.name}
                              image={project.imageUrl}
                            />
                            {project.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DottedSeparator className="py-7" />

            <div className="flex items-center justify-between">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={onCancel}
                disabled={isPending}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                onClick={() => console.log("Botón Save Task clickeado")}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Task"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
