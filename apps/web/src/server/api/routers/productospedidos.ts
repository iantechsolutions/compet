import { z } from "zod";
import { db } from "~/server/db";
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { productosPedidos } from "~/server/db/schema";

export const productosPedidosRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({
      Pedido: z.string(),
      Producto:z.string(),
      Cantidad:z.number(),
      Nombre:z.string(),
      Descripcion:z.string(),
      tipoInstalacion:z.string()
    })).mutation(async ({ ctx, input }) => {

      await ctx.db.insert(productosPedidos).values({
        Pedido: input.Pedido,
        Producto: input.Producto,
        Cantidad: input.Cantidad,
        Nombre: input.Nombre,
        Descripcion: input.Descripcion,
        tipoInstalacion: input.tipoInstalacion,
        CantidadScaneada: 0,
      });
    }),
    createMany: publicProcedure
    .input(z.array(z.object({
      Pedido: z.string(),
      Producto: z.string(),
      Cantidad: z.number(),
      Nombre: z.string(),
      Descripcion: z.string(),
      tipoInstalacion: z.string(),
    })))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(productosPedidos).values(
        input.map(producto => ({
          ...producto,
          CantidadScaneada: 0,
        }))
      );
    }),
  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.productosPedidos.findMany();
  }),

  get: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.productosPedidos.findFirst({
        where: eq(productosPedidos.Id, input.Id),
      });

      return channel;
    }),
    getByProduct: publicProcedure
    .input(
      z.object({
        IdProducto: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.productosPedidos.findMany({
        where: eq(productosPedidos.Producto, input.IdProducto),
        with: {pedido: {with: {clientes: true}}}
      });

      return channel;
    }),
    update: publicProcedure.input(z.object({Id:z.string(),Pedido: z.string(),Producto:z.string(),Cantidad:z.number(),Nombre:z.string(),Descripcion:z.string(),CantidadScaneada:z.number(),tipoInstalacion:z.string(),})).mutation(async ({ ctx, input }) => {
      await db
        .update(productosPedidos)
        .set({
          Pedido: input.Pedido,
          Producto: input.Producto,
          Cantidad: input.Cantidad,
          Nombre: input.Nombre,
          Descripcion: input.Descripcion,
          tipoInstalacion: input.tipoInstalacion,
          CantidadScaneada: input.CantidadScaneada,
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
});
