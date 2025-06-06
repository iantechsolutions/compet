import { z } from "zod";
import { db } from "~/server/db";
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { pasoCritico } from "~/server/db/schema";

export const pasoCriticoRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        detalle: z.string(),
        descripcion: z.string(),
        useCamera: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(pasoCritico).values({
        detalle: input.detalle,
        descripcion: input.descripcion,
        useCamera: input.useCamera,
        
      });
    }),

  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.pasoCritico.findMany();
  }),

  get: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.pasoCritico.findFirst({
        where: eq(pasoCritico.id, input.id)
      });

      return channel;
    }),

    update: publicProcedure.input(z.object({id:z.number(), detalle: z.string(), descripcion: z.string(),
         useCamera: z.boolean() })).mutation(async ({ ctx, input }) => {
      await db
        .update(pasoCritico)
        .set({
          detalle: input.detalle,
          descripcion: input.descripcion,
          useCamera: input.useCamera,
        })
        .where(eq(pasoCritico.id, input.id));
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .delete(pasoCritico)
        .where(eq(pasoCritico.id, input.id));
    }),
});
