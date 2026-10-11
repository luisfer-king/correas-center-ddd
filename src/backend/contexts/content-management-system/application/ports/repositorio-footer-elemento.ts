import type { FooterElemento } from '../../domain/footer-elemento.js'
import type { EstadoCMS } from '../../domain/cms-values.js'

export type ConsultaElementosFooter = Readonly<{
  estado?: EstadoCMS
  incluirEliminados?: boolean
  empresaId?: bigint
  registroId?: bigint
  limite?: number
  desplazamiento?: number
}>

export type NuevaFooterElemento = Omit<ConstructorParameters<typeof FooterElemento>[0], 'id' | 'fechas' | 'estado' | 'orden'> & { orden?: FooterElemento['orden'] }

export type EscrituraFooterElemento = Readonly<{
  actorId: string
  cuando: Date
  ipAddress?: string | null
  userAgent?: string | null
}>

/**
 * Implementar autorización, relaciones, concurrencia y auditoría en la misma transacción.
 * crear genera el ID en BD; guardar compara actualizadoEnAnterior y falla ante conflicto.
 */
export interface RepositorioElementosFooter {
  listar(consulta: ConsultaElementosFooter): Promise<readonly FooterElemento[]>
  obtener(id: bigint): Promise<FooterElemento | null>
  crear(datos: NuevaFooterElemento, contexto: EscrituraFooterElemento): Promise<FooterElemento>
  guardar(entidad: FooterElemento, actualizadoEnAnterior: Date, contexto: EscrituraFooterElemento): Promise<void>
}
