import { currentUser } from "@clerk/nextjs/server";
import { Post } from "./post";
import { Separator } from "./ui/separator";
import { api } from "~/trpc/server";
import { VoteType } from "@prisma/client";

export const useVoteData = async (contentIds: string[]) => {
  const votes = await api.vote.list.query({
    contentIds,
  });

  const voteValues: Record<string, VoteType> = {};

  for (const vote of votes) {
    voteValues[vote.contentId] = vote.value;
  }

  return voteValues;
};

export const PostFeed = async ({
  forUser,
  postId,
}: {
  forUser?: boolean;
  postId?: string;
}) => {
  const user = await currentUser();
  const posts = await api.post.list.query({
    userId: forUser ? user?.id : undefined,
    postId,
  });
  const voteData = await useVoteData(posts.map((post) => post.id) ?? []);

  const Posts = [];
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    post &&
      Posts.push(
        <Post key={post.id} {...post} currentVote={voteData[post.id]} />,
      );

    if (i != posts.length - 1) {
      Posts.push(<Separator orientation="horizontal" />);
    }
  }

  return <div className="flex flex-col gap-y-10">{Posts}</div>;
};
