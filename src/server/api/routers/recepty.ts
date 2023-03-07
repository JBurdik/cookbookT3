import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

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
    return recept;
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
  newRecipe: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        ingredients: z.string(),
        time: z.number(),
        difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXTRAHARD"]),
        portions: z.number(),
        tags: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newRecipe = await ctx.prisma.recepty.create({
        data: {
          title: input.title,
          content: input.content,
          ingredients: input.ingredients,
          time: input.time,
          difficulty: input.difficulty,
          portions: input.portions,
          authorId: ctx.session.user.id,
          tags: { create: input.tags },
          imgUrl: "https://via.placeholder.com/300.webp",
        },
      });
      return { newRecipe };
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        ingredients: z.string(),
        authorId: z.string(),
        time: z.number(),
        difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXTRAHARD"]),
        portions: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (
        ctx.session.user.role != "ADMIN" &&
        ctx.session.user.id !== input.authorId
      ) {
        throw new Error("Nemáte oprávnění k úpravě receptu");
      }
      const editedRecipe = await ctx.prisma.recepty.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          content: input.content,
          ingredients: input.ingredients,
          time: input.time,
          difficulty: input.difficulty,
          portions: input.portions,
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
