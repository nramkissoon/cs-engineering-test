"use server";

import { api } from "~/trpc/server";
import { revalidatePath } from "next/cache";
import { VoteType } from "@prisma/client";

export async function createPost(title: string, content: string) {
  await api.post.create.mutate({ title, content });
  revalidatePath("/");
}

export async function vote(contentId: string, value: VoteType) {
  await api.vote.vote.mutate({ contentId, value });
  revalidatePath("/");
}

export async function removeVote(contentId: string) {
  await api.vote.remove.mutate({ contentId });
  revalidatePath("/");
}

export async function handleVote(
  contentId: string,
  voteValue: VoteType,
  cuurentVote: VoteType | undefined,
) {
  if (voteValue === cuurentVote) {
    await removeVote(contentId);
  } else {
    await vote(contentId, voteValue);
  }
}

export async function createComment(
  content: string,
  parentId: string,
  rootPostId: string,
) {
  await api.comment.create.mutate({ content, parentId, rootPostId });
  revalidatePath(`/app/(dashboard)/posts/${rootPostId}`, "page");
}
