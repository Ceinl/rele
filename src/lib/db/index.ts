import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import path from "path";

let client: Client | undefined;
let db: ReturnType<typeof drizzle> | undefined;

export function getDb() {
  if (!db) {
    const url = process.env.TURSO_DATABASE_URL || `file:${path.join(process.cwd(), "data", "rele.db")}`;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    client = createClient({
      url,
      authToken: authToken || undefined,
    });
    db = drizzle(client, { schema });
  }
  return db;
}

export { schema };