"use client";

import { useAuth } from "@clerk/clerk-react";
import { VoteType } from "@prisma/client";
import clsx from "clsx";
import { handleVote } from "~/server/actions";
import {
  ChevronUp,
  ChevronDown,
  ChevronUpSmall,
  ChevronDownSmall,
} from "./cs-icons";

export const VoteButtonContainer = ({
  contentId,
  currentVote,
  totalVotes,
  variant,
}: {
  contentId: string;
  currentVote: VoteType | undefined;
  totalVotes: number;
  variant: "comment" | "post";
}) => {
  const { isSignedIn } = useAuth();
  const UpIcon = variant === "comment" ? ChevronUpSmall : ChevronUp;
  const DownIcon = variant === "comment" ? ChevronDownSmall : ChevronDown;

  return (
    <div
      className={clsx(
        "flex items-center",
        variant === "post" ? "flex-col gap-y-[10px]" : "gap-2",
      )}
    >
      <button
        onClick={() => handleVote(contentId, VoteType.UP, currentVote)}
        disabled={!isSignedIn}
      >
        <UpIcon
          className={clsx(
            currentVote === VoteType.UP
              ? "stroke-indigo-600"
              : "stroke-gray-700",
          )}
        />
      </button>
      <span
        className={clsx(
          "font-medium text-gray-800",
          variant === "comment" && "text-sm",
        )}
      >
        {totalVotes}
      </span>
      <button
        onClick={() => handleVote(contentId, VoteType.DOWN, currentVote)}
        disabled={!isSignedIn}
      >
        <DownIcon
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
