import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const recipesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const recepty = await ctx.prisma.recepty.findMany();
    return recepty;
  }),
  getAllTitles: publicProcedure.query(async ({ ctx }) => {
    const recepty = await ctx.prisma.recepty.findMany({
      select: {
        title: true,
        id: true,
      },
    });
    return recepty;
  }),
  getOne: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const recept = await ctx.prisma.recepty.findUnique({
      where: {
        id: input,
      },
    });
    if (recept === null) {
      throw new Error("Recept neexistuje");
    }
    return { recept };
  }),
  uploadPhoto: publicProcedure
    .input(
      z.object({
        id: z.string(),
        imgUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const photo = await ctx.prisma.recepty.update({
        where: {
          id: input.id,
        },
        data: {
          imgUrl: input.imgUrl,
        },
      });
      return { photo };
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
          imgUrl: "https://via.placeholder.com/300.webp",
        },
      });
      return { newRecipe };
    }),
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        ingredients: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const editedRecipe = await ctx.prisma.recepty.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          content: input.content,
          ingredients: input.ingredients,
        },
      });
      return { editedRecipe };
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
