// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { Description } from "@radix-ui/react-dialog";
import { isNotNull, relations, sql } from "drizzle-orm";

import { index, int, real, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";
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
    Id: text("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$default(()=>createId()),
    email: text("email", { length: 256 }).unique().notNull(),
    nombre: text("nombre", { length: 256 }),
    apellido: text("apellido", { length: 256 }),
    rol: text("rol", { length: 256 }),
    solicitudAprobada: int("solicitudAprobada", { mode: "boolean" }).default(false),
    administrator: int("adminsitrator", { mode: "boolean" }).default(false),
    picture: text("picture"),
    client: int("client", { mode: "boolean" }).default(true),
    company: int("company", { mode: "boolean" }).default(true),
    splicer: int("splicer", { mode: "boolean" }).default(true),
  },
  (example) => ({
    userIndex: index("user_data_idx").on(example.nombre),
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
    'Cliente',
    {
        Id: text("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$default(()=>createId()),
        Nombre: text('Nombre', { length: 256 }),
        Direccion: text('Direccion', { length: 256 }),
    }
)



export const empalmistas = createTable(
    'Empalmista',
    {
        Id: text("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$default(()=>createId()),
        Nombre: text('Nombre', { length: 256 }),
        DNI: text('DNI', { length: 256 }),
        BirthDate: int('FechaAlta', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
    }
)

export const fotos = createTable(
    'Fotos',
    {
        Id: text("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$default(()=>createId()),
        Link: text('Link', { length: 256 }),
        Instalacion: text('Instalacion').notNull().references(()=>instalaciones.Id),
        lat: real('lat'),
        long: real('long'),
    },
    (example) => ({
        imagesIndex: index('images_idx').on(example.Instalacion),
    }),
)

export const fotosRelation = relations(fotos, ({ one }) => ({
  post: one(instalaciones, {
    fields: [fotos.Instalacion],
    references: [instalaciones.Id],
  }),
}));

export const instalaciones = createTable(
    'Instalacion',
    {
        Id: text("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$default(()=>createId()),
        Pedido: text('Pedido').notNull().references(()=>pedidos.Id),
        Producto_pedido: text('Producto_pedido').references(()=>productosPedidos.Id),
        Empalmista: text('Empalmista').references(()=>empalmistas.Id),
        Comentario: text('Comentario'),
        Fecha_de_alta: int('FechaAlta', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
        Fecha_de_instalacion:int('FechaInstal', { mode: 'timestamp' }),
        Fecha_de_verificacion:int('FechaVeri', { mode: 'timestamp' }),
        Estado: text('Estado').notNull(),
        Codigo_de_barras: text("BarCode"),
        Cliente: text('Cliente').notNull().references(()=>clientes.Id),
        NroLoteArticulo: text('NroLoteArticulo', { length: 255 }),
        tipoInstalacionId: text('tipoInstalacion',{ length: 255 }),
        lat: real('lat'),
        long: real('long'),
    },
    (example) => ({
        instalationsIndex: index('instalations_idx').on(example.Pedido),
    }), 
)

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
    tipoInstalacion: one(tipoInstalaciones,{
        fields: [instalaciones.tipoInstalacionId],
        references: [tipoInstalaciones.id],
    }),
    productoPedido: one(productosPedidos, {
      fields: [instalaciones.Producto_pedido],
      references: [productosPedidos.Id],
    }),
    fotos: many(fotos),
    documentos: many(documentUploads),
    
  }));
  


  export const pedidos = createTable(
    'Pedido',
    {
        Id: text("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$default(()=>createId()),
        Fecha_de_creacion: int('FechaCreacion', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
        Fecha_de_aprobacion: int('FechaAprobacion', { mode: 'timestamp' }),
        Fecha_de_envio:int('FechaEnvio', { mode: 'timestamp' }),
        Estado: text('Estado').notNull(),
        Cliente: text('Cliente').notNull().references(()=>clientes.Id)
    }
)

export const pedidosRelations = relations(pedidos, ({ one, many }) => ({
  cliente: one(clientes, {
    fields: [pedidos.Cliente],
    references: [clientes.Id],
  }),
  productos: many(productosPedidos),
}));

export const productosPedidos = createTable(
    'ProductosPedidos',
    {
        Id: text("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$default(()=>createId()),
        Pedido: text('Pedido').notNull().references(()=>pedidos.Id),
        Producto: text('Producto').notNull().references(()=>productos.Id),
        Cantidad: int('Cantidad').notNull(),
        CantidadScaneada: int('CantidadScaneada').notNull().default(0),
        Nombre: text('Nombre', { length: 256 }),
        Descripcion: text('Descripcion',{length: 256}),
        tipoInstalacion: text('tipo_instalacion', { length: 256 }),
    },
    (example) => ({
        instalationsIndex: index('pedidosproductos_idx').on(example.Producto),
    }),
)

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
    'Producto',
    {
        Id: text("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$default(()=>createId()),
        Nombre: text('Nombre', { length: 256 }).notNull(),
        Codigo_de_barras: text('BarCode', { length: 256 }),
        Descripcion: text('Descripcion',{length: 256}),
        tipoDeInstalacion_id: text('tipoDeInstalacion_id',{length: 256}).references(()=>tipoInstalaciones.id),
    }
)

export const productosRelation = relations(productos, ({ one }) => ({
    tipoDeInstalacion: one(tipoInstalaciones, {
      fields: [productos.tipoDeInstalacion_id],
      references: [tipoInstalaciones.id],
    }),
      
}));



export const documentUploads = createTable(
    "document_upload",
    {
    id: text("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$default(()=>createId().toLowerCase()),
      userId: text("userId", { length: 255 }).notNull(),
      fileUrl: text("fileUrl", { length: 255 }).notNull(),
      fileName: text("fileName", { length: 255 }).notNull(),
      fileSize: int("fileSize").notNull(),
      rowsCount: int("rowsCount"),
  
      confirmed: int('company', { mode: 'boolean' }).notNull().default(false),
      confirmedAt: int('confirmedAt', { mode: 'timestamp' }),
  
      documentType: text("documentType", { length: 255 }).$type<
        "rec" | null
      >(),
  
      instalationId: text("instalationId")
        .notNull()
        .references(() => instalaciones.Id),
  
      createdAt : int('createdAt', { mode: 'timestamp' }),
      updatedAt: int('updatedAt', { mode: 'timestamp' }),
    },
    (example) => ({
      userIdIdx: index("docuemnt_upload_userId_idx").on(example.userId),
    }),
  );
  
    export const documentUploadsRelations = relations(documentUploads, ({ one }) => ({
        instalacion: one(instalaciones, {
          fields: [documentUploads.instalationId],
          references: [instalaciones.Id],
        }),
          
    }));
  
  export const responseDocumentUploads = createTable("response_document_uploads", {
    Id: text("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$default(()=>createId()),
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
    id: text("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$default(()=>createId()),
    description: text("descripcion", { length: 255 }).notNull(),
});

export const tipoInstalacionesRelations = relations(tipoInstalaciones, ({ many }) => ({
    pasoCriticoTotipoInstalacion: many(pasoCriticoTotipoInstalacion)
  }));


export const pasoCritico = createTable("paso_critico", {
    id: text("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$default(()=>createId()),
    detalle: text("detalle", { length: 255 }).notNull(),
    description: text("descripcion", { length: 255 }).notNull(),
    useCamera: int('useCamera', { mode: 'boolean' }).default(false),
});

export const pasoCriticoRelations = relations(pasoCritico, ({ many }) => ({
    pasoCriticoTotipoInstalacion: many(pasoCriticoTotipoInstalacion)
})
);

export const pasoCriticoTotipoInstalacion = createTable("pasoCriticoTotipoInstalacion", {
    id: text("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$default(()=>createId()),
    tipoInstalacion: text("tipoInstalacion", { length: 255 }).notNull().references(()=>tipoInstalaciones.id),
    pasoCritico: text("pasoCritico", { length: 255 }).notNull().references(()=>pasoCritico.id),
});

export const pasoCriticoTotipoInstalacionRelations = relations(pasoCriticoTotipoInstalacion, ({ one }) => ({
    tipoInstalacion: one(tipoInstalaciones,{
        fields: [pasoCriticoTotipoInstalacion.tipoInstalacion],
        references: [tipoInstalaciones.id],
    }),
    pasoCriticoData: one(pasoCritico,{
        fields: [pasoCriticoTotipoInstalacion.pasoCritico],
        references: [pasoCritico.id],
    }),
})
);


function createInsertSchema(Clientes: any) {
  throw new Error("Function not implemented.");
}

export const CodigoBarras = createTable("CodigoBarras", {
  Id: int("id").notNull().primaryKey(),
  productoSeleccionado: int("ProductoSeleccionado"),
  descripcion: text("Descripcion", { length: 256 }),
});

export const CodigoBarrassRelation = relations(CodigoBarras, ({ one }) => ({
  CodigoBarras: one(productos),
}));

export const generatedBarcodes = createTable(
  'generatedBarcodes',
  {
      Id: text("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$default(()=>createId()),
      Codigo: text('Codigo', { length: 256 }),
      Instalacion: text('Instalacion'),
      Linked: int("linked", { mode: "boolean" }).default(true),
  }
)
