import { z } from "zod";
import { db, schema } from "~/server/db";
import { asc, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const testRouter = createTRPCRouter({
    DeleteData: publicProcedure.mutation(async ({ ctx }) => {
        await db.transaction(async (tx) => {
            // Primero elimina las tablas dependientes
            await tx.delete(schema.documentUploads).run(); // Si tiene relación con alguna otra
            await tx.delete(schema.fotos).run(); // Relacionada con productos, etc.
            await tx.delete(schema.instalaciones).run();
            await tx.delete(schema.productosPedidos).run(); // Dependiente de pedidos
            await tx.delete(schema.pedidos).run(); // Eliminar registros en pedidos
            await tx.delete(schema.productos).run(); // Relacionado con productosPedidos, etc.
            // Ahora elimina las tablas principales que no tienen dependencias
            await tx.delete(schema.empalmistas).run(); // Eliminar primero las dependientes
            await tx.delete(schema.clientes).run(); // De último los clientes
        });
    })
  })
