"use client";

import { Post } from "~/components/post";
import Link from "next/link";
import { NewComment } from "~/components/new-comment";
import { ArrowLeft } from "~/components/cs-icons";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";
import { useUser } from "@clerk/clerk-react";
import { Comment } from "~/components/comment";
import type { Comment as CommentType, VoteType } from "@prisma/client";

const BackToPostsLink = () => {
  return (
    <Link href="/" className="flex gap-x-4">
      <ArrowLeft />
      <span className="text-sm font-medium text-gray-800">Back to posts</span>
    </Link>
  );
};

const Comments = ({ postId }: { postId: string }) => {
  const { user, isSignedIn } = useUser();
  const { data } = api.comment.list.useQuery({ rootId: postId });
  const { data: votes } = api.vote.list.useQuery(
    {
      contentIds: data?.commentIds ?? [],
      userId: user?.id ?? "",
    },
    {
      enabled: isSignedIn && data !== undefined,
    },
  );

  // build a map of contentId -> vote value
  const votesMap = new Map<string, VoteType>();
  votes?.forEach((vote) => {
    votesMap.set(vote.contentId, vote.value);
  });

  const CommentList = [];
  // traverse the comments and add a comment component to the list, keep track of nesting level
  type Nested = CommentType & { children: Nested[] };
  const traverse = (
    comment: CommentType & { children: Nested[] },
    level: number,
  ) => {
    CommentList.push(
      <Comment
        key={comment.id}
        id={comment.id}
        userFullName={comment.userFullName}
        content={comment.content}
        createdAt={comment.createdAt}
        parentId={comment.parentId}
        totalVotes={comment.totalVotes}
        userId={comment.userId}
        currentVote={votesMap.get(comment.id)}
        rootPostId={comment.rootPostId}
        userImageUrl={comment.userImageUrl}
        indentLevel={level}
      />,
    );
    comment.children.forEach((child) => {
      traverse(child, level + 1);
    });
  };

  // handle the top level comments, adding a separator between them
  for (let i = 0; data && i < data.commentTree.length; i++) {
    const commentData = data.commentTree[i];
    commentData && traverse(commentData, 0);
    if (i != data.commentTree.length - 1) {
      CommentList.push(
        <Separator
          key={i}
          className="bg-border bg-gray-200"
          orientation="horizontal"
        />,
      );
    }
  }

  return <>{CommentList}</>;
};

export default function PostPage({ params }: { params: { postId: string } }) {
  const { user, isSignedIn } = useUser();
  const { data: posts } = api.post.list.useQuery({
    postId: params.postId,
  });
  const { data: votes } = api.vote.list.useQuery(
    {
      contentIds: [params.postId],
      userId: user?.id ?? "",
    },
    { enabled: isSignedIn },
  );
  const currentVote = votes?.[0]?.value ?? undefined;
  const post = posts?.[0];
  return (
    <div className="flex flex-col gap-6">
      <BackToPostsLink />
      {post && <Post {...post} currentVote={currentVote} />}
      <NewComment parentId={params.postId} rootPostId={params.postId} />
      <Separator
        orientation="horizontal"
        className="border-gray-200 bg-border"
      />

      <span className="text-sm font-medium text-gray-800">All comments</span>
      <Comments postId={params.postId} />
    </div>
  );
}
