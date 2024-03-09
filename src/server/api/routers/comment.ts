import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import {
  authenticatedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getUserFullname } from "~/lib/utils";

const createCommentId = () => `comm_${uuidv4()}`;

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
            parentId: input.parentId,
            userFullName: getUserFullname(ctx.user),
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
            parentId: input.parentId,
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
