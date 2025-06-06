import { z } from "zod";
import { db, schema } from "~/server/db";
import { asc, eq } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { clientes } from "~/server/db/schema";
import { RouterOutputs } from "../root";

export const clientesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ direccion: z.string(), nombre: z.string() }))
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
        clienteid: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const administrative_audit = await db.query.clientes.findFirst({
        where: eq(schema.clientes.id, input.clienteid),
      });

      return administrative_audit;
    }),
    update: publicProcedure.input(z.object({id:z.string(), name: z.string(), direccion: z.string() })).mutation(async ({ ctx, input }) => {
      await db
        .update(clientes)
        .set({
          id: input.id,
          nombre: input.name,
          direccion: input.direccion,
        })
        .where(eq(clientes.id, input.id));
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.delete(clientes).where(eq(clientes.id, input.id));
    }),
});

export type Clientes = RouterOutputs["productos"]["list"];
export type Cliente = RouterOutputs["productos"]["get"];
