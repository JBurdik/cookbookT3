import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const tagsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tags.findMany();
  }),
  new: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const tag = await ctx.prisma.tags.create({
      data: {
        name: input,
      },
    });
    return tag;
  }),
  delete: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const tag = await ctx.prisma.tags.delete({
      where: {
        name: input,
      },
    });
    return tag;
  }),
});
