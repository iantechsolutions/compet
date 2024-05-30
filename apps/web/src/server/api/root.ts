import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import {
  createCallerFactory,
  createTRPCRouter,
  sellerProcedure,
} from "~/server/api/trpc";
import { usersRouter } from "./routers/users";
import { productosRouter } from "./routers/productos";
import { clientesRouter } from "./routers/clientes";
import { empalmistasRouter } from "./routers/empalmistas";
import { fotosRouter } from "./routers/fotos";
import { instalacionesRouter } from "./routers/instalaciones";
import { pedidosRouter } from "./routers/pedidos";
import { productosPedidosRouter } from "./routers/productospedidos";
import { pasoCriticoRouter } from "./routers/pasoCritico-router";
import { tipoInstalacionesRouter } from "./routers/tipoInstalaciones-router";
import { CodigoBarras } from "../db/schema";
import { CodigoBarrasRouter } from "./routers/codigoBarra-router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  productos: productosRouter,
  clientes: clientesRouter,
  empalmistas: empalmistasRouter,
  fotos: fotosRouter,
  instalaciones: instalacionesRouter,
  productosPedidos: productosPedidosRouter,
  pedidos: pedidosRouter,
  pasoCritico: pasoCriticoRouter,
  tipoInstalaciones: tipoInstalacionesRouter,
  CodigoBarras: CodigoBarrasRouter,
  sellCheck: sellerProcedure.query(({ ctx }) => {
    // falla si no es seller
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
