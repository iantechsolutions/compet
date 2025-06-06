import { z } from "zod";
import { db } from "~/server/db";
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { fotos } from "~/server/db/schema";

export const fotosRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({ 
      link: z.string().min(1),
       instalacionId: z.string(),
        lat: z.number().optional(),
         long: z.number().optional(),
          pasoCriticoId: z.number().optional() 
        })).mutation(async ({ ctx, input }) => {
        // simulate a slow db call
        // await new Promise((resolve) => setTimeout(resolve, 1000))

        await ctx.db.insert(fotos).values({
          link: input.link,
          instalacionId: input.instalacionId,
          lat: input.lat,
          long: input.long,
          pasoCriticoId: input.pasoCriticoId ?? 0
        })
    }),

  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.fotos.findMany();
  }),

  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.fotos.findFirst({
        where: eq(fotos.id, input.id),
      });

      return channel;
    }),

    update: publicProcedure.input(z.object({id:z.string(),
       link: z.string().min(1), 
       instalacionId: z.string(), 
       lat: z.number().optional(), 
       long: z.number().optional(),
        pasoCriticoId: z.number().optional()
      })).mutation(async ({ ctx, input }) => {
      await db
        .update(fotos)
        .set({
          link: input.link,
          instalacionId: input.instalacionId,
          lat: input.lat,
          long: input.long,
          pasoCriticoId: input.pasoCriticoId ?? 0
        })
        .where(eq(fotos.id, input.id));
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.delete(fotos).where(eq(fotos.id, input.id));
    }),
});
