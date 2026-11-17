import { fileRepository } from "./fileRepository";
import { createNeonRepository } from "./neonRepository";
import type { Repository } from "./repository";

const MISSING_DB = "Falta la base de datos: conecta Neon en Vercel (Storage) para que exista DATABASE_URL y vuelve a desplegar.";

/**
 * Con DATABASE_URL (Neon Postgres) se usa la base de datos; sin ella, los archivos JSON de data/db
 * para poder desarrollar sin conexión. En producción sin base solo se puede leer el catálogo incluido en el
 * repositorio: Vercel no tiene disco persistente, así que guardar falla con un mensaje claro.
 */
function chooseRepository(): Repository {
  if (process.env.DATABASE_URL) return createNeonRepository(process.env.DATABASE_URL);
  if (process.env.NODE_ENV !== "production") return fileRepository;
  const fail = async () => {
    throw new Error(MISSING_DB);
  };
  return {
    getPublished: fileRepository.getPublished,
    getDraft: async () => null,
    saveDraft: fail,
    discardDraft: fail,
    publish: fail,
    addEvents: async () => {},
    listEvents: async () => [],
  };
}

export const repo: Repository = chooseRepository();
