import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { getUserFullname } from "~/lib/utils";
import { SidebarLink } from "./sidebar-link";

export const UserProfile = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  return (
    <div className="flex items-center gap-x-4 px-4 py-3">
      <Image
        src={user.imageUrl}
        alt="Profile image"
        className="rounded-full"
        width={32}
        height={32}
      />
      <span className="font-medium text-gray-700">{getUserFullname(user)}</span>
    </div>
  );
};

const SidebarLinkList = async () => {
  const user = await currentUser();
  return (
    <nav className="flex flex-col space-y-1">
      <SidebarLink href="/" title="Home" />
      {!user && <SidebarLink href="/sign-up" title="Log In" />}
      {user && <SidebarLink href="/my-posts" title="My posts" />}
    </nav>
  );
};

export const SidebarNavigation = () => {
  return (
    <div className="sticky top-0 flex h-screen min-w-[277px] flex-col justify-between py-6 pl-4 pr-5">
      <SidebarLinkList />
      <UserProfile />
    </div>
  );
};
