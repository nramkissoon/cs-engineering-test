# CS Engineering Test Task

It's live at [https://cs-engineering-test-opal.vercel.app/](https://cs-engineering-test-opal.vercel.app/) !

## Running the project

Install dependencies:

```
pnpm install
```

### Environment variables

Create a `.env` file with the following:

```
DATABASE_URL=

NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Builds will fail without properly setting environment variables.

To build:

```
pnpm build
```

To run:

```
pnpm start
```

## Repository overview

Here is a couple of points of interest in the repo.

1. [Database Schema](https://github.com/nramkissoon/cs-engineering-test/blob/main/prisma/schema.prisma)
2. [tRPC Routers](https://github.com/nramkissoon/cs-engineering-test/tree/main/src/server/api/routers)
3. [Custom Signin page](<https://github.com/nramkissoon/cs-engineering-test/blob/main/src/app/(auth)/sign-up/%5B%5B...sign-up%5D%5D/page.tsx>)
4. [Main App Pages](<https://github.com/nramkissoon/cs-engineering-test/tree/main/src/app/(dashboard)>)

## Design decisions

I opted for creating a separate `Vote` table that is shared between both `Comment` and `Post`. This allowed easier updates and CRUD operations related to voting with the caveat that I had to use database transactions to keep `voteTotal` and `Vote` consistent across tables. [see](https://github.com/nramkissoon/cs-engineering-test/blob/main/src/server/api/routers/vote.ts#L94)

I added a `rootPostId` field to the `Comment` table in order to easily query for all comments under a specific post. After fetching all the comments on the server, I recursively create an array of nested comments and use that to build the UI. Obviously this solution falls apart at scale and some form of pagination would be needed.

[see server-side nesting](https://github.com/nramkissoon/cs-engineering-test/blob/main/src/server/api/routers/comment.ts#L60)

[see UI rendering](<https://github.com/nramkissoon/cs-engineering-test/blob/main/src/app/(dashboard)/posts/%5BpostId%5D/page.tsx#L42>)

## Further improvements to consider

Couple of things I wanted to get to but chose not to in the interest of time and scope of the task.

1. Creating a User table and syncing with Clerk via webhooks in order to store data such as profile image and name.
2. I did not fully take advantage of some of Next.js App router features such as Server Actions mainly because Page-router style conventions and client components are much more familiar to me.
3. I did not spend much time playing with Tailwind config to create reusable utility classes based on the Figma mockups, but I did try to get the UI to as close to 1:1 as possible.
4. Other things like surfacing errors to users and loading UI would be good to add.
