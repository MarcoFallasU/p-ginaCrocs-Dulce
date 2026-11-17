import { neon } from "@neondatabase/serverless";
import type { Catalog, StatEvent } from "../types";
import { fileRepository } from "./fileRepository";
import type { Repository } from "./repository";

/**
 * Persistencia en Neon Postgres (variable DATABASE_URL).
 * - `catalogs`: una fila por versión ('published' y 'draft') con el catálogo completo en JSONB,
 *   porque el admin siempre lee y guarda el catálogo entero.
 * - `events`: un evento anónimo por fila, para las estadísticas.
 * Las tablas se crean solas la primera vez (no hay migraciones).
 */
export function createNeonRepository(url: string): Repository {
  const sql = neon(url);
  let schema: Promise<void> | null = null;

  // Crea las tablas una vez por proceso y siembra el catálogo publicado si la base está vacía
  const ready = () =>
    (schema ??= (async () => {
      await sql`CREATE TABLE IF NOT EXISTS catalogs (kind text PRIMARY KEY, data jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`;
      await sql`CREATE TABLE IF NOT EXISTS events (id bigserial PRIMARY KEY, t bigint NOT NULL, type text NOT NULL, product_id text, attrs jsonb, detail text)`;
      await sql`CREATE INDEX IF NOT EXISTS events_t_idx ON events (t)`;
      const rows = await sql`SELECT 1 FROM catalogs WHERE kind = 'published'`;
      if (rows.length === 0) {
        const seed = await fileRepository.getPublished(); // data/db/catalog.json del repositorio
        await sql`INSERT INTO catalogs (kind, data) VALUES ('published', ${JSON.stringify(seed)}::jsonb) ON CONFLICT (kind) DO NOTHING`;
      }
    })().catch((e) => {
      schema = null; // reintentar en la siguiente petición
      throw e;
    }));

  const read = async (kind: "published" | "draft"): Promise<Catalog | null> => {
    await ready();
    const rows = await sql`SELECT data FROM catalogs WHERE kind = ${kind}`;
    return rows.length ? (rows[0].data as Catalog) : null;
  };

  const write = async (kind: "published" | "draft", catalog: Catalog) => {
    await ready();
    await sql`INSERT INTO catalogs (kind, data) VALUES (${kind}, ${JSON.stringify(catalog)}::jsonb)
              ON CONFLICT (kind) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`;
  };

  return {
    async getPublished() {
      return (await read("published")) ?? { categories: [], products: [], featured: [] };
    },
    getDraft: () => read("draft"),
    saveDraft: (catalog) => write("draft", catalog),
    async discardDraft() {
      await ready();
      await sql`DELETE FROM catalogs WHERE kind = 'draft'`;
    },
    async publish() {
      await ready();
      // Una sola transacción: el borrador pasa a publicado y se elimina
      await sql.transaction([
        sql`INSERT INTO catalogs (kind, data)
            SELECT 'published', data FROM catalogs WHERE kind = 'draft'
            ON CONFLICT (kind) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
        sql`DELETE FROM catalogs WHERE kind = 'draft'`,
      ]);
    },
    async addEvents(events: StatEvent[]) {
      await ready();
      for (const e of events) {
        await sql`INSERT INTO events (t, type, product_id, attrs, detail)
                  VALUES (${e.t}, ${e.type}, ${e.productId ?? null}, ${e.attrs ? JSON.stringify(e.attrs) : null}::jsonb, ${e.detail ?? null})`;
      }
    },
    async listEvents(sinceMs: number) {
      await ready();
      const rows = await sql`SELECT t, type, product_id, attrs, detail FROM events WHERE t >= ${sinceMs} ORDER BY t`;
      return rows.map((r) => ({
        t: Number(r.t),
        type: r.type,
        ...(r.product_id ? { productId: r.product_id } : {}),
        ...(r.attrs ? { attrs: r.attrs } : {}),
        ...(r.detail ? { detail: r.detail } : {}),
      })) as StatEvent[];
    },
  };
}
