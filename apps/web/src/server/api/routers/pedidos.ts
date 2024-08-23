import { z } from "zod";
import { db } from "~/server/db";
import { asc, desc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { clientes, empalmistas, pedidos, productos } from "~/server/db/schema";
import { date } from "drizzle-orm/mysql-core";
import { PgTimestampBuilder } from "drizzle-orm/pg-core";

export const pedidosRouter = createTRPCRouter({
    // Producto: z.number(),Empalmista: z.number(),FechaAlta: z.number(),FechaInst: z.number(),FechaVeri: z.number(),Estado: z.number(),Cliente: z.number()
    create: publicProcedure.input(z.object({FechaCreacion: z.number(),Fecha_de_aprobacion: z.number().optional(),Fecha_de_envio: z.number().optional(),Estado: z.string(),Cliente: z.string()})).mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const fechaAprobacion = input.Fecha_de_aprobacion !== undefined ? new Date(input.Fecha_de_aprobacion) : undefined;
      const FechaEnvio = input.Fecha_de_envio !== undefined ? new Date(input.Fecha_de_envio) : undefined;
      
      const anterior = await ctx.db.query.pedidos.findMany({
        orderBy: [desc(pedidos.Numero)],
      });

      console.log("anterior");
      console.log(anterior[0]);
      console.log(anterior[0]?.Numero);
      let numero = 1
      console.log(numero);
      if (anterior){
        console.log("pre" + (anterior[0]?.Numero ?? 0));
        console.log("+1 " + (anterior[0]?.Numero ?? 0) +1);
        numero = (anterior[0]?.Numero ?? 0) + 1
        console.log(numero);
      }
      const result = await ctx.db.insert(pedidos).values(
        {
          Cliente: input.Cliente,
          Estado: input.Estado,
          Fecha_de_aprobacion: fechaAprobacion,
          Fecha_de_creacion: new Date(input.FechaCreacion),
          Fecha_de_envio: FechaEnvio,
          Numero: numero,
        }
      ).returning()
      return result;
    }),

  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.pedidos.findMany({
      with: {
        productos: true,
        cliente: true,
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
          cliente: true,
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
