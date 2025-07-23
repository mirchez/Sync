import { getCurrent } from "@/features/auth/queries";
import { getWorkSpace } from "@/features/workspaces/queries";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { redirect } from "next/navigation";
import React from "react";
import { ProjectIdSettingsClient } from "./client";

const WorkspaceIdSettingsPage = async () => {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-xl">
      <ProjectIdSettingsClient />
    </div>
  );
};

export default WorkspaceIdSettingsPage;
