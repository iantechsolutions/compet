import { z } from "zod";
import { db } from "~/server/db";
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { instalaciones, productos, productosPedidos } from "~/server/db/schema";
import { RouterOutputs } from "../root";

export const productosRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({ name: z.string().min(1), description: z.string(), codigoDeBarras: z.string(), tipoDeInstalacionId: z.number().nullable() })).mutation(async ({ ctx, input }) => {
        // simulate a slow db call
        // await new Promise((resolve) => setTimeout(resolve, 1000))
        if(input.tipoDeInstalacionId){
          await ctx.db.insert(productos).values({
            tipoDeInstalacionId: input.tipoDeInstalacionId,
            nombre:input.name,
            codigoDeBarras: input.codigoDeBarras,
            descripcion: input.description
        })
        }
        else{
          await ctx.db.insert(productos).values({
            nombre:input.name,
            codigoDeBarras: input.codigoDeBarras,
            descripcion: input.description
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
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.productos.findFirst({
        where: eq(productos.id, input.id),
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
        instalacionId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.productos.findMany({
        where: eq(productos.tipoDeInstalacionId, input.instalacionId),
      });

      return channel;
    }),


    update: publicProcedure.input(z.object({id:z.string(), name: z.string().min(1),
       description: z.string(), codigoDeBarras: z.string(), tipoDeInstalacionId: z.number().nullable(), })).mutation(async ({ ctx, input }) => {
      if( input.tipoDeInstalacionId){
        await db
        .update(productos)
        .set({
          tipoDeInstalacionId: input.tipoDeInstalacionId,
          nombre: input.name,
          descripcion: input.description,
          codigoDeBarras: input.codigoDeBarras,
        })
        .where(eq(productos.id, input.id));
      }
      else{
        await db
        .update(productos)
        .set({
          nombre: input.name,
          descripcion: input.description,
          codigoDeBarras: input.codigoDeBarras,
        })
        .where(eq(productos.id, input.id));
      }
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      
      await db.update(instalaciones).set({productoPedidoId: null}).where(eq(instalaciones.productoPedidoId, input.id));
      await db.delete(productosPedidos).where(eq(productosPedidos.productoId, input.id));

      await db.delete(productos).where(eq(productos.id, input.id));
    }),
});

export type Producto = RouterOutputs["productos"]["get"];
export type Productos = RouterOutputs["productos"]["list"];
