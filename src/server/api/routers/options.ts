import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const optionsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const options = await ctx.prisma.options.findFirst();
    return options;
  }),
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        meta: z.string() || z.null(),
        name: z.string(),
        underConstruction: z.boolean(),
        showNews: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedOptions = await ctx.prisma.options.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          meta: input.meta,
          name: input.name,
          underConstruction: input.underConstruction,
          showNews: input.showNews,
        },
      });
      return { updatedOptions };
    }),
});
