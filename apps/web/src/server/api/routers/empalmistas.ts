import { z } from "zod";
import { db } from "~/server/db";
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { empalmistas } from "~/server/db/schema";
import { RouterOutputs } from "../root";

export const empalmistasRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string().min(1), dni: z.string(), birthDate : z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(empalmistas).values({
        nombre: input.name,
        dni: input.dni,
        birthDate: new Date(input.birthDate ?? 0),
      });
    }),

  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.empalmistas.findMany();
  }),

  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.empalmistas.findFirst({
        where: eq(empalmistas.id, input.id),
      });

      return channel;
    }),

    update: publicProcedure.input(z.object({id:z.string(), name: z.string().min(1), dni: z.string(), birthDate : z.number().optional() })).mutation(async ({ ctx, input }) => {
      await db
        .update(empalmistas)
        .set({
          nombre: input.name,
          dni: input.dni,
          birthDate: new Date(input.birthDate ?? 0),
        })
        .where(eq(empalmistas.id, input.id));
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.delete(empalmistas).where(eq(empalmistas.id, input.id));
    }),
});

export type Empalmista = RouterOutputs["empalmistas"]["get"];