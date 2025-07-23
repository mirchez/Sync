import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

interface MemberAvatarProps {
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const MemberAvatar = ({
  fallbackClassName,
  name,
  className,
}: MemberAvatarProps) => {
  return (
    <Avatar
      className={cn("transition rounded-full overflow-hidden", className)}
    >
      <AvatarFallback
        className={cn(
          "bg-blue-100 font-medium text-blue-600 flex items-center justify-center w-full h-full rounded-full",
          fallbackClassName
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
