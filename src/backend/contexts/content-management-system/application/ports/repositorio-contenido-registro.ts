import type { ContenidoRegistro } from '../../domain/contenido-registro.js'
import type { EstadoCMS } from '../../domain/cms-values.js'

export type ConsultaContenidosRegistro = Readonly<{
  estado?: EstadoCMS
  incluirEliminados?: boolean
  empresaId?: bigint
  registroId?: bigint
  limite?: number
  desplazamiento?: number
}>

export type NuevaContenidoRegistro = Omit<ConstructorParameters<typeof ContenidoRegistro>[0], 'id' | 'fechas' | 'estado'>

export type EscrituraContenidoRegistro = Readonly<{
  actorId: string
  cuando: Date
  ipAddress?: string | null
  userAgent?: string | null
}>

/**
 * Implementar autorización, relaciones, concurrencia y auditoría en la misma transacción.
 * crear genera el ID en BD; guardar compara actualizadoEnAnterior y falla ante conflicto.
 */
export interface RepositorioContenidosRegistro {
  listar(consulta: ConsultaContenidosRegistro): Promise<readonly ContenidoRegistro[]>
  obtener(id: bigint): Promise<ContenidoRegistro | null>
  crear(datos: NuevaContenidoRegistro, contexto: EscrituraContenidoRegistro): Promise<ContenidoRegistro>
  guardar(entidad: ContenidoRegistro, actualizadoEnAnterior: Date, contexto: EscrituraContenidoRegistro): Promise<void>
}
