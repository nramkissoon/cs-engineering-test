import Zod, { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import {
  createTRPCRouter,
  authenticatedProcedure,
  publicProcedure,
} from "../trpc";
import { VoteType } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const createCommentId = () => `vote_${uuidv4()}`;

const getContentType = (contentId: string) => {
  if (contentId.startsWith("post_")) {
    return "post";
  }
  if (contentId.startsWith("comment_")) {
    return "comment";
  }
  throw new TRPCError({
    message: "Invalid contentId",
    code: "BAD_REQUEST",
  });
};

export const voteRouter = createTRPCRouter({
  vote: authenticatedProcedure
    .input(
      z.object({
        value: Zod.enum([VoteType.UP, VoteType.DOWN]),
        contentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.auth;
      const { value, contentId } = input;
      const contentType = getContentType(contentId);

      // First get the object we're voting on
      let content;
      if (contentType === "post") {
        content = await ctx.db.post.findUnique({
          where: {
            id: contentId,
          },
        });
      } else if (contentType === "comment") {
        content = await ctx.db.comment.findUnique({
          where: {
            id: contentId,
          },
        });
      }

      if (!content) {
        throw new TRPCError({
          message: "Content not found",
          code: "NOT_FOUND",
        });
      }

      // Check if the user has already voted
      const existingVote = await ctx.db.vote.findFirst({
        where: {
          userId,
          contentId,
        },
      });

      /**
       * If the user has already voted, we need to check if they're changing their vote.
       * If they are, we need to update the total votes and the user's vote. We also handle the case where the user is creating a new vote by using an upsert operation.
       */
      if (!existingVote || existingVote.value !== value) {
        // ensure we use a transaction to update total votes and the user's vote to ensure consistency
        const buildUpsert = () =>
          ctx.db.vote.upsert({
            where: {
              id: existingVote?.id,
              userId,
              contentId,
            },
            update: {
              value,
            },
            create: {
              id: createCommentId(),
              value,
              userId,
              contentId,
            },
          });

        const voteTotalUpateArgs = {
          where: {
            id: contentId,
          },
          data: {
            totalVotes: {
              [value === VoteType.UP ? "increment" : "decrement"]: 1,
            },
          },
        };
        if (contentType === "post") {
          await ctx.db.$transaction([
            buildUpsert(),
            ctx.db.post.update(voteTotalUpateArgs),
          ]);
        } else {
          await ctx.db.$transaction([
            buildUpsert(),
            ctx.db.comment.update(voteTotalUpateArgs),
          ]);
        }
      }

      try {
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          message: "An error occurred while voting",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  list: publicProcedure
    .input(
      z.object({
        contentIds: z.array(z.string()),
        userId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      try {
        return ctx.db.vote.findMany({
          where: {
            contentId: {
              in: input.contentIds,
            },
            userId: input.userId,
          },
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          message: "An error occurred while voting",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
