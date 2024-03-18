import type { Post as PostType } from "@prisma/client";
import { VoteType } from "@prisma/client";
import Image from "next/image";
import { timeAgo } from "~/lib/utils";
import Link from "next/link";
import { VoteButtonContainer } from "./vote-button";

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
        contentId={id}
        currentVote={currentVote}
        totalVotes={totalVotes}
        variant="post"
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
