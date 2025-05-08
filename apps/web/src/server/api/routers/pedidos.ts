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
    FechaCreacion: z.number(),
    Estado: z.string(),
    Cliente: z.string(),
    Productos: z.array(z.object({
      Producto_id: z.string(),
      Cantidad: z.number(),
      Nombre: z.string(),
      Descripcion: z.string(),
      tipoInstalacionId: z.string(),
    }))
  })).mutation(async ({ ctx, input }) => {
  
    const clienteExists = await ctx.db.query.clientes.findFirst({
      where: eq(schema.clientes.Id, input.Cliente),
    });
    if (!clienteExists) {
      throw new Error("El cliente no existe");
    }
  
    const anterior = await ctx.db.query.pedidos.findMany({
      orderBy: [desc(pedidos.Numero)],
    });
    let numero = 1;
    if (anterior) {
      numero = (anterior[0]?.Numero ?? 0) + 1;
    }
  
    const result = await ctx.db.insert(pedidos).values({
      Cliente: input.Cliente,
      Estado: input.Estado,
      Fecha_de_creacion: new Date(input.FechaCreacion),
      Numero: numero,
    }).returning();
  
    if (!result) {
      throw new Error("No se pudo crear el pedido");
    }
  
    for (const producto of input.Productos) {
      const productoExists = await ctx.db.query.productos.findFirst({
        where: eq(schema.productos.Id, producto.Producto_id),
      });
      if (!productoExists) {
        throw new Error(`El producto con ID ${producto.Producto_id} no existe`);
      }
  
      const tipoInstalacionExists = await ctx.db.query.tipoInstalaciones.findFirst({
        where: eq(schema.tipoInstalaciones.id, producto.tipoInstalacionId),
      });
      if (!tipoInstalacionExists) {
        throw new Error(`El tipo de instalación con ID ${producto.tipoInstalacionId} no existe`);
      }
  
      await ctx.db.insert(schema.productosPedidos).values({
        Pedido: result[0]?.Id ?? "",
        Producto: producto.Producto_id,
        Cantidad: producto.Cantidad,
        Nombre: producto.Nombre,
        Descripcion: producto.Descripcion,
        tipoInstalacion: producto.tipoInstalacionId,
      });
    }
  
    return result;
  }),
  

  list: publicProcedure.query(() => {
    return db.query.pedidos.findMany({
      with: {
        productos: true,
        clientes: true,
      },
    });
  }),

  get: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.pedidos.findFirst({
        where: eq(pedidos.Id, input.Id),
        with: {
          productos: true,
          clientes: true,
        },
      });

      return channel;
    }),
    getWithRelations: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.pedidos.findFirst({
        where: eq(pedidos.Id, input.Id),
        with: {
          productos: true,
          clientes: true,

        },
      });

      return channel;
    }),
    update: publicProcedure.input(z.object({Id:z.string(),FechaCreacion: z.number(),Fecha_de_aprobacion: z.number().optional()
      ,Fecha_de_envio: z.number().optional(),Estado: z.string(),Cliente: z.string()})).mutation(async ({ ctx, input }) => {
      const updated = await db
        .update(pedidos)
        .set({
          Cliente: input.Cliente,
          Estado: input.Estado,
          Fecha_de_aprobacion:
            input.Fecha_de_aprobacion !== undefined
              ? new Date(input.Fecha_de_aprobacion)
              : undefined,
          Fecha_de_creacion: new Date(input.FechaCreacion),
          Fecha_de_envio:
            input.Fecha_de_envio !== undefined
              ? new Date(input.Fecha_de_envio)
              : undefined,
        })
        .where(eq(pedidos.Id, input.Id)).returning();
        return updated;
    }),

  delete: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.delete(pedidos).where(eq(pedidos.Id, input.Id));
    }),
});


export type Pedido = RouterOutputs["pedidos"]["get"];