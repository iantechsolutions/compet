// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { Description } from "@radix-ui/react-dialog";
import { isNotNull, relations, sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { number, string, z } from "zod";
/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `web_${name}`);

export function createId() {
  return nanoid();
}

export const users = createTable(
  "user",
  {
    Id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    email: text("email", { length: 256 }).unique().notNull(),
    name: text("name", { length: 256 }),
    picture: text("picture"),
    client: int("client", { mode: "boolean" }).default(false),
    company: int("company", { mode: "boolean" }).default(false),
    splicer: int("splicer", { mode: "boolean" }).default(false),
  },
  (example) => ({
    userIndex: index("user_data_idx").on(example.name),
  })
);

// export const posts = createTable(
//     'post',
//     {
//         Id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
//         name: text('name', { length: 256 }),
//         createdAt: int('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
//         updatedAt: int('updatedAt', { mode: 'timestamp' }),
//     },
//     (example) => ({
//         nameIndex: index('name_idx').on(example.name),
//     }),
// )

export const clientes = createTable(
  "Cliente",
  {
    Id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    Nombre: text("Nombre", { length: 256 }),
    Direccion: text("Direccion", { length: 256 }),
  },
  (example) => ({
    nameIndex: index("clients_idx").on(example.Nombre),
  })
);

export const empalmistas = createTable(
  "Empalmista",
  {
    Id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    Nombre: text("Nombre", { length: 256 }),
  },
  (example) => ({
    splicerIndex: index("splicers_idx").on(example.Nombre),
  })
);

export const fotos = createTable(
  "Fotos",
  {
    Id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    Link: text("Link", { length: 256 }),
    Instalacion: int("Instalacion")
      .notNull()
      .references(() => instalaciones.Id),
  },
  (example) => ({
    imagesIndex: index("images_idx").on(example.Instalacion),
  })
);

export const fotosRelation = relations(fotos, ({ one }) => ({
  post: one(instalaciones, {
    fields: [fotos.Instalacion],
    references: [instalaciones.Id],
  }),
}));

