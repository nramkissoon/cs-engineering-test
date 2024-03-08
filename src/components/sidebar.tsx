"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { CommentText, Home, LogIn } from "./cs-icons";
import { useAuth } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import Image from "next/image";

export const UserProfile = () => {
  const { user } = useUser();
  if (!user) {
    return null;
  }
  return (
    <div className="flex items-center gap-x-4 px-4 py-3">
      <Image
        src={user?.imageUrl}
        alt="Profile image"
        className="rounded-full"
        width={32}
        height={32}
      />
      <span className="font-medium text-gray-700">{user?.fullName}</span>
    </div>
  );
};

const SidebarLink = ({
  href,
  title,
}: {
  href: string;
  title: "Home" | "Log In" | "My posts";
}) => {
  const currentPath = usePathname();
  const isActive = currentPath === href;
  const bg = isActive ? "bg-gray-50" : "bg-none";
  const textColor = isActive ? "text-indigo-600" : "text-gray-700";
  const strokeColor = isActive ? "stroke-indigo-600" : "stroke-gray-700";

  let Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  switch (title) {
    case "Home":
      Icon = Home;
      break;
    case "Log In":
      Icon = LogIn;
      break;
    case "My posts":
      Icon = CommentText;
      break;
  }

  return (
    <Link
      href={href}
      className={clsx(
        "flex w-full items-center gap-x-4 rounded-xl px-4 py-3.5",
        bg,
      )}
    >
      <Icon className={strokeColor} />
      <span className={textColor}>{title}</span>
    </Link>
  );
};

const SidebarLinkList = () => {
  const { isSignedIn } = useAuth();
  return (
    <nav className="flex flex-col space-y-1">
      <SidebarLink href="/" title="Home" />
      {!isSignedIn && <SidebarLink href="/sign-up" title="Log In" />}
      {isSignedIn && <SidebarLink href="/my-posts" title="My posts" />}
    </nav>
  );
};

export const SidebarNavigation = () => {
  return (
    <div className="flex min-h-screen w-[277px] flex-col justify-between py-6 pl-4 pr-5">
      <SidebarLinkList />
      <UserProfile />
    </div>
  );
};
