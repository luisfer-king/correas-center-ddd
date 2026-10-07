import type { TipoSeccion } from '../../domain/tipo-seccion.js'
import type { EstadoCMS } from '../../domain/cms-values.js'

export type ConsultaTiposSeccion = Readonly<{
  estado?: EstadoCMS
  incluirEliminados?: boolean
  limite?: number
  desplazamiento?: number
}>

export type NuevaTipoSeccion = Omit<ConstructorParameters<typeof TipoSeccion>[0], 'id' | 'fechas' | 'estado' | 'orden'> & { orden: ConstructorParameters<typeof TipoSeccion>[0]['orden'] | null }

export type EscrituraTipoSeccion = Readonly<{
  actorId: string
  cuando: Date
  ipAddress?: string | null
  userAgent?: string | null
}>

/**
 * Implementar autorización, relaciones, concurrencia y auditoría en la misma transacción.
 * crear genera el ID en BD; guardar compara actualizadoEnAnterior y falla ante conflicto.
 * Cambiar claves debe comprobar todos los contenidos vinculados antes de guardar.
 */
export interface RepositorioTiposSeccion {
  listar(consulta: ConsultaTiposSeccion): Promise<readonly TipoSeccion[]>
  obtener(id: bigint): Promise<TipoSeccion | null>
  crear(datos: NuevaTipoSeccion, contexto: EscrituraTipoSeccion): Promise<TipoSeccion>
  guardar(entidad: TipoSeccion, actualizadoEnAnterior: Date, contexto: EscrituraTipoSeccion): Promise<void>
  obtenerPorSlug(slug: string): Promise<TipoSeccion | null>
}
