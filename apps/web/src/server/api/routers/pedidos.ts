import { z } from "zod";
import { db, schema } from "~/server/db";
import { asc, desc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { clientes, empalmistas, pedidos, productos } from "~/server/db/schema";
import { date } from "drizzle-orm/mysql-core";
import { PgTimestampBuilder } from "drizzle-orm/pg-core";
import { RouterOutputs } from "../root";

export const pedidosRouter = createTRPCRouter({
  create: publicProcedure.input(z.object({
      fechaCreacion: z.number(), 
      estado: z.enum(["Pendiente", "Generado", "Enviado", "Aprobado"]),
      clienteId: z.string(),
      productos: z.array(z.object({
      productoId: z.string(),
      cantidad: z.number(),
      nombre: z.string(),
      descripcion: z.string(), 
      tipoInstalacionId: z.number(),
    })),
  })).mutation(async ({ ctx, input }) => {

    const clienteExists = await db.query.clientes.findFirst({
      where: eq(clientes.id, input.clienteId),
    });

    if (!clienteExists) {
      throw new Error("El cliente no existe");
    }

    const anterior = await db.query.pedidos.findMany({
      orderBy: [desc(pedidos.numero)],
    });

    let numero = 1;
    if (anterior.length > 0) {
      numero = (anterior[0]?.numero ?? 0) + 1;
    }

    const result = await ctx.db.insert(pedidos).values({
      clienteId: input.clienteId,
      estado: input.estado,
      fechaCreacion: new Date(input.fechaCreacion),
      numero: numero,
      fechaAprobacion: null,
      fechaEnvio: null,
    }).returning();

    if (!result || result.length === 0) {
      throw new Error("No se pudo crear el pedido");
    }

    const pedidoId = result[0]?.id;

    if(!pedidoId) {
      throw new Error("No se pudo crear el pedido");
    }
    for (const producto of input.productos) {
      const productoExists = await db.query.productos.findFirst({
        where: eq(productos.id, producto.productoId),
      });
      if (!productoExists) {
        throw new Error(`El producto con ID ${producto.productoId} no existe`);
      }

      const tipoInstalacionExists = await db.query.tipoInstalaciones.findFirst({
        where: eq(schema.tipoInstalaciones.id, producto.tipoInstalacionId),
      });
      if (!tipoInstalacionExists) {
        throw new Error(`El tipo de instalación con ID ${producto.tipoInstalacionId} no existe`);
      }

      await db.insert(schema.productosPedidos).values({
        pedidoId: pedidoId,
        productoId: producto.productoId,
        cantidad: producto.cantidad,
        cantidadScaneada: 0,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        tipoInstalacion: producto.tipoInstalacionId,
      });
    }

    return result;
  }),

  list: publicProcedure.query(() => {
    return db.query.pedidos.findMany({
      with: {
        productosPedidos: true,
        cliente: true,
      },
    });
  }),

  get: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return await db.query.pedidos.findFirst({
      where: eq(pedidos.id, input.id),
      with: {
        cliente: true,
        productosPedidos: true,
      },
    });
  }),

  getWithRelations: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return await db.query.pedidos.findFirst({
      where: eq(pedidos.id, input.id),
      with: {
        cliente: true,
        productosPedidos: true,
      },
    });
  }),

  update: publicProcedure.input(z.object({
    id: z.number(),
    fechaCreacion: z.number(),
    fechaAprobacion: z.number().optional(),
    fechaEnvio: z.number().optional(),
    estado: z.enum(["Pendiente", "Generado", "Enviado", "Aprobado"]),
    clienteId: z.string()
  })).mutation(async ({ ctx, input }) => {


    return await db.update(pedidos).set({
      clienteId: input.clienteId,
      estado: input.estado,
      fechaAprobacion: input.fechaAprobacion ? new Date(input.fechaAprobacion) : undefined,
      fechaCreacion: new Date(input.fechaCreacion),
      fechaEnvio: input.fechaEnvio ? new Date(input.fechaEnvio) : undefined,
    }).where(eq(pedidos.id, input.id)).returning();
  }),

  delete: publicProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    await db.delete(pedidos).where(eq(pedidos.id, input.id));
  }),
});



export type Pedido = RouterOutputs["pedidos"]["get"];