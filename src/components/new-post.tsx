"use client";

import { Button } from "./cs-button";
import { Separator } from "./ui/separator";
import { useUser } from "@clerk/clerk-react";
import { Input } from "./cs-input";
import { api } from "~/trpc/react";
import { useState } from "react";
import Image from "next/image";

export const NewPost = () => {
  const { user, isSignedIn } = useUser();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { mutateAsync } = api.post.create.useMutation();
  const apiUtils = api.useUtils();

  const handleSubmit = async () => {
    await mutateAsync({ title, content });
    await apiUtils.post.list.invalidate();
    setContent("");
    setTitle("");
  };

  return (
    isSignedIn && (
      <div className="flex w-full gap-x-4 rounded-xl border border-gray-200 px-4 pb-3 pt-4 shadow-md shadow-black/5">
        <div>
          {user && (
            <Image
              src={user?.imageUrl}
              alt="Profile image"
              className="rounded-full"
              width={24}
              height={24}
            />
          )}
        </div>
        <div className="flex w-full flex-col items-start gap-y-3">
          <Input
            inputProps={{
              placeholder: "Title of your post",
              value: title,
              onChange: (e) => setTitle(e.target.value),
              className:
                "w-full border-none h-6 pl-0 placeholder:font-light placeholder:text-base py-0",
            }}
          />
          <Input
            inputProps={{
              placeholder: "Share your thoughts with the world!",
              value: content,
              onChange: (e) => setContent(e.target.value),
              className:
                "w-full border-none h-6 pl-0 placeholder:font-light placeholder:text-base py-0",
            }}
          />
          <Separator orientation="horizontal" />
          <Button size={"sm"} className="self-end" onClick={handleSubmit}>
            Post
          </Button>
        </div>
      </div>
    )
  );
};
