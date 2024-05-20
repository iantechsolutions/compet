import { z } from 'zod'
import { db } from '~/server/db'
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { pasoCritico, tipoInstalaciones } from '~/server/db/schema'



export const tipoInstalacionesRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({ pasoCritico: z.string(), description: z.string()
        })).mutation(async ({ ctx, input }) => {
        // simulate a slow db call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        await ctx.db.insert(tipoInstalaciones).values({
            pasoCritico:input.pasoCritico,
            description: input.description,
        })
    }),

    list: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.tipoInstalaciones.findMany()
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

    update: publicProcedure.input(z.object({Id:z.string(), pasoCritico: z.string(), description: z.string()
})).mutation(async ({ ctx, input }) => {
      await db
        .update(tipoInstalaciones)
        .set({
            id: input.Id,
            pasoCritico: input.pasoCritico,
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

})
