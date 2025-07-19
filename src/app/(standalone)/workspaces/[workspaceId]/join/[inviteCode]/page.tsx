import { getCurrent } from "@/features/auth/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { getWorkSpaceInfo } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

interface WorkspaceIdJoinPage {
  params: Promise<{
    workspaceId: string;
  }>;
}

const WorkspaceIdJoinPage = async ({ params }: WorkspaceIdJoinPage) => {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  const { workspaceId } = await params;

  const initialValues = await getWorkSpaceInfo({ workspaceId });

  if (!initialValues) redirect("/");

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default WorkspaceIdJoinPage;
