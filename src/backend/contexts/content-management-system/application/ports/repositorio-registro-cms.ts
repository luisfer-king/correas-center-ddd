import type { RegistroCMS } from '../../domain/registro-cms.js'
import type { EstadoCMS } from '../../domain/cms-values.js'

export type ConsultaRegistrosCMS = Readonly<{
  estado?: EstadoCMS
  incluirEliminados?: boolean
  limite?: number
  desplazamiento?: number
}>

export type NuevaRegistroCMS = Omit<ConstructorParameters<typeof RegistroCMS>[0], 'id' | 'fechas' | 'estado'>

export type EscrituraRegistroCMS = Readonly<{
  actorId: string
  cuando: Date
  ipAddress?: string | null
  userAgent?: string | null
}>

/**
 * Implementar autorización, relaciones, concurrencia y auditoría en la misma transacción.
 * crear genera el ID en BD; guardar compara actualizadoEnAnterior y falla ante conflicto.
 */
export interface RepositorioRegistrosCMS {
  listar(consulta: ConsultaRegistrosCMS): Promise<readonly RegistroCMS[]>
  obtener(id: bigint): Promise<RegistroCMS | null>
  crear(datos: NuevaRegistroCMS, contexto: EscrituraRegistroCMS): Promise<RegistroCMS>
  guardar(entidad: RegistroCMS, actualizadoEnAnterior: Date, contexto: EscrituraRegistroCMS): Promise<void>
  obtenerPorIdentificador(identificador: string): Promise<RegistroCMS | null>
}
