"use client";

import Image from "next/image";
import Link from "next/link";
import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { Projects } from "./projects";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-white p-6 w-full border-r border-gray-100">
      <Link
        href={"/"}
        className="flex items-center gap-3 mb-8 group transition-all duration-200 hover:scale-[1.02]"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Image
              alt="sync"
              width={20}
              height={20}
              src={"/logo.svg"}
              className="w-5 h-5 text-white"
            />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black text-gray-900 tracking-tight leading-none">
            SYNC
          </span>
          <span className="text-xs text-gray-400 font-medium tracking-wider">
            WORKSPACE
          </span>
        </div>
      </Link>

      <DottedSeparator className="my-6 opacity-50" />

      <WorkspaceSwitcher />

      <DottedSeparator className="my-6 opacity-50" />

      <Navigation />

      <DottedSeparator className="my-6 opacity-50" />

      <Projects />
    </aside>
  );
};
