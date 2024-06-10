import { z } from "zod";
import { db, schema } from "~/server/db";
import { eq } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { generatedBarcodes } from "~/server/db/schema";

export const generatedBarcodesRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        Codigo: z.string(),
        Instalacion: z.string().optional(),
        Linked: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      await db.insert(generatedBarcodes).values(input);
    }),

  list: publicProcedure.query(async () => {
    const barcodes = await db.query.generatedBarcodes.findMany();
    barcodes.sort((a, b) => parseInt(a.Codigo ?? "0") - parseInt(b.Codigo ?? "0"));
    return barcodes;
  }),

  get: protectedProcedure
    .input(
      z.object({
        barcodeId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const barcode = await db.query.generatedBarcodes.findFirst({
        where: eq(schema.generatedBarcodes.Id, input.barcodeId),
      });
      return barcode;
    }),

  update: protectedProcedure
    .input(
      z.object({
        Id: z.string(),
        Codigo: z.string(),
        Instalacion: z.string(),
        Linked: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .update(generatedBarcodes)
        .set({
          Codigo: input.Codigo,
          Instalacion: input.Instalacion,
          Linked: input.Linked,
        })
        .where(eq(generatedBarcodes.Id, input.Id));
    }),

  delete: protectedProcedure
    .input(
      z.object({
        Id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await db.delete(generatedBarcodes).where(eq(generatedBarcodes.Id, input.Id));
    }),
});
