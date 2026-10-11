import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioGamas } from '../application/ports/repositorio-gamas.js'
import type { RepositorioPlantillasGama } from '../application/ports/repositorio-plantillas-gama.js'
import type { UnidadTrabajoGamas } from '../application/ports/unidad-trabajo-gamas.js'
import { PrismaGamas } from './prisma-gamas.js'
import { PrismaPlantillasGama } from './prisma-plantillas-gama.js'
import { PrismaUnidadTrabajoGamas } from './prisma-unidad-trabajo-gamas.js'
/** Dependencias para inyectar en los casos de uso de la entrega 3. No registra rutas HTTP. */
export function componerPersistenciaGamas(db: PrismaClient): {
  gamas: RepositorioGamas; plantillas: RepositorioPlantillasGama; unidadTrabajo: UnidadTrabajoGamas
} {
  return { gamas: new PrismaGamas(db), plantillas: new PrismaPlantillasGama(db), unidadTrabajo: new PrismaUnidadTrabajoGamas(db) }
}
