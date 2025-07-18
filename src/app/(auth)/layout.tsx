"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathName = usePathname();
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Image
              alt="sync"
              width={20}
              height={20}
              src={"/logo.svg"}
              className="w-5 h-5 text-white"
            />
          </div>

          <Button asChild variant="outline">
            <Link href={pathName === "/sign-in" ? "/sign-up" : "/sign-in"}>
              {pathName === "/sign-in" ? "Sign Up" : "Login"}
            </Link>
          </Button>
        </nav>

        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
