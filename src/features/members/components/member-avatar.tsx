import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

interface MemberAvatarProps {
  name: string;
  className?: string;
  fallbackClassname?: string;
}

export const MemberAvatar = ({
  fallbackClassname,
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
          fallbackClassname
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
