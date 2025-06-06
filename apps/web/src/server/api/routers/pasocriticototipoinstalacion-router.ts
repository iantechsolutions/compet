import { z } from 'zod'
import { db, schema } from '~/server/db'
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc'
import { pasoCriticoTotipoInstalacion } from '~/server/db/schema'

export const pasocriticototipoinstalacionRouter = createTRPCRouter({
  create: protectedProcedure
  .input(z.object( {tipoInstalacionId: z.number(), pasoCriticoId: z.number(), number: z.number().optional() }))
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
    update: publicProcedure.input(z.object({id:z.string(), tipoInstalacionId: z.number().min(1), pasoCriticoId: z.number() })).mutation(async ({ ctx, input }) => {
      await db
        .update(pasoCriticoTotipoInstalacion)
        .set({
          id: input.id,
          tipoInstalacionId: input.tipoInstalacionId,
          pasoCriticoId: input.pasoCriticoId,
        })
        .where(eq(pasoCriticoTotipoInstalacion.id, input.id));
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
    deleteByTipoInstalacionId: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .delete(pasoCriticoTotipoInstalacion)
        .where(eq(pasoCriticoTotipoInstalacion.tipoInstalacionId, input.id));
    }),

})
