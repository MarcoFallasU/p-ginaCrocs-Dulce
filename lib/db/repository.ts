import type { Catalog, StatEvent } from "../types";

/**
 * Punto de intercambio de la persistencia. Hoy lo implementa `fileRepository` (archivos JSON);
 * cuando se decida la base de datos solo hay que escribir otra implementación y cambiarla en `./index.ts`.
 */
export interface Repository {
  getPublished(): Promise<Catalog>;
  /** `null` cuando no hay cambios sin publicar. */
  getDraft(): Promise<Catalog | null>;
  saveDraft(catalog: Catalog): Promise<void>;
  discardDraft(): Promise<void>;
  /** Convierte el borrador en la versión publicada y lo limpia. */
  publish(): Promise<void>;
  addEvents(events: StatEvent[]): Promise<void>;
  listEvents(sinceMs: number): Promise<StatEvent[]>;
}
