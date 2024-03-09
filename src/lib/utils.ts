import { User } from "@clerk/nextjs/server";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);
// Create formatter (English).
export const timeAgo = new TimeAgo("en-US");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUserFullname = (user: User) => {
  if (!user.firstName || !user.lastName) {
    return user.id;
  }

  return `${user.firstName} ${user.lastName}`;
};
