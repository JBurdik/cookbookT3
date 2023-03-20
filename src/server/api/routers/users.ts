import { z } from "zod";

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
});
