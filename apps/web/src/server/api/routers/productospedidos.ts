import { z } from "zod";
import { db } from "~/server/db";
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { productosPedidos } from "~/server/db/schema";

export const productosPedidosRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({
      pedidoId: z.number(),
      productoId:z.string(),
      Cantidad:z.number(),
      Nombre:z.string(),
      Descripcion:z.string(),
      tipoInstalacion:z.number()
    })).mutation(async ({ ctx, input }) => {

      await ctx.db.insert(productosPedidos).values({
        pedidoId: input.pedidoId,
        productoId: input.productoId,
        cantidadScaneada: 0,
        cantidad: input.Cantidad,
        descripcion: input.Descripcion,
        nombre: input.Nombre,
        tipoInstalacion: input.tipoInstalacion,
      });
    }),
    createMany: publicProcedure
    .input(z.array(z.object({
      pedidoId: z.number(),
      productoId: z.string(),
      cantidad: z.number(),
      nombre: z.string(),
      descripcion: z.string(),
      tipoInstalacion:z.number()
    })))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(productosPedidos).values(
        input.map(producto => ({
          ...producto,
          Cantidad: 0,
        }))
      );
    }),
  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.productosPedidos.findMany();
  }),

  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.productosPedidos.findFirst({
        where: eq(productosPedidos.id, input.id),
      });

      return channel;
    }),
    getByProduct: publicProcedure
    .input(
      z.object({
        IdpedidoId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.productosPedidos.findMany({
        where: eq(productosPedidos.productoId, input.IdpedidoId),
        with: {pedido: {with: {cliente: true}}}
      });

      return channel;
    }),
    update: publicProcedure.input(z.object({id:z.string(),pedido: z.number(),productoId:z.string(),cantidad:z.number(),nombre:z.string(),
      descripcion:z.string(),cantidadScaneada:z.number(),tipoInstalacion:z.number(),})).mutation(async ({ ctx, input }) => {
      await db
        .update(productosPedidos)
        .set({
          pedidoId: input.pedido,
          productoId: input.productoId,
          cantidad: input.cantidad,
          nombre: input.nombre,
          descripcion: input.descripcion,
          tipoInstalacion: input.tipoInstalacion,
          cantidadScaneada: input.cantidadScaneada,
        })
        .where(eq(productosPedidos.id, input.id));
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .delete(productosPedidos)
        .where(eq(productosPedidos.id, input.id));
    }),
});
