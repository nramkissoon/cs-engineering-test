"use client";

import type { Post as PostType } from "@prisma/client";
import { VoteType } from "@prisma/client";
import { ChevronDown, ChevronUp } from "./cs-icons";
import Image from "next/image";
import { timeAgo } from "~/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { handleVote } from "~/server/actions";
import { useAuth } from "@clerk/clerk-react";

const VoteButtonContainer = ({
  postId,
  currentVote,
  totalVotes,
}: {
  postId: string;
  currentVote: VoteType | undefined;
  totalVotes: number;
}) => {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex flex-col items-center gap-y-[10px]">
      <button
        onClick={() => handleVote(postId, VoteType.UP, currentVote)}
        disabled={!isSignedIn}
      >
        <ChevronUp
          className={clsx(
            currentVote === VoteType.UP
              ? "stroke-indigo-600"
              : "stroke-gray-700",
          )}
        />
      </button>
      <span className="font-medium text-gray-800">{totalVotes}</span>
      <button
        onClick={() => handleVote(postId, VoteType.DOWN, currentVote)}
        disabled={!isSignedIn}
      >
        <ChevronDown
          className={clsx(
            currentVote === VoteType.DOWN
              ? "stroke-indigo-600"
              : "stroke-gray-700",
          )}
        />
      </button>
    </div>
  );
};

export const Post = ({
  title,
  content,
  totalVotes,
  createdAt,
  id,
  currentVote,
  userFullName,
  userImageUrl,
}: PostType & {
  currentVote: VoteType | undefined;
}) => {
  return (
    <div className="flex gap-x-4">
      <VoteButtonContainer
        postId={id}
        currentVote={currentVote}
        totalVotes={totalVotes}
      />
      <Link href={`/posts/${id}`}>
        <div className="flex flex-col gap-y-[6px]">
          <div className="flex items-center gap-x-2">
            <div>
              <Image
                src={userImageUrl}
                alt="Profile image"
                className="rounded-full"
                width={24}
                height={24}
                unoptimized
              />
            </div>
            <span className="text-sm font-light text-gray-600">
              Posted by {userFullName} {timeAgo.format(createdAt)}
            </span>
          </div>
          <h2 className="font-medium text-gray-900">{title}</h2>
          <p className="text-sm text-gray-700">{content}</p>
        </div>
      </Link>
    </div>
  );
};
