import type { ContenidoSeccion } from '../../domain/contenido-seccion.js'
import type { EstadoCMS } from '../../domain/cms-values.js'

export type ConsultaContenidosSeccion = Readonly<{
  estado?: EstadoCMS
  incluirEliminados?: boolean
  empresaId?: bigint
  tipoSeccionId?: bigint
  limite?: number
  desplazamiento?: number
}>

export type NuevaContenidoSeccion = Omit<ConstructorParameters<typeof ContenidoSeccion>[0], 'id' | 'fechas' | 'estado'>

export type EscrituraContenidoSeccion = Readonly<{
  actorId: string
  cuando: Date
  ipAddress?: string | null
  userAgent?: string | null
}>

/**
 * Implementar autorización, relaciones, concurrencia y auditoría en la misma transacción.
 * crear genera el ID en BD; guardar compara actualizadoEnAnterior y falla ante conflicto.
 */
export interface RepositorioContenidosSeccion {
  listar(consulta: ConsultaContenidosSeccion): Promise<readonly ContenidoSeccion[]>
  obtener(id: bigint): Promise<ContenidoSeccion | null>
  crear(datos: NuevaContenidoSeccion, contexto: EscrituraContenidoSeccion): Promise<ContenidoSeccion>
  guardar(entidad: ContenidoSeccion, actualizadoEnAnterior: Date, contexto: EscrituraContenidoSeccion): Promise<void>
}