export const instalaciones = createTable(
  "Instalacion",
  {
    Id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    Pedido: int("Pedido")
      .notNull()
      .references(() => pedidos.Id),
    Empalmista: int("Empalmista").references(() => empalmistas.Id),
    Fecha_de_alta: int("FechaAlta", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    Fecha_de_instalacion: int("FechaInstal", { mode: "timestamp" }),
    Fecha_de_verificacion: int("FechaVeri", { mode: "timestamp" }),
    Estado: int("Estado").notNull(),
    Cliente: int("Cliente")
      .notNull()
      .references(() => clientes.Id),
    tipoInstalacion: int("tipoInstalacion").notNull(),
  },
  (example) => ({
    instalationsIndex: index("instalations_idx").on(example.Pedido),
  })
);

export const instalacionesRelations = relations(
  instalaciones,
  ({ one, many }) => ({
    pedido: one(pedidos, {
      fields: [instalaciones.Pedido],
      references: [pedidos.Id],
    }),
    empalmista: one(empalmistas, {
      fields: [instalaciones.Empalmista],
      references: [empalmistas.Id],
    }),
    cliente: one(clientes, {
      fields: [instalaciones.Cliente],
      references: [clientes.Id],
    }),
    fotos: many(fotos),
    documentos: many(documentUploads),
    tipoInstalaciones: many(tipoInstalaciones),
  })
);

export const pedidos = createTable(
  "Pedido",
  {
    Id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    Fecha_de_creacion: int("FechaCreacion", { mode: "timestamp" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    Fecha_de_aprobacion: int("FechaAprobacion", { mode: "timestamp" }),
    Fecha_de_envio: int("FechaEnvio", { mode: "timestamp" }),
    Estado: text("Estado").notNull(),
    Cliente: int("Cliente")
      .notNull()
      .references(() => clientes.Id),
  },
  (example) => ({
    instalationsIndex: index("pedidos_idx").on(example.Id),
  })
);

export const pedidosRelations = relations(pedidos, ({ one, many }) => ({
  cliente: one(clientes, {
    fields: [pedidos.Cliente],
    references: [clientes.Id],
  }),
  productos: many(productosPedidos),
}));

export const productosPedidos = createTable(
  "ProductosPedidos",
  {
    Id: int("id").notNull().primaryKey(),
    Pedido: int("Pedido")
      .notNull()
      .references(() => pedidos.Id),
    Producto: int("Producto")
      .notNull()
      .references(() => productos.Id),
    Cantidad: int("Cantidad").notNull(),
    Nombre: text("Nombre", { length: 256 }),
    Descripcion: text("Descripcion", { length: 256 }),
    Codigo_de_barras: text("BarCode", { length: 256 }),
  },
  (example) => ({
    instalationsIndex: index("pedidosproductos_idx").on(example.Producto),
  })
);

export const productosPedidosRelation = relations(
  productosPedidos,
  ({ one }) => ({
    pedido: one(pedidos, {
      fields: [productosPedidos.Pedido],
      references: [pedidos.Id],
    }),
    producto: one(productos, {
      fields: [productosPedidos.Producto],
      references: [productos.Id],
    }),
  })
);

export const productos = createTable(
  "Producto",
  {
    Id: int("id").notNull().primaryKey(),
    Nombre: text("Nombre", { length: 256 }).notNull(),
    Codigo_de_barras: text("BarCode", { length: 256 }),
    Descripcion: text("Descripcion", { length: 256 }),
  },
  (example) => ({
    productsIndex: index("products_idx").on(example.Nombre),
  })
);

export const documentUploads = createTable(
  "document_upload",
  {
    Id: int("id").notNull().primaryKey(),
    userId: text("userId", { length: 255 }).notNull(),
    fileUrl: text("fileUrl", { length: 255 }).notNull(),
    fileName: text("fileName", { length: 255 }).notNull(),
    fileSize: int("fileSize").notNull(),
    rowsCount: int("rowsCount"),

    confirmed: int("company", { mode: "boolean" }).notNull().default(false),
    confirmedAt: int("confirmedAt", { mode: "timestamp" }),

    documentType: text("documentType", { length: 255 }).$type<"rec" | null>(),

    instalationId: text("instalationId")
      .notNull()
      .references(() => instalaciones.Id),

    createdAt: int("createdAt", { mode: "timestamp" }),
    updatedAt: int("updatedAt", { mode: "timestamp" }),
  },
  (example) => ({
    userIdIdx: index("docuemnt_upload_userId_idx").on(example.userId),
  })
);

export const documentUploadsRelations = relations(
  documentUploads,
  ({ one }) => ({
    instalacion: one(instalaciones, {
      fields: [documentUploads.instalationId],
      references: [instalaciones.Id],
    }),
  })
);

export const responseDocumentUploads = createTable(
  "response_document_uploads",
  {
    Id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    userId: text("userId", { length: 255 }).notNull(),
    fileUrl: text("fileUrl", { length: 255 }).notNull(),
    fileName: text("fileName", { length: 255 }).notNull(),
    fileSize: int("fileSize").notNull(),
    rowsCount: int("rowsCount"),

    confirmed: int("confirmed", { mode: "boolean" }).notNull().default(false),
    confirmedAt: int("confirmedAt", { mode: "timestamp" }),

    documentType: text("documentType", { length: 255 }).$type<"txt" | null>(),

    createdAt: int("createdAt", { mode: "timestamp" }),
    updatedAt: int("updatedAt", { mode: "timestamp" }),
  }
);

export const tipoInstalaciones = createTable("tipo_instalaciones", {
  Id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  pasoCritico: int("pasoCritico").notNull(),
  description: text("descripcion", { length: 255 }).notNull(),
});

export const tipoInstalacionesRelations = relations(
  tipoInstalaciones,
  ({ many }) => ({
    pasoCritico: many(pasoCritico),
  })
);

export const pasoCritico = createTable("paso_critico", {
  Id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  detalle: text("detalle", { length: 255 }).notNull(),
  description: text("descripcion", { length: 255 }).notNull(),
  useCamera: int("useCamera", { mode: "boolean" }).default(false),
});

function createInsertSchema(Clientes: any) {
  throw new Error("Function not implemented.");
}
