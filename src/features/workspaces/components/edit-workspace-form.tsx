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
import { ImageIcon, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Workspace } from "../types";
import { useUpdateWorkspace } from "../api/use-update-workspace";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

export const EditWorkspaceForm = ({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  const [imageRemoved, setImageRemoved] = useState(false);

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

    console.log(finalValues);

    mutate(
      { form: finalValues, param: { workspaceId: initialValues.$id } },
      {
        onSuccess: ({ data }) => {
          toast.success("Workspace updated successfully!");
          form.reset();
          setImagePreview(null);
          setImageRemoved(false);
          router.push(`/workspaces/${data.$id}`);
        },
        onError: () => {
          toast.error("Failed to update workspace. Please try again.");
        },
      }
    );
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

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="text-xl font-bold">Edit workspace</CardHeader>

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
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
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
                                disabled={isPending}
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
                          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                            dragActive
                              ? "border-primary bg-primary/5"
                              : "border-muted-foreground/25 hover:border-blue-500"
                          }`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => inputRef.current?.click()}
                        >
                          <Upload className="size-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm font-medium mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG, SVG OR JPEG, MAX 1MB
                          </p>
                        </div>

                        <input
                          className="hidden"
                          accept=".jpg,.png,.jpeg,.svg"
                          type="file"
                          ref={inputRef}
                          disabled={isPending}
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
                disabled={isPending}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={isPending}>
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
  );
};
