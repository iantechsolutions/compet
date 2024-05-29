import { z } from "zod";
import { db } from "~/server/db";
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { fotos } from "~/server/db/schema";

export const fotosRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ Link: z.string().min(1), Instalacion: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(fotos).values({
        Link: input.Link,
        Instalacion: input.Instalacion,
      });
    }),

  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.fotos.findMany();
  }),

  get: publicProcedure
    .input(
      z.object({
        Id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const channel = await db.query.fotos.findFirst({
        where: eq(fotos.Id, input.Id),
      });

      return channel;
    }),

  update: publicProcedure
    .input(
      z.object({
        Id: z.number(),
        Link: z.string().min(1),
        Instalacion: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(fotos)
        .set({
          Link: input.Link,
          Instalacion: input.Instalacion,
        })
        .where(eq(fotos.Id, input.Id));
    }),

  delete: publicProcedure
    .input(
      z.object({
        Id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await db.delete(fotos).where(eq(fotos.Id, input.Id));
    }),
});
