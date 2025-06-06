import {
  pgTableCreator,
  varchar,
  integer,
  boolean,
  timestamp,
  real,
  doublePrecision,
  primaryKey,
  serial,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { columnId } from "~/lib/schema/utils";
import { number } from "zod";

export const createTable = pgTableCreator((name) => `web_${name}`);



export const users = createTable("user", {
  id: columnId,
  email: varchar("email", { length: 256 }).notNull(),
  nombre: varchar("nombre", { length: 256 }),
  apellido: varchar("apellido", { length: 256 }),
  rol: varchar("rol", { length: 256 }),
  solicitudAprobada: boolean("solicitud_aprobada").default(false),
  administrator: boolean("administrator").default(false),
  picture: varchar("picture"),
  client: boolean("client").default(true),
  company: boolean("company").default(true),
  splicer: boolean("splicer").default(true),
});

export const clientes = createTable("cliente", {
  id: columnId,
  nombre: varchar("nombre", { length: 256 }),
  direccion: varchar("direccion", { length: 256 }),
});

export const empalmistas = createTable("empalmista", {
  id: columnId,
  nombre: varchar("nombre", { length: 256 }),
  dni: varchar("dni", { length: 256 }),
  birthDate: timestamp("birth_date").defaultNow(),
});

export const fotos = createTable("foto", {
  id: columnId,
  link: varchar("link", { length: 256 }),
  instalacionId: varchar("instalacion_id").notNull().references(() => instalaciones.id, { onDelete: "cascade" }),
  lat: real("lat"),
  long: real("long"),
  pasoCriticoId: integer("paso_critico_id").notNull().references(() => pasoCritico.id),
}, (foto) => ({
  imagesIndex: index("images_idx").on(foto.instalacionId),
  pasoIndex: index("paso_idx").on(foto.pasoCriticoId),
  instalacionIndex: index("instalacion_idx").on(foto.instalacionId),
}));

export const fotosRelation = relations(fotos, ({ one }) => ({
  instalacion: one(instalaciones, {
    fields: [fotos.instalacionId],
    references: [instalaciones.id],
  }),
  paso: one(pasoCritico, {
    fields: [fotos.pasoCriticoId],
    references: [pasoCritico.id],
  }),
}));

export const instalaciones = createTable("instalacion", {
  id: serial().primaryKey(),
  pedidoId: integer("pedido_id").notNull().references(() => pedidos.id),
  comentario: varchar("comentario"),
  fechaAlta: timestamp("fecha_alta").defaultNow(),
  fechaInstalacion: timestamp("fecha_instalacion"),
  fechaVerificacion: timestamp("fecha_verificacion"),
  estado: varchar("estado", {enum:["Generada","Pendiente", "En progreso","Instalada", "Rechazada", "Verificada", "Aprobada", "Completada"]}).notNull(),
  codigoDeBarras: varchar("codigo_de_barras"),
  nroLoteArticulo: varchar("nro_lote_articulo", { length: 255 }),
  //Lol tiene coordenadas
  lat: real("lat"),
  long: real("long"),
  //
  productoPedidoId: varchar("producto_pedido_id").references(() => productosPedidos.id),
  empalmistaId: varchar("empalmista_id").references(() => empalmistas.id),
  clienteId: varchar("cliente_id").notNull().references(() => clientes.id),
  tipoInstalacionId: integer("tipo_instalacion_id").references(() => tipoInstalaciones.id),
}, (instalacion) => ({
  instalacionIndex: index("instalacion_idx").on(instalacion.id),
  pedidoIndex: index("pedido_idx").on(instalacion.pedidoId),
  empalmistaIndex: index("empalmista_idx").on(instalacion.empalmistaId),
  clienteIndex: index("cliente_idx").on(instalacion.clienteId),
}));

export const instalacionesRelations = relations(instalaciones, ({ one, many }) => ({
  pedido: one(pedidos, {
    fields: [instalaciones.pedidoId],
    references: [pedidos.id],
  }),
  empalmista: one(empalmistas, {
    fields: [instalaciones.empalmistaId],
    references: [empalmistas.id],
  }),
  cliente: one(clientes, {
    fields: [instalaciones.clienteId],
    references: [clientes.id],
  }),
  tipoInstalacion: one(tipoInstalaciones, {
    fields: [instalaciones.id],
    references: [tipoInstalaciones.id],
  }),
  productoPedido: one(productosPedidos, {
    fields: [instalaciones.productoPedidoId],
    references: [productosPedidos.id],
  }),
  fotos: many(fotos),
  documentos: many(documentUploads),
}));

export const pedidos = createTable("pedido", {
  id: serial().primaryKey(),
  fechaCreacion: timestamp("fecha_creacion").defaultNow().notNull(),
  fechaAprobacion: timestamp("fecha_aprobacion"),
  fechaEnvio: timestamp("fecha_envio"),
  estado: varchar("estado", {enum:["Generado","Pendiente", "Enviado","Aprobado"]}).notNull(),
  numero: integer("numero").default(0),
  clienteId: varchar("cliente_id").notNull().references(() => clientes.id),
}, (pedido) => ({
  pedidoIndex: index("pedido_idx").on(pedido.id),
  clienteIndex: index("cliente_idx").on(pedido.clienteId),
}));

export const pedidosRelations = relations(pedidos, ({ one, many }) => ({
  cliente: one(clientes, {
    fields: [pedidos.clienteId],
    references: [clientes.id],
  }),
  productosPedidos: many(productosPedidos),
}));

export const productosPedidos = createTable("producto_pedido", {
  id: columnId,
  cantidad: integer("cantidad").notNull(),
  cantidadScaneada: integer("cantidad_scaneada").notNull().default(0),
  nombre: varchar("nombre", { length: 256 }),
  descripcion: varchar("descripcion", { length: 256 }),
  tipoInstalacion: integer("tipo_instalacion").references(() => tipoInstalaciones.id),
  pedidoId: integer("pedido_id").notNull().references(() => pedidos.id),
  productoId: varchar("producto_id").notNull().references(() => productos.id),
}, (productoPedido) => ({
  productoPedidoIndex: index("producto_pedido_idx").on(productoPedido.productoId),
  pedidoIndex: index("pedido_idx").on(productoPedido.pedidoId),
  productoIndex: index("producto_idx").on(productoPedido.productoId),
}));


export const productosPedidosRelations = relations(productosPedidos, ({ one }) => ({
  pedido: one(pedidos, {
    fields: [productosPedidos.pedidoId],
    references: [pedidos.id],
  }),
  producto: one(productos, {
    fields: [productosPedidos.productoId],
    references: [productos.id],
  }),
  tipoInstalacion: one(tipoInstalaciones, {
    fields: [productosPedidos.id],
    references: [tipoInstalaciones.id],
  }),
}));

export const productos = createTable("producto", {
  id: columnId,
  nombre: varchar("nombre", { length: 256 }).notNull(),
  codigoDeBarras: varchar("codigo_de_barras", { length: 256 }),
  descripcion: varchar("descripcion", { length: 256 }),
  createdAt: timestamp("created_at"),
  tipoDeInstalacionId: integer("tipo_de_instalacion_id").references(() => tipoInstalaciones.id),
}, (producto) => ({
  productoIndex: index("producto_idx").on(producto.id),
}));

export const productosRelations = relations(productos, ({ one }) => ({
  tipoDeInstalacion: one(tipoInstalaciones, {
    fields: [productos.tipoDeInstalacionId],
    references: [tipoInstalaciones.id],
  }),
}));

// 📑 Document Uploads
export const documentUploads = createTable("document_upload", {
  id: columnId,
  userId: varchar("user_id", { length: 255 }).notNull(),
  fileUrl: varchar("file_url", { length: 255 }).notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileSize: integer("file_size").notNull(),
  rowsCount: integer("rows_count"),
  confirmed: boolean("confirmed").notNull().default(false),
  confirmedAt: timestamp("confirmed_at"),
  documentType: varchar("document_type", { length: 255 }).$type<"rec" | null>(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  instalacionId: varchar("instalacion_id").notNull().references(() => instalaciones.id),
}, (documentUpload) => ({
  userIdIdx: index("document_upload_user_id_idx").on(documentUpload.userId),
  instalacionIdIdx: index("document_upload_instalacion_id_idx").on(documentUpload.instalacionId),
  
}));

export const documentUploadsRelations = relations(documentUploads, ({ one }) => ({
  instalacion: one(instalaciones, {
    fields: [documentUploads.instalacionId],
    references: [instalaciones.id],
  }),
}));

export const responseDocumentUploads = createTable("response_document_upload", {
  id: columnId,
  userId: varchar("user_id", { length: 255 }).notNull(),
  fileUrl: varchar("file_url", { length: 255 }).notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileSize: integer("file_size").notNull(),
  rowsCount: integer("rows_count"),
  confirmed: boolean("confirmed").notNull().default(false),
  confirmedAt: timestamp("confirmed_at"),
  documentType: varchar("document_type", { length: 255 }).$type<"txt" | null>(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const tipoInstalaciones = createTable("tipo_instalacion", {
  id: serial().primaryKey(),
  descripcion: varchar("descripcion", { length: 255 }).notNull(),
});

export const tipoInstalacionesRelations = relations(tipoInstalaciones, ({ many }) => ({
  pasoCriticoTotipoInstalacion: many(pasoCriticoTotipoInstalacion),
}));

export const pasoCritico = createTable("paso_critico", {
  id: serial().primaryKey(),
  detalle: varchar("detalle", { length: 255 }).notNull(),
  descripcion: varchar("descripcion", { length: 255 }).notNull(),
  useCamera: boolean("use_camera").default(false),
});

export const pasoCriticoRelations = relations(pasoCritico, ({ many }) => ({
  pasoCriticoTotipoInstalacion: many(pasoCriticoTotipoInstalacion),
}));

// 🛠️ Paso Crítico a Tipo Instalación
export const pasoCriticoTotipoInstalacion = createTable("paso_critico_tipo_instalacion", {
  id: columnId,
  tipoInstalacionId: integer("tipo_instalacion_id").notNull().references(() => tipoInstalaciones.id),
  pasoCriticoId: integer("paso_critico_id").notNull().references(() => pasoCritico.id),
  numero: integer("numero").default(0),
});

export const pasoCriticoTotipoInstalacionRelations = relations(pasoCriticoTotipoInstalacion, ({ one }) => ({
  tipoInstalacion: one(tipoInstalaciones, {
    fields: [pasoCriticoTotipoInstalacion.tipoInstalacionId],
    references: [tipoInstalaciones.id],
  }),
  pasoCritico: one(pasoCritico, {
    fields: [pasoCriticoTotipoInstalacion.pasoCriticoId],
    references: [pasoCritico.id],
  }),
}));
