import { z } from "zod";
import { db } from "~/server/db";
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { pasoCritico, tipoInstalaciones } from "~/server/db/schema";

export const tipoInstalacionesRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({ description: z.string()
        })).mutation(async ({ ctx, input }) => {
        // simulate a slow db call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const result = await ctx.db.insert(tipoInstalaciones).values({
            description: input.description,
        }).returning();
        return result;
    }),

  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.tipoInstalaciones.findMany({
      with:{
        pasoCriticoTotipoInstalacion:true,
      }
    });
  }),

  get: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.tipoInstalaciones.findFirst({
        where: eq(tipoInstalaciones.id, input.Id)
      });

      return channel;
    }),

    update: publicProcedure.input(z.object({Id:z.string(), description: z.string()
})).mutation(async ({ ctx, input }) => {
      await db
        .update(tipoInstalaciones)
        .set({
            id: input.Id,
            
            description: input.description,
        })
        .where(eq(tipoInstalaciones.id, input.Id));
    }),

  delete: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .delete(tipoInstalaciones)
        .where(eq(tipoInstalaciones.id, input.Id));
    }),
});
