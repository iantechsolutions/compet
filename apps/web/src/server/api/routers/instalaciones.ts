import { z } from "zod";
import { db } from "~/server/db";
import { and, asc, desc, eq, not, or } from "drizzle-orm";
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
      create: publicProcedure.input(z.object({ 
      pedido: z.number(),
      tipoInstalacionId: z.number(),
      productoPedidoId:z.string(),
      empalmista: z.string(),
      fechaAlta: z.number(),
      fechaInst: z.number().optional(),
      fechaVeri: z.number().optional(),
      estado: z.enum(["Pendiente", "Generada","En progreso", "Instalada", "Verificada", "Completada", "Rechazada", "Aprobada"]),
      cliente: z.string(),
      codigoDeBarras:z.string(),
      lat: z.number().optional(),
      long: z.number().optional(),
      comentario:z.string().optional(),
      nroLoteArticulo: z.string()
         })).mutation(async ({ ctx, input }) => {
      
         await db.insert(instalaciones).values({
  clienteId: input.cliente, 
  pedidoId: input.pedido,
  tipoInstalacionId: input.tipoInstalacionId,
  productoPedidoId: input.productoPedidoId,
  empalmistaId: input.empalmista,
  fechaAlta: new Date(input.fechaAlta), 
  fechaInstalacion: input.fechaInst ? new Date(input.fechaInst) : undefined, 
  fechaVerificacion: input.fechaVeri ? new Date(input.fechaVeri) : undefined,
  estado: input.estado,
  lat: input.lat,
  long: input.long,
  comentario: input.comentario,
  nroLoteArticulo: input.nroLoteArticulo,
  codigoDeBarras: input.codigoDeBarras
})

          

    }),
  //   createAssignBarcode: publicProcedure
  //   .input(z.object({ 
  //     pedido: z.string(),
  //     tipoInstalacionId: z.string(),
  //     empalmista: z.string(),
  //     fechaAlta: z.number(),
  //     fechaInst: z.number().optional(),
  //     fechaVeri: z.number().optional(),
  //     estado: z.enum(["Pendiente", "Generada", "Instalada", "Verificada"]),
  //           cliente: z.string(),
  //     productoPedidoId:z.string(),
  //     lat: z.number().optional(),
  //     long: z.number().optional(),
  //     comentario:z.string().optional(),
  //     nroLoteArticulo: z.string() })).mutation(async ({input }) => {

     
  //     //   const anterior = await db.query.instalaciones.findMany({
  //     //   orderBy: [desc(instalaciones.id)],
  //     // });

  //     //   console.log("Entro", input);

  //     // let numero = 1
  //     // if (anterior){
  //     //   numero = (anterior[0]?.id ?? 0) + 1
  //     // }
  //     // let generatedBarcodes = await db.query.generatedBarcodes.findMany({
  //     //   orderBy: [desc(instalaciones.numero)],
  //     // });

  //     // console.log(generatedBarcodes);
  //     // let lastCode = 0
  //     // console.log("lastCode", lastCode);
  //     // if (generatedBarcodes){
  //     //   generatedBarcodes = generatedBarcodes.sort((a, b) => parseInt(a.CodigoBarras ?? "0") - parseInt(b.CodigoBarras ?? "0"));
  //     //   lastCode = parseInt(generatedBarcodes[generatedBarcodes.length-1]?.CodigoBarras ?? "0")
  //     // }
  //     // console.log("lastCode", lastCode);
      
  //     await db.insert(instalaciones).values(
  //     {
  //       ...input, numero, Codigo_de_barras:(lastCode + 1).toString(), nroLoteArticulo:input.nroLoteArticulo ?? "N/A"
  //     }
  //     )
  // }),
  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.instalaciones.findMany({
      with: {
        empalmista: true,
        pedido: {
          with: {
            productosPedidos: true,

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
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.instalaciones.findFirst({
        where: eq(instalaciones.id, input.id),
        with: {
          empalmista: true,
          pedido: {
            with: {
              productosPedidos: true,
            },
          },
          cliente: true,
          fotos:true,
          productoPedido:true,
          tipoInstalacion:{
            with:{
              pasoCriticoTotipoInstalacion:{
                with:{
                  pasoCritico:true,
                },
              },
            }
          }
        },
      });

      return channel;
    }),


    getByTipoInstalacion: publicProcedure
    .input(
      z.object({
        tipoId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.instalaciones.findMany({
        where: eq(instalaciones.tipoInstalacionId, input.tipoId),
        
      });

      return channel;
    }),
    getByProduct: publicProcedure
    .input(
      z.object({
        tipoId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.instalaciones.findMany({
        where: eq(instalaciones.productoPedidoId, input.tipoId),
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
        where: and(eq(instalaciones.codigoDeBarras, input.barcode),or(eq(instalaciones.estado,"En progreso"),eq(instalaciones.estado,"Pendiente"))),
        with: {
          empalmista: true,
          pedido: {
            with: {
              productosPedidos: true,
            },
          },
          tipoInstalacion:{
            with:{
              pasoCriticoTotipoInstalacion:{
                with:{
                  pasoCritico:true,
                },
              },
            },
          },
          cliente: true,
        },
      });
      return channel;
    }),



    update: publicProcedure.input(
        z.object(
          {
            id:z.number(),
        tipoInstalacion: z.number(),
        pedidoId: z.number(),
        empalmistaId: z.string(),
        fechaAlta: z.number(),
        fechaInstalacion: z.number(),
        fechaVerificacion: z.number(),
        estado: z.enum(["Pendiente", "Generada", "Instalada", "Verificada"]),
        clienteId: z.string(),
        productoPedidoId:z.string(),
        Codigo_de_barras:z.string(), 
        lat:z.number().optional(),
        long:z.number().optional(),
        comentario:z.string().optional(),
        nroLoteArticulo:z.string()
      })).mutation(async ({ ctx, input }) => {
      const updated = await db
        .update(instalaciones)
        .set({
          pedidoId: input.pedidoId,
          empalmistaId: input.empalmistaId,
          fechaAlta: new Date(input.fechaAlta),
          fechaInstalacion: new Date(input.fechaInstalacion),
          fechaVerificacion: new Date(input.fechaVerificacion),
          estado: input.estado,
          clienteId: input.clienteId,
          tipoInstalacionId: input.tipoInstalacion,
          lat: input.lat,
          long: input.long,
          comentario: input.comentario,
          nroLoteArticulo: input.nroLoteArticulo,
        })
        .where(eq(instalaciones.id, input.id)).returning();
        return updated;
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.delete(instalaciones).where(eq(instalaciones.id, input.id));
    }),
});

export type Instalaciones = RouterOutputs["instalaciones"]["list"][number];
