import Zod, { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import {
  createTRPCRouter,
  authenticatedProcedure,
  publicProcedure,
} from "../trpc";
import { VoteType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { buildId } from "~/lib/utils";

const getContentType = (contentId: string) => {
  if (contentId.startsWith("post_")) {
    return "post";
  }
  if (contentId.startsWith("comm_")) {
    return "comment";
  }
  throw new TRPCError({
    message: "Invalid contentId",
    code: "BAD_REQUEST",
  });
};

/**
 * @param value - determine increment/decrement
 * @param newVote - if the vote is new, or if the user is changing their vote
 * @returns
 */
const getVoteIncrementValue = (value: VoteType, newVote: boolean) => {
  if (newVote) {
    return value === VoteType.UP ? 1 : -1;
  }
  return value === VoteType.UP ? 2 : -2;
};

export const voteRouter = createTRPCRouter({
  remove: authenticatedProcedure
    .input(
      z.object({
        contentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.auth;
      const { contentId } = input;
      const contentType = getContentType(contentId);

      // Check if the user has already voted
      const existingVote = await ctx.db.vote.findFirst({
        where: {
          userId,
          contentId,
        },
      });

      if (existingVote) {
        const voteTotalUpateArgs = {
          where: {
            id: contentId,
          },
          data: {
            totalVotes: {
              decrement: getVoteIncrementValue(existingVote.value, true),
            },
          },
        };
        const voteDeleteArgs = {
          where: {
            contentId_userId: {
              contentId,
              userId,
            },
          },
        };

        if (contentType === "post") {
          return await ctx.db.$transaction([
            ctx.db.vote.delete(voteDeleteArgs),
            ctx.db.post.update(voteTotalUpateArgs),
          ]);
        } else {
          return await ctx.db.$transaction([
            ctx.db.vote.delete(voteDeleteArgs),
            ctx.db.comment.update(voteTotalUpateArgs),
          ]);
        }
      }

      // If the user hasn't voted, we throw an error
      throw new TRPCError({
        message: "Content not found",
        code: "NOT_FOUND",
      });
    }),
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
              contentId_userId: {
                contentId,
                userId,
              },
            },
            update: {
              value,
            },
            create: {
              id: buildId("vote"),
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
              increment: getVoteIncrementValue(value, existingVote === null),
            },
          },
        };
        if (contentType === "post") {
          return await ctx.db.$transaction([
            buildUpsert(),
            ctx.db.post.update(voteTotalUpateArgs),
          ]);
        } else {
          return await ctx.db.$transaction([
            buildUpsert(),
            ctx.db.comment.update(voteTotalUpateArgs),
          ]);
        }
      }

      throw new TRPCError({
        message: "An error occurred while voting",
        code: "INTERNAL_SERVER_ERROR",
      });
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
          message: "An error occurred while fetching votes",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
