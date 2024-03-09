import { NewPost } from "~/components/new-post";
import { PostFeed } from "~/components/post";

export default async function MyPosts() {
  return (
    <div className="flex flex-col gap-10">
      <NewPost />
      <PostFeed forUser />
    </div>
  );
}
