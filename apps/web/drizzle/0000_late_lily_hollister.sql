CREATE TABLE `web_CodigoBarras` (
	`id` integer PRIMARY KEY NOT NULL,
	`ProductoSeleccionado` integer,
	`Descripcion` text(256)
);
--> statement-breakpoint
CREATE TABLE `web_Cliente` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`Nombre` text(256),
	`Direccion` text(256)
);
--> statement-breakpoint
CREATE TABLE `web_document_upload` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`fileUrl` text(255) NOT NULL,
	`fileName` text(255) NOT NULL,
	`fileSize` integer NOT NULL,
	`rowsCount` integer,
	`company` integer DEFAULT false NOT NULL,
	`confirmedAt` integer,
	`documentType` text(255),
	`instalationId` text NOT NULL,
	`createdAt` integer,
	`updatedAt` integer,
	FOREIGN KEY (`instalationId`) REFERENCES `web_Instalacion`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `docuemnt_upload_userId_idx` ON `web_document_upload` (`userId`);--> statement-breakpoint
CREATE TABLE `web_Empalmista` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`Nombre` text(256),
	`DNI` text(256),
	`FechaAlta` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `web_Fotos` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`Link` text(256),
	`Instalacion` text NOT NULL,
	`lat` real,
	`long` real,
	`pasoId` text(255),
	FOREIGN KEY (`Instalacion`) REFERENCES `web_Instalacion`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `images_idx` ON `web_Fotos` (`Instalacion`);--> statement-breakpoint
CREATE TABLE `web_generatedBarcodes` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`CodigoBarras` text(255) NOT NULL,
	`Instalacion` text(255) NOT NULL,
	FOREIGN KEY (`Instalacion`) REFERENCES `web_Instalacion`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `web_Instalacion` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`Pedido` text NOT NULL,
	`Producto_pedido` text,
	`Empalmista` text,
	`Comentario` text,
	`FechaAlta` integer DEFAULT CURRENT_TIMESTAMP,
	`FechaInstal` integer,
	`FechaVeri` integer,
	`Estado` text NOT NULL,
	`BarCode` text,
	`Cliente` text NOT NULL,
	`NroLoteArticulo` text(255),
	`tipoInstalacion` text(255),
	`lat` real,
	`long` real,
	`numero` integer NOT NULL,
	FOREIGN KEY (`Pedido`) REFERENCES `web_Pedido`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Producto_pedido`) REFERENCES `web_ProductosPedidos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Empalmista`) REFERENCES `web_Empalmista`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Cliente`) REFERENCES `web_Cliente`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `instalations_idx` ON `web_Instalacion` (`Pedido`);--> statement-breakpoint
CREATE TABLE `web_paso_critico` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`detalle` text(255) NOT NULL,
	`descripcion` text(255) NOT NULL,
	`useCamera` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `web_pasoCriticoTotipoInstalacion` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`tipoInstalacion` text(255) NOT NULL,
	`pasoCritico` text(255) NOT NULL,
	`numero` integer DEFAULT 0,
	FOREIGN KEY (`tipoInstalacion`) REFERENCES `web_tipo_instalaciones`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pasoCritico`) REFERENCES `web_paso_critico`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `web_Pedido` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`FechaCreacion` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`FechaAprobacion` integer,
	`FechaEnvio` integer,
	`Estado` text NOT NULL,
	`Numero` integer DEFAULT 0,
	`Cliente` text NOT NULL,
	FOREIGN KEY (`Cliente`) REFERENCES `web_Cliente`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `web_Producto` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`Nombre` text(256) NOT NULL,
	`BarCode` text(256),
	`Descripcion` text(256),
	`tipoDeInstalacion_id` text(256) DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE `web_ProductosPedidos` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`Pedido` text NOT NULL,
	`Producto` text NOT NULL,
	`Cantidad` integer NOT NULL,
	`CantidadScaneada` integer DEFAULT 0 NOT NULL,
	`Nombre` text(256),
	`Descripcion` text(256),
	`tipo_instalacion` text(256),
	FOREIGN KEY (`Pedido`) REFERENCES `web_Pedido`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`Producto`) REFERENCES `web_Producto`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `pedidosproductos_idx` ON `web_ProductosPedidos` (`Producto`);--> statement-breakpoint
CREATE TABLE `web_response_document_uploads` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`userId` text(255) NOT NULL,
	`fileUrl` text(255) NOT NULL,
	`fileName` text(255) NOT NULL,
	`fileSize` integer NOT NULL,
	`rowsCount` integer,
	`confirmed` integer DEFAULT false NOT NULL,
	`confirmedAt` integer,
	`documentType` text(255),
	`createdAt` integer,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE `web_tipo_instalaciones` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`descripcion` text(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `web_user` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`email` text(256) NOT NULL,
	`nombre` text(256),
	`apellido` text(256),
	`rol` text(256),
	`solicitudAprobada` integer DEFAULT false,
	`adminsitrator` integer DEFAULT false,
	`picture` text,
	`client` integer DEFAULT true,
	`company` integer DEFAULT true,
	`splicer` integer DEFAULT true
);
