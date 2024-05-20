import { z } from 'zod'
import { db } from '~/server/db'
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { clientes, empalmistas, instalaciones, productos } from '~/server/db/schema'
import { date } from 'drizzle-orm/mysql-core';
import { PgTimestampBuilder } from 'drizzle-orm/pg-core';

export const instalacionesRouter = createTRPCRouter({
    // Producto: z.number(),Empalmista: z.number(),FechaAlta: z.number(),FechaInst: z.number(),FechaVeri: z.number(),Estado: z.number(),Cliente: z.number()
    create: publicProcedure.input(z.object({ Pedido: z.number(),tipoInstalacion: z.string(),Empalmista: z.number(),FechaAlta: z.number(),FechaInst: z.number().optional(),FechaVeri: z.number().optional(),Estado: z.number(),Cliente: z.number()})).mutation(async ({ ctx, input }) => {
        // simulate a slow db call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await ctx.db.insert(instalaciones).values(
            input
        )
    }),

    list: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.instalaciones.findMany({
          with:{
            empalmista: true,
            pedido: {
              with:{
                productos: true
              }
            },
            cliente: true
          }
        })
    }),

    get: publicProcedure
    .input(
      z.object({
        Id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.instalaciones.findFirst({
        where: eq(instalaciones.Id, input.Id),
        with:{
          empalmista: true,
          pedido: {
            with:{
              productos: true
            }
          },
          cliente: true
        }
      });

      return channel;
    }),

    update: publicProcedure.input(z.object({Id:z.number(), tipoInstalacion: z.string(), Pedido: z.number(),Empalmista: z.number(),FechaAlta: z.number(),FechaInst: z.number(),FechaVeri: z.number(),Estado: z.number(),Cliente: z.number() })).mutation(async ({ ctx, input }) => {
      await db
        .update(instalaciones)
        .set({
          Pedido: input.Pedido,
          Empalmista:input.Empalmista,
          Fecha_de_alta : new Date(input.FechaAlta),
          Fecha_de_instalacion: new Date(input.FechaInst),
          Fecha_de_verificacion: new Date(input.FechaVeri),
          Estado: input.Estado,
          Cliente: input.Cliente,
          tipoInstalacion: input.tipoInstalacion
        })
        .where(eq(empalmistas.Id, input.Id));
    }),

    delete: publicProcedure
    .input(
      z.object({
        Id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .delete(instalaciones)
        .where(eq(instalaciones.Id, input.Id));
    }),

})
