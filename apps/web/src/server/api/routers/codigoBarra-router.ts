import { z } from "zod";
import { db } from "~/server/db";
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { CodigoBarras } from "~/server/db/schema";
import { Description } from "@radix-ui/react-dialog";

export const CodigoBarrasRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        descripcion: z.string(),
        productoSeleccionado: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(CodigoBarras).values({
        descripcion: input.descripcion,
        productoSeleccionado: input.productoSeleccionado,
      });
    }),

  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.CodigoBarras.findMany();
  }),

  get: protectedProcedure
    .input(
      z.object({
        Id: z.number(),
        descripcion: z.string().min(1),
        productoSeleccionado: z.number(),
      })
    )
    .query(async ({ input }) => {
      const channel = await db.query.clientes.findFirst({
        where: eq(CodigoBarras.Id, input.Id),
      });

      return channel;
    }),

  update: protectedProcedure
    .input(
      z.object({
        Id: z.number(),
        descripcion: z.string(),
        productoSeleccionado: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(CodigoBarras)
        .set({
          descripcion: input.descripcion,
          productoSeleccionado: input.productoSeleccionado,
        })
        .where(eq(CodigoBarras.Id, input.Id));
    }),

  delete: protectedProcedure
    .input(
      z.object({
        Id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await db.delete(CodigoBarras).where(eq(CodigoBarras.Id, input.Id));
    }),
});
