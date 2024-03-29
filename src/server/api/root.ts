import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { voteRouter } from "./routers/vote";
import { commentRouter } from "./routers/comment";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  vote: voteRouter,
  comment: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
