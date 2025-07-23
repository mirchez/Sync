"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { updateWorkspaceSchema } from "../schemas";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
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
import { useRef, useState } from "react";
import Image from "next/image";
import {
  ImageIcon,
  Upload,
  X,
  Loader2,
  CopyIcon,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Workspace } from "../types";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useResetInviteCode } from "../api/use-reset-invite-code";
import Link from "next/link";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

export const EditWorkspaceForm = ({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) => {
  // Edit part
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageRemoved, setImageRemoved] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  const { mutate, isPending } = useUpdateWorkspace();

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image:
        values.image instanceof File
          ? values.image
          : imageRemoved
          ? ""
          : initialValues.imageUrl ?? "",
    };

    mutate({ form: finalValues, param: { workspaceId: initialValues.$id } });
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 1MB");
      return false;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, SVG, and JPEG files are allowed");
      return false;
    }

    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      form.setValue("image", file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImageRemoved(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        form.setValue("image", file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setImageRemoved(false);
      }
    }
  };

  const handleRemoveImage = () => {
    form.setValue("image", "");
    setImagePreview(null);
    setImageRemoved(true);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const currentImage = form.watch("image");
  const hasInitialImage =
    initialValues.imageUrl &&
    !imagePreview &&
    !(currentImage instanceof File) &&
    !imageRemoved;
  const hasNewImage = imagePreview || currentImage instanceof File;

  // Deleting part
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This action cannot be undone",
    "destructive"
  );

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    deleteWorkspace(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          toast.success("Workspace deleted successfully");
          router.push("/");
        },
        onError: () => {
          toast.error("Failed to delete workspace. Please try again.");
        },
      }
    );
  };

  // Reset invite code part
  const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success("Invite link copied to clipboard"))
      .catch(() => toast.error("Failed to copy invite link"));
  };

  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode();

  const [ResetDialog, confirmReset] = useConfirm(
    "Reset invite link",
    "This will invalidate the current invite link",
    "destructive"
  );

  const handleResetInviteCode = async () => {
    const ok = await confirmReset();

    if (!ok) return;

    resetInviteCode(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          toast.success("Invite link reset successfully");
        },
        onError: () => {
          toast.error("Failed to reset invite link. Please try again.");
        },
      }
    );
  };

  const isLoading = isPending || isDeletingWorkspace || isResettingInviteCode;

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetDialog />

      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Button asChild variant="ghost" size="sm" className="px-2">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
          <h2 className="text-xl font-bold">Edit workspace</h2>
        </CardHeader>

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
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter workspace name"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Workspace Icon</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-6">
                        {/* Image Preview - Circular */}
                        <div className="relative flex-shrink-0">
                          {hasNewImage || hasInitialImage ? (
                            <div className="size-24 relative rounded-full overflow-hidden group border-2 border-border">
                              <Image
                                src={
                                  imagePreview ||
                                  (currentImage instanceof File
                                    ? URL.createObjectURL(currentImage)
                                    : initialValues.imageUrl || "")
                                }
                                alt="Workspace icon"
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-white hover:bg-red-500 rounded-full"
                                  onClick={handleRemoveImage}
                                  disabled={isLoading}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="size-24 rounded-full border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/20">
                              <ImageIcon className="size-10 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Upload Area */}
                        <div className="flex-1">
                          <div
                            className={cn(
                              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                              dragActive
                                ? "border-primary bg-primary/5"
                                : "border-muted-foreground/25 hover:border-blue-500",
                              isLoading && "opacity-50 cursor-not-allowed"
                            )}
                            onDragEnter={!isLoading ? handleDrag : undefined}
                            onDragLeave={!isLoading ? handleDrag : undefined}
                            onDragOver={!isLoading ? handleDrag : undefined}
                            onDrop={!isLoading ? handleDrop : undefined}
                            onClick={
                              !isLoading
                                ? () => inputRef.current?.click()
                                : undefined
                            }
                          >
                            <Upload className="size-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm font-medium mb-1">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              JPG, PNG, SVG or JPEG, max 1MB
                            </p>
                          </div>

                          <input
                            className="hidden"
                            accept=".jpg,.png,.jpeg,.svg"
                            type="file"
                            ref={inputRef}
                            disabled={isLoading}
                            onChange={handleImageChange}
                          />
                        </div>
                      </div>
                    </FormControl>
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
                  disabled={isLoading}
                  className={cn(!onCancel && "invisible")}
                >
                  Cancel
                </Button>
                <Button type="submit" size="lg" disabled={isLoading}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Workspace"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add members to your workspace
            </p>

            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input
                  disabled
                  value={fullInviteLink}
                  className="font-mono text-sm"
                />
                <Button
                  className="size-12"
                  variant="secondary"
                  onClick={handleCopyInviteLink}
                  disabled={isLoading}
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>

            <DottedSeparator className="py-7" />

            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isLoading}
              onClick={handleResetInviteCode}
            >
              {isResettingInviteCode ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset invite link"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irreversible and will remove all
              associated data.
            </p>

            <DottedSeparator className="py-7" />

            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isLoading}
              onClick={handleDelete}
            >
              {isDeletingWorkspace ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Workspace"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
