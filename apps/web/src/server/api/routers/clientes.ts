import { z } from "zod";
import { db, schema } from "~/server/db";
import { asc, eq } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { clientes } from "~/server/db/schema";

export const clientesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ Direccion: z.string(), Nombre: z.string() }))
    .mutation(async ({ input }) => {
      await db.insert(clientes).values(input);
    }),

  list: publicProcedure.query(async ({}) => {
    const clientes = await db.query.clientes.findMany();
    return clientes;
  }),

  get: protectedProcedure
    .input(
      z.object({
        clienteId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const administrative_audit = await db.query.clientes.findFirst({
        where: eq(schema.clientes.Id, input.clienteId),
      });

      return administrative_audit;
    }),
  update: publicProcedure
    .input(
      z.object({ Id: z.number(), name: z.string(), direccion: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(clientes)
        .set({
          Id: input.Id,
          Nombre: input.name,
          Direccion: input.direccion,
        })
        .where(eq(clientes.Id, input.Id));
    }),

  delete: publicProcedure
    .input(
      z.object({
        Id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await db.delete(clientes).where(eq(clientes.Id, input.Id));
    }),
});
