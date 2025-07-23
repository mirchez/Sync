"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";

import { useGetMembers } from "@/features/members/api/use-get-members";

import { MemberAvatar } from "@/features/members/components/member-avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { MemberRole } from "@/features/members/type";
import { useConfirm } from "@/hooks/use-confirm";

export const MemberList = () => {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Remove member",
    "This member will be removed from the workspace",
    "destructive"
  );
  const { data } = useGetMembers({ workspaceId });
  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember();

  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({
      json: { role },
      param: { memberId },
    });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;

    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="w-full h-full border-none shadow-none bg-white">
        <ConfirmDialog />
        <CardHeader className="flex flex-row items-center gap-x-4 p-6 sm:p-7 space-y-0 border-b border-gray-100">
          <Button asChild variant="ghost" size="sm" className="h-8">
            <Link href={`/workspaces/${workspaceId}`}>
              <ArrowLeftIcon className="size-4 mr-2" />
              Back
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">Members</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage workspace members and their permissions
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {data?.documents && data.documents.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {data.documents.map((member) => (
                <div
                  key={member.$id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <MemberAvatar
                        className="size-12"
                        fallbackClassName="text-lg font-semibold bg-blue-100 text-blue-600"
                        name={member.name}
                      />

                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-900">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        {/* <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {member.$createdAt}
                          </span>
                        </div> */}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-200"
                        >
                          <MoreVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        side="bottom"
                        align="end"
                        className="w-48 bg-white border border-gray-200 shadow-lg rounded-md py-1"
                      >
                        <DropdownMenuItem
                          className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() =>
                            handleUpdateMember(member.$id, MemberRole.ADMIN)
                          }
                          disabled={isUpdatingMember}
                        >
                          Set as Administrator
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() =>
                            handleUpdateMember(member.$id, MemberRole.MEMBER)
                          }
                          disabled={isUpdatingMember}
                        >
                          Set as Member
                        </DropdownMenuItem>

                        <div className="my-1 h-px bg-gray-200"></div>

                        <DropdownMenuItem
                          className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer flex items-center"
                          onClick={() => handleDeleteMember(member.$id)}
                          disabled={isDeletingMember}
                        >
                          Remove {member.name}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                No members yet
              </h3>
              <p className="text-sm text-gray-500">
                Invite team members to collaborate on this workspace.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
