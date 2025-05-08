import { z } from "zod";
import { db } from "~/server/db";
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { empalmistas } from "~/server/db/schema";
import { RouterOutputs } from "../root";

export const empalmistasRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string().min(1), DNI: z.string(), BirthDate : z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(empalmistas).values({
        Nombre: input.name,
        DNI: input.DNI,
        BirthDate: new Date(input.BirthDate ?? 0),
      });
    }),

  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.empalmistas.findMany();
  }),

  get: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const channel = await db.query.empalmistas.findFirst({
        where: eq(empalmistas.Id, input.Id),
      });

      return channel;
    }),

    update: publicProcedure.input(z.object({Id:z.string(), name: z.string().min(1), DNI: z.string(), BirthDate : z.number().optional() })).mutation(async ({ ctx, input }) => {
      await db
        .update(empalmistas)
        .set({
          Nombre: input.name,
          DNI: input.DNI,
          BirthDate: new Date(input.BirthDate ?? 0),
        })
        .where(eq(empalmistas.Id, input.Id));
    }),

  delete: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db.delete(empalmistas).where(eq(empalmistas.Id, input.Id));
    }),
});

export type Empalmista = RouterOutputs["empalmistas"]["get"];