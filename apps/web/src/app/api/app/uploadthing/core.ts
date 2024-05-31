import { createUploadthing, type FileRouter } from "uploadthing/server";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  }).onUploadComplete((data) => {
    console.log("upload completed", data);
  }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;