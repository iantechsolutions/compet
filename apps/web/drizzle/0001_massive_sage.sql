PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_web_generatedBarcodes` (
	`id` text(255) PRIMARY KEY NOT NULL,
	`CodigoBarras` text(255) NOT NULL,
	`Instalacion` text(255)
);
--> statement-breakpoint
INSERT INTO `__new_web_generatedBarcodes`("id", "CodigoBarras", "Instalacion") SELECT "id", "CodigoBarras", "Instalacion" FROM `web_generatedBarcodes`;--> statement-breakpoint
DROP TABLE `web_generatedBarcodes`;--> statement-breakpoint
ALTER TABLE `__new_web_generatedBarcodes` RENAME TO `web_generatedBarcodes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;