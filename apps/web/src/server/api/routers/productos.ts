import { z } from 'zod'
import { db } from '~/server/db'
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { productos } from '~/server/db/schema'

export const productosRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({ name: z.string().min(1), description: z.string(), barcode: z.string(), categoria: z.string() })).mutation(async ({ ctx, input }) => {
        // simulate a slow db call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        await ctx.db.insert(productos).values({
            tipoDeInstalacion_id: input.categoria,
            Nombre:input.name,
            Codigo_de_barras: input.barcode,
            Descripcion: input.description
        })
    }),

    list: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.productos.findMany()
    }),

    get: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.productos.findFirst({
        where: eq(productos.Id, input.Id)
      });

      return channel;
    }),

    update: publicProcedure.input(z.object({Id:z.string(), name: z.string().min(1), description: z.string(), barcode: z.string() })).mutation(async ({ ctx, input }) => {
      await db
        .update(productos)
        .set({
          Nombre: input.name,
          Descripcion: input.description,
          Codigo_de_barras: input.barcode,
        })
        .where(eq(productos.Id, input.Id));
    }),

    delete: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .delete(productos)
        .where(eq(productos.Id, input.Id));
    }),

})
