"use client";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

export const Projects = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetProjects({ workspaceId });
  const { open } = useCreateProjectModal();

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>

      <div className="flex flex-col space-y-1">
        {data?.documents.map((project) => {
          const pathname = usePathname();
          const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
          const isActive = pathname === href;

          return (
            <Link href={href} key={project.$id} className="block w-full">
              <div
                className={cn(
                  "flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-md hover:opacity-75 transition-all duration-200 cursor-pointer text-neutral-500 w-full",
                  isActive &&
                    "bg-white shadow-sm hover:opacity-100 text-primary"
                )}
              >
                <div className="flex-shrink-0">
                  <ProjectAvatar image={project.imageUrl} name={project.name} />
                </div>
                <span className="truncate text-sm sm:text-base min-w-0 flex-1">
                  {project.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
