import { z } from "zod";

import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  getAll: adminProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
  setName: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input,
        },
      });
      return { user };
    }),
  setRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        newRole: z.enum(["ADMIN", "USER"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newRole = await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          role: input.newRole,
        },
      });
      return { newRole };
    }),
  getFavRecipes: protectedProcedure
    .input(z.string().optional())
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;
      const favRecipes = await ctx.prisma.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          favorites: {
            select: {
              recept: true,
            },
          },
        },
      });

      if (!favRecipes || favRecipes.favorites.length === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No favorite recipes found",
        });

      return favRecipes;
    }),
  isRecipeFav: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const isFav = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          favorites: {
            where: {
              receptId: input,
            },
          },
        },
      });
      if (!isFav)
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      return isFav.favorites.length === 1 ? true : false;
    }),
});
