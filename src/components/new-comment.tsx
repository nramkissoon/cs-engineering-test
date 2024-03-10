"use client";

import { Button } from "./cs-button";
import { Separator } from "./ui/separator";
import { useUser } from "@clerk/clerk-react";
import { Input } from "./cs-input";
import { api } from "~/trpc/react";
import { useState } from "react";
import Image from "next/image";

const UserImage = () => {
  const { user } = useUser();

  return (
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
  );
};

const CommentInput = ({
  comment,
  setComment,
}: {
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <Input
      inputProps={{
        placeholder: "Comment your thoughts",
        value: comment,
        onChange: (e) => setComment(e.target.value),
        className:
          "w-full border-none h-6 pl-0 placeholder:font-light placeholder:text-base py-0",
      }}
    />
  );
};

export const NewComment = ({
  parentId,
  rootPostId,
  close,
}: {
  parentId: string;
  rootPostId: string;
  close?: () => void;
}) => {
  const { isSignedIn } = useUser();
  const [comment, setComment] = useState("");
  const { mutateAsync } = api.comment.create.useMutation();
  const apiUtils = api.useUtils();

  const handleSubmit = async () => {
    await mutateAsync({ content: comment, parentId, rootPostId });
    await apiUtils.comment.list.invalidate();
    setComment("");
    close?.();
  };

  return (
    isSignedIn && (
      <div className="flex w-full gap-x-4 rounded-xl border border-gray-200 px-4 pb-3 pt-4 shadow-md shadow-black/5">
        <UserImage />
        <div className="flex w-full flex-col items-start gap-y-3">
          <CommentInput comment={comment} setComment={setComment} />
          <Separator
            orientation="horizontal"
            className="border-gray-200 bg-border"
          />
          <Button className="self-end" size={"sm"} onClick={handleSubmit}>
            Comment
          </Button>
        </div>
      </div>
    )
  );
};
