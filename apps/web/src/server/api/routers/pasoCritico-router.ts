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
        description: z.string(),
        useCamera: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(pasoCritico).values({
        detalle: input.detalle,
        description: input.description,
        useCamera: input.useCamera,
      });
    }),

  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.pasoCritico.findMany();
  }),

  get: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.pasoCritico.findFirst({
        where: eq(pasoCritico.id, input.Id)
      });

      return channel;
    }),

    update: publicProcedure.input(z.object({Id:z.string(), detalle: z.string(), description: z.string(),
         useCamera: z.boolean() })).mutation(async ({ ctx, input }) => {
      await db
        .update(pasoCritico)
        .set({
          detalle: input.detalle,
          description: input.description,
          useCamera: input.useCamera,
        })
        .where(eq(pasoCritico.id, input.Id));
    }),

  delete: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .delete(pasoCritico)
        .where(eq(pasoCritico.id, input.Id));
    }),
});
