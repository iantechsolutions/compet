import { z } from 'zod'
import { db } from '~/server/db'
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { clientes } from '~/server/db/schema'

export const clientesRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({ name: z.string().min(1), direccion: z.string()})).mutation(async ({ ctx, input }) => {
        // simulate a slow db call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        await ctx.db.insert(clientes).values({
            Nombre:input.name,
            Direccion: input.direccion,
        })
    }),

    list: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.clientes.findMany()
    }),

    get: publicProcedure
    .input(
      z.object({
        Id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.clientes.findFirst({
        where: eq(clientes.Id, input.Id)
      });

      return channel;
    }),

    update: publicProcedure.input(z.object({Id:z.number(), name: z.string().min(1), direccion: z.string() })).mutation(async ({ ctx, input }) => {
      await db
        .update(clientes)
        .set({
          Nombre: input.name,
          Direccion: input.direccion,
        })
        .where(eq(clientes.Id, input.Id));
    }),

    delete: publicProcedure
    .input(
      z.object({
        Id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .delete(clientes)
        .where(eq(clientes.Id, input.Id));
    }),

})
