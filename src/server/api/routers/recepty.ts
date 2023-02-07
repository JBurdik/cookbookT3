import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const recipesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const recepty = ctx.prisma.recepty.findMany();
    return recepty;
  }),
  newRecipe: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        ingredients: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newRecipe = await ctx.prisma.recepty.create({
        data: {
          title: input.title,
          content: input.content,
          ingredients: input.ingredients,
        },
      });
      return { newRecipe };
    }),
  admin: adminProcedure.query(() => {
    return "hello administrator";
  }),
  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const deletedRecipe = await ctx.prisma.recepty.delete({
      where: {
        id: input,
      },
    });
    return { deletedRecipe };
  }),
});
