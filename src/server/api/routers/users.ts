import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "../trpc";

export const usersRouter = createTRPCRouter({
  getAll: adminProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
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
