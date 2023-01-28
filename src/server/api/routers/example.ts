import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  getUserRole: protectedProcedure.query(async ({ ctx }) => {
    const userRole = ctx.prisma.user
      .findFirst({
        where: { id: ctx.session.user.id },
        select: { role: true },
      })
      .then((data) => {
        return data?.role;
      });
    return {
      role: await userRole,
    };
  }),
});
