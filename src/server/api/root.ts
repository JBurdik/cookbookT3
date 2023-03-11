import { exampleRouter } from "./routers/example";
import { newsRouter } from "./routers/news";
import { optionsRouter } from "./routers/options";
import { recipesRouter } from "./routers/recepty";
import { s3Router } from "./routers/s3";
import { tagsRouter } from "./routers/tags";
import { usersRouter } from "./routers/users";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  news: newsRouter,
  recipes: recipesRouter,
  options: optionsRouter,
  users: usersRouter,
  s3: s3Router,
  tags: tagsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
