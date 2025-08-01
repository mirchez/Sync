import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import Image from "next/image";

interface WorkspaceAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

export const WorkspaceAvatar = ({
  image,
  name,
  className,
}: WorkspaceAvatarProps) => {
  if (image) {
    return (
      <div
        className={cn(
          "size-8 sm:size-10 rounded-md relative overflow-hidden flex-shrink-0",
          className
        )}
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover rounded-md"
        />
      </div>
    );
  }

  return (
    <Avatar
      className={cn("size-4 sm:size-6 rounded-md flex-shrink-0", className)}
    >
      <AvatarFallback className="text-white bg-blue-600 font-semibold text-base sm:text-lg uppercase rounded-md flex items-center justify-center size-full">
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
};
