import { currentUser } from "@clerk/nextjs/server";
import { NewPost } from "~/components/new-post";
import { PostFeed } from "~/components/post-feed";

export default async function Home() {
  const user = await currentUser();
  return (
    <div className="flex flex-col gap-10">
      {user && <NewPost userImgUrl={user.imageUrl} />}
      <PostFeed />
    </div>
  );
}
