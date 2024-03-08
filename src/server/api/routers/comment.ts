import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import {
  authenticatedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

const createCommentId = () => `comm_${uuidv4()}`;

// determines if the parent of the comment is a post or a comment by looking at ID
const getParentIdType = (id: string) => {
  if (id.startsWith("post_")) {
    return "post";
  }
  if (id.startsWith("comm_")) {
    return "comment";
  }

  throw new TRPCError({
    message: "Invalid parent ID",
    code: "BAD_REQUEST",
  });
};

// Utility for building Primsa queries, fills the parent ID based on the type of parent
const fillParentId = (parentId: string) => {
  const parentIdType = getParentIdType(parentId);
  if (parentIdType === "post") {
    return { postId: parentId };
  }
  if (parentIdType === "comment") {
    return { parentCommentId: parentId };
  }
};

export const commentRouter = createTRPCRouter({
  create: authenticatedProcedure
    .input(
      z.object({
        content: z.string().max(10000).min(1),
        parentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.comment.create({
          data: {
            id: createCommentId(),
            content: input.content,
            userId: ctx.auth.userId,
            ...fillParentId(input.parentId),
          },
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          message: "An error occurred while creating a comment",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  list: publicProcedure
    .input(
      z.object({
        parentId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      try {
        return ctx.db.comment.findMany({
          where: {
            ...fillParentId(input.parentId),
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          message: "An error occurred while fetching comments",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
