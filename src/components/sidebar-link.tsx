"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { CommentText, Home, LogIn } from "./cs-icons";

export const SidebarLink = ({
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
