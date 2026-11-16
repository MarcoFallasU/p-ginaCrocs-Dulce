import { promises as fs } from "fs";
import path from "path";
import type { Catalog, StatEvent } from "../types";
import type { Repository } from "./repository";

// Solo para desarrollo y pruebas: Vercel no tiene disco persistente, ahí hay que usar otra implementación.
const DIR = path.join(process.cwd(), "data", "db");
const PUBLISHED = path.join(DIR, "catalog.json");
const DRAFT = path.join(DIR, "draft.json");
const EVENTS = path.join(DIR, "events.json");
const MAX_EVENTS = 50000;

async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw e;
  }
}

async function writeJson(file: string, data: unknown) {
  await fs.mkdir(DIR, { recursive: true });
  const tmp = file + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n");
  await fs.rename(tmp, file);
}

export const fileRepository: Repository = {
  async getPublished() {
    const c = await readJson<Catalog>(PUBLISHED);
    return c ?? { categories: [], products: [], featured: [] };
  },
  getDraft: () => readJson<Catalog>(DRAFT),
  saveDraft: (catalog) => writeJson(DRAFT, catalog),
  async discardDraft() {
    await fs.rm(DRAFT, { force: true });
  },
  async publish() {
    const draft = await readJson<Catalog>(DRAFT);
    if (!draft) return;
    await writeJson(PUBLISHED, draft);
    await fs.rm(DRAFT, { force: true });
  },
  async addEvents(events) {
    const current = (await readJson<StatEvent[]>(EVENTS)) ?? [];
    await writeJson(EVENTS, current.concat(events).slice(-MAX_EVENTS));
  },
  async listEvents(sinceMs) {
    const all = (await readJson<StatEvent[]>(EVENTS)) ?? [];
    return all.filter((e) => e.t >= sinceMs);
  },
};
