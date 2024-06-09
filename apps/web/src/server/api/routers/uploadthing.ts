import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { utapi } from "~/server/uploadthing";

export const uploadthingrouter = createTRPCRouter({
  upload: publicProcedure
    .input(
      z.object({
        fileName: z.string(),
        imagedata: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const file = await urltoFile(input.imagedata,"file.png","image/png")
      const uploaded = await utapi.uploadFiles(
        file
      );
      return uploaded

    }),
});



function urltoFile(url: string, filename: string, mimeType: any){
  if (url.startsWith('data:')) {
      var arr = url.split(','),
          match = arr[0]?.match(/:(.*?);/) ?? "",
          mime = match[1] ,
          bstr = atob(arr[arr.length - 1] ?? ""), 
          n = bstr.length, 
          u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      var file = new File([u8arr], filename, {type:mime || mimeType});
      return Promise.resolve(file);
  }
  return fetch(url)
      .then(res => res.arrayBuffer())
      .then(buf => new File([buf], filename,{type:mimeType}));
}

