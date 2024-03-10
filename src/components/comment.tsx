"use client";

import { useAuth, useUser } from "@clerk/clerk-react";
import { Comment as CommentType, VoteType } from "@prisma/client";
import clsx from "clsx";
import { api } from "~/trpc/react";
import {
  ChevronUpSmall,
  ChevronDownSmall,
  Comment as CommentIcon,
} from "./cs-icons";
import { timeAgo } from "~/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { NewComment } from "./new-comment";

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
  const { mutateAsync: updateVote } = api.vote.vote.useMutation();
  const { mutateAsync: removeVote } = api.vote.removeVote.useMutation();
  const apiUtils = api.useUtils();

  const handleVote = async (
    vote: VoteType,
    cuurentVote: VoteType | undefined,
  ) => {
    if (!isSignedIn) {
      return;
    }
    if (vote === cuurentVote) {
      await removeVote({ contentId: commentId }).then(async () => {
        // Invalidate the post and vote queries to refetch the data
        // TODO: refactor
        await apiUtils.comment.list.invalidate();
        await apiUtils.vote.list.invalidate();
      });
      return;
    } else {
      await updateVote({ contentId: commentId, value: vote }).then(async () => {
        await apiUtils.comment.list.invalidate();
        await apiUtils.vote.list.invalidate();
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => handleVote(VoteType.UP, currentVote)}>
        <ChevronUpSmall
          className={clsx(
            currentVote === VoteType.UP
              ? "stroke-indigo-600"
              : "stroke-gray-700",
          )}
        />
      </button>
      <span className="text-sm font-medium text-gray-800">{totalVotes}</span>
      <button onClick={() => handleVote(VoteType.DOWN, currentVote)}>
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

// TODO: explain in comment
const CommentHeader = ({
  createdAt,
  userFullName,
}: {
  createdAt: Date;
  userFullName: string;
}) => {
  const { user } = useUser();
  return (
    <>
      {user && (
        <div className="flex items-center gap-x-2">
          <div>
            <Image
              src={user?.imageUrl}
              alt="Profile image"
              className="rounded-full"
              width={24}
              height={24}
            />
          </div>
          <span className="text-sm font-light text-gray-600">
            {userFullName} {timeAgo.format(createdAt)}
          </span>
        </div>
      )}
    </>
  );
};

const ReplyButton = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const textColor = isOpen ? "text-indigo-600" : "text-gray-700";
  const strokeColor = isOpen ? "stroke-indigo-600" : "stroke-gray-700";
  return (
    <button
      className="inline-flex items-center gap-x-2"
      onClick={() => setIsOpen(!isOpen)}
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
      <CommentHeader createdAt={createdAt} userFullName={userFullName} />
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
