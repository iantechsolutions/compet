import { z } from "zod";
import { db, schema } from "~/server/db";
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { instalaciones, pasoCritico, pasoCriticoTotipoInstalacion, productos, tipoInstalaciones } from "~/server/db/schema";

export const tipoInstalacionesRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({ descripcion: z.string()
        })).mutation(async ({ ctx, input }) => {
        // simulate a slow db call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const result = await ctx.db.insert(tipoInstalaciones).values({
            descripcion: input.descripcion,
            
        }).returning();
        return result;
    }),

  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.tipoInstalaciones.findMany({
      with:{
        pasoCriticoTotipoInstalacion:true,
      }
    });
  }),

  get: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.tipoInstalaciones.findFirst({
        where: eq(tipoInstalaciones.id, input.id)
      });

      return channel;
    }),

    update: publicProcedure.input(z.object({id:z.number(), descripcion: z.string()
})).mutation(async ({ ctx, input }) => {
      await db
        .update(tipoInstalaciones)
        .set({
            descripcion: input.descripcion,
        })
        .where(eq(tipoInstalaciones.id, input.id));
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      
      const instalacion = await db.update(instalaciones).set({tipoInstalacionId: null}).where(eq(instalaciones.tipoInstalacionId, input.id))

      const paso_critico = await db.delete(pasoCriticoTotipoInstalacion).where(eq(pasoCriticoTotipoInstalacion.tipoInstalacionId, input.id))

      const prod = await db.update(productos).set({tipoDeInstalacionId: null}).where(eq(productos.tipoDeInstalacionId, input.id))
      


      
      await db
        .delete(tipoInstalaciones)
        .where(eq(tipoInstalaciones.id, input.id));


        return instalacion;
    }),

});
