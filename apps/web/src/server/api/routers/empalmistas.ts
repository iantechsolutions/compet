import { z } from 'zod'
import { db } from '~/server/db'
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { empalmistas } from '~/server/db/schema'

export const empalmistasRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({ name: z.string().min(1)})).mutation(async ({ ctx, input }) => {
        // simulate a slow db call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        await ctx.db.insert(empalmistas).values({
            Nombre:input.name,
        })
    }),

    list: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.empalmistas.findMany()
    }),

    get: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.clientes.findFirst({
        where: eq(empalmistas.Id, input.Id)
      });

      return channel;
    }),

    update: publicProcedure.input(z.object({Id:z.string(), name: z.string().min(1) })).mutation(async ({ ctx, input }) => {
      await db
        .update(empalmistas)
        .set({
          Nombre: input.name,
        })
        .where(eq(empalmistas.Id, input.Id));
    }),

    delete: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .delete(empalmistas)
        .where(eq(empalmistas.Id, input.Id));
    }),

})
