import {  varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const columnId = varchar("id", { length: 255 })
  .notNull()
  .primaryKey()
  .$defaultFn(() => nanoid());
