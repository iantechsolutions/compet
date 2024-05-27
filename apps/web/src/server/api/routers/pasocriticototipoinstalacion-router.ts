import { z } from 'zod'
import { db, schema } from '~/server/db'
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc'
import { pasoCriticoTotipoInstalacion } from '~/server/db/schema'

export const pasocriticototipoinstalacionRouter = createTRPCRouter({
  create: protectedProcedure
  .input(z.object( {tipoInstalacion: z.string(), pasoCritico: z.string() }))
  .mutation(async ({ input }) => {
    
    await db.insert(pasoCriticoTotipoInstalacion).values(input);

  }),

    list: publicProcedure.query(async ({}) => {
        const pasocriticototipoinstalacions = await db.query.pasoCriticoTotipoInstalacion.findMany();
        return pasocriticototipoinstalacions;
    }),

    get: protectedProcedure
    .input(
      z.object({
        pasocriticototipoinstalacionId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const administrative_audit = await db.query.pasoCriticoTotipoInstalacion.findFirst({
        where: eq(schema.pasoCriticoTotipoInstalacion.id, input.pasocriticototipoinstalacionId),
      });

      return administrative_audit;
    }),
    update: publicProcedure.input(z.object({Id:z.string(), tipoInstalacion: z.string().min(1), pasoCritico: z.string() })).mutation(async ({ ctx, input }) => {
      await db
        .update(pasoCriticoTotipoInstalacion)
        .set({
          id: input.Id,
          tipoInstalacion: input.tipoInstalacion,
          pasoCritico: input.pasoCritico,
        })
        .where(eq(pasoCriticoTotipoInstalacion.id, input.Id));
    }),

    delete: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .delete(pasoCriticoTotipoInstalacion)
        .where(eq(pasoCriticoTotipoInstalacion.id, input.Id));
    }),

})
