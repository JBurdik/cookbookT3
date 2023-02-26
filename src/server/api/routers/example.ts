import { z } from "zod";

import { DeleteObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import { env } from "../../../env/server.mjs";
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
  newTiptap: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const tiptap = await ctx.prisma.tiptap.create({
        data: {
          // ingredients: "",
          // title: "Default",
          // imgUrl: "https://picsum.photos/200/300",
          content: input,
        },
      });
      return { tiptap };
    }),
  getS3List: publicProcedure.query(async ({ ctx }) => {
    const list = await ctx.s3Client.send(
      new ListObjectsCommand({ Bucket: env.S3_UPLOAD_BUCKET })
    );
    return list;
  }),
  deleteFromS3: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const deleted = await ctx.s3Client.send(
        new DeleteObjectCommand({
          Bucket: env.S3_UPLOAD_BUCKET,
          Key: input,
        })
      );
      return deleted;
    }),
});
