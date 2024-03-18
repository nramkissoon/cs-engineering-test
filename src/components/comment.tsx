"use client";

import { useAuth } from "@clerk/clerk-react";
import type { Comment as CommentType } from "@prisma/client";
import { VoteType } from "@prisma/client";
import clsx from "clsx";
import {
  ChevronUpSmall,
  ChevronDownSmall,
  Comment as CommentIcon,
} from "./cs-icons";
import { timeAgo } from "~/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { NewComment } from "./new-comment";
import { handleVote } from "~/server/actions";

const VoteButtonContainer = ({
  commentId,
  currentVote,
  totalVotes,
}: {
  commentId: string;
  currentVote: VoteType | undefined;
  totalVotes: number;
}) => {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleVote(commentId, VoteType.UP, currentVote)}
        disabled={!isSignedIn}
      >
        <ChevronUpSmall
          className={clsx(
            currentVote === VoteType.UP
              ? "stroke-indigo-600"
              : "stroke-gray-700",
          )}
        />
      </button>
      <span className="text-sm font-medium text-gray-800">{totalVotes}</span>
      <button
        onClick={() => handleVote(commentId, VoteType.DOWN, currentVote)}
        disabled={!isSignedIn}
      >
        <ChevronDownSmall
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

const CommentHeader = ({
  createdAt,
  userFullName,
  userImageUrl,
}: {
  createdAt: Date;
  userFullName: string;
  userImageUrl: string;
}) => (
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
      {userFullName} {timeAgo.format(createdAt)}
    </span>
  </div>
);

const ReplyButton = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isSignedIn } = useAuth();
  const textColor = isOpen ? "text-indigo-600" : "text-gray-700";
  const strokeColor = isOpen ? "stroke-indigo-600" : "stroke-gray-700";
  return (
    <button
      className="inline-flex items-center gap-x-2"
      onClick={() => setIsOpen(!isOpen)}
      disabled={!isSignedIn}
    >
      <CommentIcon className={strokeColor} />
      <span className={clsx("text-sm font-medium", textColor)}>Reply</span>
    </button>
  );
};

export const Comment = ({
  content,
  currentVote,
  userFullName,
  createdAt,
  id,
  totalVotes,
  rootPostId,
  indentLevel,
  userImageUrl,
}: CommentType & {
  currentVote: VoteType | undefined;
  indentLevel: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={"flex w-full flex-col gap-y-3"}
      style={{
        paddingLeft: `${indentLevel * 32}px`,
      }}
    >
      <CommentHeader
        createdAt={createdAt}
        userFullName={userFullName}
        userImageUrl={userImageUrl}
      />
      <p className="text-sm text-gray-700">{content}</p>
      <div className="flex gap-x-4">
        <VoteButtonContainer
          commentId={id}
          currentVote={currentVote}
          totalVotes={totalVotes}
        />
        <ReplyButton isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      {isOpen && (
        <div className="py-3">
          <NewComment
            parentId={id}
            rootPostId={rootPostId}
            close={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
};
