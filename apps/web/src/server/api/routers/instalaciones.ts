import { z } from "zod";
import { db } from "~/server/db";
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  clientes,
  empalmistas,
  instalaciones,
  productos,
} from "~/server/db/schema";
import { date } from "drizzle-orm/mysql-core";
import { PgTimestampBuilder } from "drizzle-orm/pg-core";
import { RouterOutputs } from "../root";

export const instalacionesRouter = createTRPCRouter({
    // Producto: z.number(),Empalmista: z.number(),FechaAlta: z.number(),FechaInst: z.number(),FechaVeri: z.number(),Estado: z.number(),Cliente: z.number()
    create: publicProcedure.input(z.object({ Pedido: z.string(),tipoInstalacionId: z.string(),Empalmista: z.string(),FechaAlta: z.number(),FechaInst: z.number().optional(),FechaVeri: z.number().optional(),Estado: z.string(),Cliente: z.string(),Producto_pedido:z.string(),Codigo_de_barras:z.string(), lat: z.number().optional(), long: z.number().optional(), Comentario:z.string().optional()})).mutation(async ({ ctx, input }) => {
        // simulate a slow db call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        await ctx.db.insert(instalaciones).values(
            input
        )
    }),

  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.instalaciones.findMany({
      with: {
        empalmista: true,
        pedido: {
          with: {
            productos: true,
          },
        },
        cliente: true,
        tipoInstalacion:{
          with:{
            pasoCriticoTotipoInstalacion:true,
          }
        }
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
      const channel = await db.query.instalaciones.findFirst({
        where: eq(instalaciones.Id, input.Id),
        with: {
          empalmista: true,
          pedido: {
            with: {
              productos: true,
            },
          },
          cliente: true,
          fotos:true,
        },
      });

      return channel;
    }),

    getBarCode: publicProcedure
    .input(
      z.object({
        barcode: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.instalaciones.findFirst({
        where: eq(instalaciones.Codigo_de_barras, input.barcode),
        with: {
          empalmista: true,
          pedido: {
            with: {
              productos: true,
            },
          },
          tipoInstalacion:{
            with:{
              pasoCriticoTotipoInstalacion:{
                with:{
                  pasoCriticoData:true,
                },
              },
            },
          },
          cliente: true,
        },
      });
      return channel;
    }),



    update: publicProcedure.input(z.object({Id:z.string(), tipoInstalacion: z.string(), Pedido: z.string(),Empalmista: z.string(),FechaAlta: z.number(),FechaInst: z.number(),FechaVeri: z.number(),Estado: z.string(),Cliente: z.string(),Producto_pedido:z.string(), Codigo_de_barras:z.string() , lat:z.number().optional(),long:z.number().optional(), Comentario:z.string().optional()})).mutation(async ({ ctx, input }) => {
      const updated = await db
        .update(instalaciones)
        .set({
          Pedido: input.Pedido,
          Empalmista: input.Empalmista,
          Fecha_de_alta: new Date(input.FechaAlta),
          Fecha_de_instalacion: new Date(input.FechaInst),
          Fecha_de_verificacion: new Date(input.FechaVeri),
          Estado: input.Estado,
          Cliente: input.Cliente,
          tipoInstalacionId: input.tipoInstalacion,
          lat: input.lat,
          long: input.long,
          Comentario: input.Comentario,
        })
        .where(eq(instalaciones.Id, input.Id)).returning();
        return updated;
    }),

  delete: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.delete(instalaciones).where(eq(instalaciones.Id, input.Id));
    }),
});

export type Instalaciones = RouterOutputs["instalaciones"]["list"][number];
