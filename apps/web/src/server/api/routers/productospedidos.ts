import { z } from 'zod'
import { db } from '~/server/db'
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { productosPedidos } from '~/server/db/schema'

export const productosPedidosRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({Pedido: z.number(),Producto:z.number(),Cantidad:z.number(),Nombre:z.string(),Descripcion:z.string(),CodigoBarras:z.string()})).mutation(async ({ ctx, input }) => {
        // simulate a slow db call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        await ctx.db.insert(productosPedidos).values({
            Pedido: input.Pedido,
            Producto: input.Producto,
            Cantidad: input.Cantidad,
            Nombre: input.Nombre,
            Descripcion: input.Descripcion,
            Codigo_de_barras: input.CodigoBarras
        })
    }),

    list: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.productosPedidos.findMany()
    }),

    get: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.productosPedidos.findFirst({
        where: eq(productosPedidos.Id, input.Id)
      });

      return channel;
    }),

    update: publicProcedure.input(z.object({Id:z.string(),Pedido: z.number(),Producto:z.number(),Cantidad:z.number(),Nombre:z.string(),Descripcion:z.string(),CodigoBarras:z.string()})).mutation(async ({ ctx, input }) => {
      await db
        .update(productosPedidos)
        .set({
            Pedido: input.Pedido,
            Producto: input.Producto,
            Cantidad: input.Cantidad,
            Nombre: input.Nombre,
            Descripcion: input.Descripcion,
            Codigo_de_barras: input.CodigoBarras
        })
        .where(eq(productosPedidos.Id, input.Id));
    }),

    delete: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .delete(productosPedidos)
        .where(eq(productosPedidos.Id, input.Id));
    }),

})
