import { createUploadthing, type FileRouter } from "uploadthing/next";
import { Schema, z } from "zod";
import { createId } from "~/lib/utils";
import { db } from "~/server/db";
import * as schema from "~/server/db/schema";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";
// import { uploadRouter } from "../routers/uploadthing";

const f = createUploadthing();

// const auth = async (_: Request) => {
//   const session = await getServerAuthSession();
//   return session?.user;
// };

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  responseUpload: f({
    "text/plain": {
      maxFileCount: 1,
      maxFileSize: "1MB",
    },
  })
    .input(z.object({ channel: z.string() }))
    .middleware(async ({ req, input }) => {
    //   // This code runs on your server before upload
    //   const user = await auth(req);

    //   // If you throw, the user will not be able to upload
    //   if (!user) throw new Error("Unauthorized");

    //   // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {channelName: input.channel };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
    //   console.log("Upload complete for userId:", metadata.userId);

      const uploadId = createId();

      await db.insert(schema.responseDocumentUploads).values({
        Id: uploadId,
        userId: "",
        fileUrl: file.url,
        fileName: file.name,
        fileSize: file.size,
      });

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadId };
    }),

  imageuploader: f({
    "image": {
      maxFileCount: 1,
      maxFileSize: "128MB",
    },
  })
    .input(
      z.object({
        instalacionId: z.string(),
      }),
    )
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, input }) => {
    //   // This code runs on your server before upload
    //   const user = await auth(req);

    //   // If you throw, the user will not be able to upload
    //   if (!user) throw new Error("Unauthorized");

    //   // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { instalacionId: input.instalacionId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
    //   console.log("Upload complete for userId:", metadata.userId);

      const uploadId = createId();


      await db.insert(schema.documentUploads).values({
        id:uploadId,
        userId: "", 
        fileUrl: file.url, 
        fileName: file.name, 
        fileSize: file.size, 
        instalationId: metadata.instalacionId, 
    });


      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
