import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { utapi } from "~/server/uploadthing";

export const uploadthingrouter = createTRPCRouter({
  upload: publicProcedure
    .input(
      z.object({
        instalacionId: z.number(),
        fileName: z.string(),
        imagedata: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const uploaded = await utapi.uploadFiles(
        new File([input.imagedata], input.fileName, { type: "image/png" })
      );
    }),
});
