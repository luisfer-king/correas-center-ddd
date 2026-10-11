import { RegistrarLecturaGamas } from '../application/use-cases/auditoria/registrar-lectura-gamas.js'
import { PrismaAuditoria } from '../../identity-access-management/infrastructure/prisma-auditoria.js'
import { RelojSistema } from '../../identity-access-management/infrastructure/reloj-sistema.js'
import type { PrismaClient } from '../../../generated/prisma/client.js'
import { ExigirPermiso } from '../../identity-access-management/application/use-cases/autorizacion/exigir-permiso.js'
import { PrismaAutorizacion } from '../../identity-access-management/infrastructure/prisma-autorizacion.js'
import { componerCasosGamas } from '../application/componer-casos-gamas.js'
import { componerPersistenciaGamas } from './componer-persistencia-gamas.js'
import { PrismaCategorias } from './prisma-categorias.js'
/** Casos de gamas y auditoría de lectura para la API del portal. */
export function componerGamas(db: PrismaClient) {
    return { ...componerCasosGamas({ ...componerPersistenciaGamas(db), categorias: new PrismaCategorias(db), autorizar: new ExigirPermiso(new PrismaAutorizacion(db)) }), registrarLectura: new RegistrarLecturaGamas(new PrismaAuditoria(db), new RelojSistema()) }
}
