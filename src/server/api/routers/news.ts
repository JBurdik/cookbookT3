import { createTRPCRouter, protectedProcedure } from "../trpc";

export const newsRouter = createTRPCRouter({
  getNews: protectedProcedure.query(async ({ ctx }) => {
    const news = ctx.prisma.news.findMany();
    return news;
  }),
});
