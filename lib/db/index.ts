import { fileRepository } from "./fileRepository";
import type { Repository } from "./repository";

/** Cambiar aquí la implementación cuando se defina la base de datos. */
export const repo: Repository = fileRepository;
