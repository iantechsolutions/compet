import { z } from "zod";
import { db } from "~/server/db";
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { instalaciones, productos, productosPedidos } from "~/server/db/schema";
import { RouterOutputs } from "../root";

export const productosRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({ name: z.string().min(1), description: z.string(), barcode: z.string(), categoria: z.string().nullable() })).mutation(async ({ ctx, input }) => {
        // simulate a slow db call
        // await new Promise((resolve) => setTimeout(resolve, 1000))
        if(input.categoria){
          await ctx.db.insert(productos).values({
            tipoDeInstalacion_id: input.categoria,
            Nombre:input.name,
            Codigo_de_barras: input.barcode,
            Descripcion: input.description
        })
        }
        else{
          await ctx.db.insert(productos).values({
            Nombre:input.name,
            Codigo_de_barras: input.barcode,
            Descripcion: input.description
        })
        }
        
    }),

  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.productos.findMany({
      with:{
        tipoDeInstalacion:{
          with:{
            pasoCriticoTotipoInstalacion:true

            
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
      const channel = await db.query.productos.findFirst({
        where: eq(productos.Id, input.Id),
        with: {
          tipoDeInstalacion: {
            with: {
              pasoCriticoTotipoInstalacion: true,
            },
          },
        }
      });

      return channel;
    }),
    getByInstalation: publicProcedure
    .input(
      z.object({
        instalacionId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.productos.findMany({
        where: eq(productos.tipoDeInstalacion_id, input.instalacionId),
      });

      return channel;
    }),


    update: publicProcedure.input(z.object({Id:z.string(), name: z.string().min(1), description: z.string(), barcode: z.string(), categoria: z.string().nullable(), })).mutation(async ({ ctx, input }) => {
      if( input.categoria){
        await db
        .update(productos)
        .set({
          tipoDeInstalacion_id: input.categoria,
          Nombre: input.name,
          Descripcion: input.description,
          Codigo_de_barras: input.barcode,
        })
        .where(eq(productos.Id, input.Id));
      }
      else{
        await db
        .update(productos)
        .set({
          Nombre: input.name,
          Descripcion: input.description,
          Codigo_de_barras: input.barcode,
        })
        .where(eq(productos.Id, input.Id));
      }
    }),

  delete: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      
      await db.update(instalaciones).set({Producto_pedido: null}).where(eq(instalaciones.Producto_pedido, input.Id));
      await db.delete(productosPedidos).where(eq(productosPedidos.Producto, input.Id));

      await db.delete(productos).where(eq(productos.Id, input.Id));
    }),
});

export type Producto = RouterOutputs["productos"]["get"];
export type Productos = RouterOutputs["productos"]["list"];
