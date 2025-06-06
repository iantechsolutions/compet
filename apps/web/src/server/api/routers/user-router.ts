import { z } from "zod";
import { db, schema } from "~/server/db";
import { asc, eq } from "drizzle-orm";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import { varchar } from "drizzle-orm/mysql-core";

export const usersRouterList = createTRPCRouter({

  list: publicProcedure.query(async ({}) => {
    const users = await db.query.users.findMany();
    return users;
  }),
    update: publicProcedure.input(z.object({id:z.string(), email: z.string(),
        nombre: z.string(), apellido: z.string(),rol: z.string(),
        solicitudAprobada: z.boolean(), 
        administrator: z.boolean(), picture: z.string(),
        client: z.boolean(),company: z.boolean(), splicer: z.boolean(), })).mutation(async ({ ctx, input }) => {
      await db
        .update(users)
        .set({
        id: input.id,
        email: input.email,
        nombre: input.nombre,
        apellido: input.apellido,
        rol: input.rol,
        solicitudAprobada: input.solicitudAprobada,
        administrator: input.administrator,
        picture: input.picture,
        client: input.client,
        company: input.company,
        splicer: input.splicer,
        })
        .where(eq(users.id, input.id));
    }),
    create: protectedProcedure
    .input(z.object({ id:z.string(),email: z.string(),
        nombre: z.string(), apellido: z.string(),rol: z.string(),
        solicitudAprobada: z.boolean(), 
        administrator: z.boolean(), picture: z.string(),
        client: z.boolean(),company: z.boolean(), splicer: z.boolean(), }))
    .mutation(async ({ input }) => {
      await db.insert(users).values(input);
    }),
});
