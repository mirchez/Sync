import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import Image from "next/image";

interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const ProjectAvatar = ({
  image,
  name,
  className,
  fallbackClassName,
}: ProjectAvatarProps) => {
  if (image) {
    return (
      <div
        className={cn(
          "size-4 sm:size-5 rounded-md relative overflow-hidden flex-shrink-0",
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
      className={cn("size-4 sm:size-5 rounded-md flex-shrink-0", className)}
    >
      <AvatarFallback
        className={cn(
          "text-white bg-blue-600 font-semibold text-xs sm:text-sm uppercase rounded-md flex items-center justify-center size-full",
          fallbackClassName
        )}
      >
        {name[0]}
      </AvatarFallback>
    </Avatar>
  );
};
