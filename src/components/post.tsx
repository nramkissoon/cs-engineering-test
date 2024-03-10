"use client";

import type { Post as PostType } from "@prisma/client";
import { VoteType } from "@prisma/client";
import { ChevronDown, ChevronUp } from "./cs-icons";
import { api } from "~/trpc/react";
import { useAuth, useUser } from "@clerk/clerk-react";
import Image from "next/image";
import { timeAgo } from "~/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { Separator } from "./ui/separator";

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
      await removeVote({ contentId: postId }).then(async () => {
        // Invalidate the post and vote queries to refetch the data
        await apiUtils.post.list.invalidate();
        await apiUtils.vote.list.invalidate();
      });
      return;
    } else {
      await updateVote({ contentId: postId, value: vote }).then(async () => {
        await apiUtils.post.list.invalidate();
        await apiUtils.vote.list.invalidate();
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-y-[10px]">
      <button
        onClick={() => handleVote(VoteType.UP, currentVote)}
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
        onClick={() => handleVote(VoteType.DOWN, currentVote)}
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

export const useVoteData = (contentIds: string[]) => {
  const { user, isSignedIn } = useUser();
  const { data } = api.vote.list.useQuery(
    {
      userId: user?.id ?? "",
      contentIds,
    },
    {
      enabled: isSignedIn,
    },
  );

  const voteValues: Record<string, VoteType> = {};

  for (const vote of data ?? []) {
    voteValues[vote.contentId] = vote.value;
  }

  return voteValues;
};

export const PostFeed = ({
  forUser,
  postId,
}: {
  forUser?: boolean;
  postId?: string;
}) => {
  const { user, isLoaded } = useUser();
  const { data } = api.post.list.useQuery(
    {
      userId: forUser ? user?.id : undefined,
      postId,
    },
    {
      enabled: isLoaded || !forUser,
    },
  );
  const voteData = useVoteData(data?.map((post) => post.id) ?? []);

  const Posts = [];
  for (let i = 0; data && i < data.length; i++) {
    const post = data[i];
    post &&
      Posts.push(
        <Post key={post.id} {...post} currentVote={voteData[post.id]} />,
      );

    if (i != data.length - 1) {
      Posts.push(
        <Separator
          className="bg-border bg-gray-200"
          orientation="horizontal"
        />,
      );
    }
  }

  return <div className="flex flex-col gap-y-10">{Posts}</div>;
};
