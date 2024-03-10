import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import {
  authenticatedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getUserFullname } from "~/lib/utils";
import { Comment } from "@prisma/client";

const createCommentId = () => `comm_${uuidv4()}`;

export const commentRouter = createTRPCRouter({
  create: authenticatedProcedure
    .input(
      z.object({
        content: z.string().max(10000).min(1),
        parentId: z.string(),
        rootPostId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.comment.create({
          data: {
            id: createCommentId(),
            content: input.content,
            userId: ctx.auth.userId,
            userImageUrl: ctx.user.imageUrl,
            parentId: input.parentId,
            userFullName: getUserFullname(ctx.user),
            rootPostId: input.rootPostId,
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
        rootId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const comments = await ctx.db.comment.findMany({
          where: {
            rootPostId: input.rootId,
          },
        });

        type Nested = Comment & { children: Nested[] };
        // walk through the comments and create a nested structure
        const createNested = (parentId: string): Nested[] => {
          const children = comments.filter(
            (comment) => comment.parentId === parentId,
          );
          return children.map((child) => ({
            ...child,
            children: createNested(child.id),
          }));
        };

        const nestedComments = createNested(input.rootId);

        // traverse the nested structure and sort children by createdAt
        const sortNested = (nested: Nested): Nested => {
          nested.children.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          );
          nested.children = nested.children.map(sortNested);
          return nested;
        };

        // traverse the top level comments and sort children by createdAt
        const sortedNestedComments = nestedComments.map(sortNested);

        return {
          commentTree: sortedNestedComments,
          commentIds: comments.map((comment) => comment.id),
        };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          message: "An error occurred while fetching comments",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
