import { z } from "zod";

import {
  DeleteObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { uuid } from "next-s3-upload";
import { env } from "../../../env/server.mjs";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

export const s3Router = createTRPCRouter({
  getList: publicProcedure.query(async ({ ctx }) => {
    const list = await ctx.s3Client.send(
      new ListObjectsCommand({ Bucket: env.S3_UPLOAD_BUCKET })
    );
    return list;
  }),
  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const deleted = await ctx.s3Client.send(
      new DeleteObjectCommand({
        Bucket: env.S3_UPLOAD_BUCKET,
        Key: input,
      })
    );
    return deleted;
  }),
  createPresignedUrl: protectedProcedure
    .input(z.optional(z.string()))
    .query(async ({ ctx, input }) => {
      const key = input ? `${input}/` : `${uuid()}`;
      const url = await getSignedUrl(
        ctx.s3Client,
        new PutObjectCommand({
          Bucket: env.S3_UPLOAD_BUCKET,
          Key: key,
        })
      );
      return { url, key };
    }),
});
