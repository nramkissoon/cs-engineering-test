import { Post } from "~/components/post";
import Link from "next/link";
import { NewComment } from "~/components/new-comment";
import { ArrowLeft } from "~/components/cs-icons";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/server";
import { Comment } from "~/components/comment";
import type { Comment as CommentType, VoteType } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const BackToPostsLink = () => {
  return (
    <Link href="/" className="flex gap-x-4">
      <ArrowLeft />
      <span className="text-sm font-medium text-gray-800">Back to posts</span>
    </Link>
  );
};

const Comments = async ({ postId }: { postId: string }) => {
  const comments = await api.comment.list.query({ rootId: postId });
  const votes = await api.vote.list.query({
    contentIds: comments.commentIds,
  });

  // build a map of contentId -> vote value
  const votesMap = new Map<string, VoteType>();
  votes.forEach((vote) => {
    votesMap.set(vote.contentId, vote.value);
  });

  const CommentList = [];
  // traverse the comments and add a comment component to the list, keep track of nesting level
  type Nested = CommentType & { children: Nested[] };
  const traverse = (
    comment: CommentType & { children: Nested[] },
    level: number,
  ) => {
    const stack: { comment: Nested; level: number }[] = [];
    stack.push({ comment, level });
    while (stack.length > 0) {
      const current = stack.pop();
      if (current) {
        const { comment, level } = current;
        CommentList.push(
          <Comment
            key={comment.id}
            {...comment}
            currentVote={votesMap.get(comment.id)}
            indentLevel={level}
          />,
        );
        comment.children.forEach((child) => {
          stack.push({ comment: child, level: level + 1 });
        });
      }
    }
  };

  // handle the top level comments, adding a separator between them
  if (comments) {
    for (let i = comments.commentTree.length - 1; i >= 0; i--) {
      const commentData = comments.commentTree[i];
      commentData && traverse(commentData, 0);
      if (i != 0) {
        CommentList.push(<Separator key={i} orientation="horizontal" />);
      }
    }
  }

  return <>{CommentList}</>;
};

export default async function PostPage({
  params,
}: {
  params: { postId: string };
}) {
  const user = await currentUser();
  const posts = await api.post.list.query({
    postId: params.postId,
  });
  const votes = await api.vote.list.query({
    contentIds: [params.postId],
  });

  const currentVote = votes[0]?.value ?? undefined;
  const post = posts[0];
  return (
    <div className="flex flex-col gap-6">
      <BackToPostsLink />
      {post && <Post {...post} currentVote={currentVote} />}
      {user && (
        <NewComment parentId={params.postId} rootPostId={params.postId} />
      )}
      <Separator orientation="horizontal" />

      <span className="text-sm font-medium text-gray-800">All comments</span>
      <Comments postId={params.postId} />
    </div>
  );
}
