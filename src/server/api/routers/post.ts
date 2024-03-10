import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import {
  authenticatedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getUserFullname } from "~/lib/utils";

const createPostId = () => `post_${uuidv4()}`;

export const postRouter = createTRPCRouter({
  create: authenticatedProcedure
    .input(
      z.object({
        title: z.string().max(255).min(1),
        content: z.string().max(10000).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.post.create({
          data: {
            id: createPostId(),
            title: input.title,
            content: input.content,
            userId: ctx.auth.userId,
            userFullName: getUserFullname(ctx.user),
            userImageUrl: ctx.user.imageUrl,
          },
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          message: "An error occurred while creating a post",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  list: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        postId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.post.findMany({
          where: {
            userId: input.userId,
            id: input.postId,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          message: "An error occurred while fetching posts",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
