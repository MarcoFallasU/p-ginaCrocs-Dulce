import { fileRepository } from "./fileRepository";
import { createNeonRepository } from "./neonRepository";
import type { Repository } from "./repository";

/**
 * Con DATABASE_URL (Neon Postgres) se usa la base de datos; sin ella, los archivos JSON de data/db
 * para poder desarrollar sin conexión. En Vercel la variable es obligatoria: no hay disco persistente.
 */
export const repo: Repository = process.env.DATABASE_URL ? createNeonRepository(process.env.DATABASE_URL) : fileRepository;
