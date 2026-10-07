import type { MenuItem } from '../../domain/menu-item.js'
import type { EstadoCMS } from '../../domain/cms-values.js'

export type ConsultaItemsMenu = Readonly<{
  estado?: EstadoCMS
  incluirEliminados?: boolean
  menuId?: bigint
  limite?: number
  desplazamiento?: number
}>

export type NuevaMenuItem = Omit<ConstructorParameters<typeof MenuItem>[0], 'id' | 'fechas' | 'estado'>

export type EscrituraMenuItem = Readonly<{
  actorId: string
  cuando: Date
  ipAddress?: string | null
  userAgent?: string | null
}>

/**
 * Implementar autorización, relaciones, concurrencia y auditoría en la misma transacción.
 * crear genera el ID en BD; guardar compara actualizadoEnAnterior y falla ante conflicto.
 */
export interface RepositorioItemsMenu {
  listar(consulta: ConsultaItemsMenu): Promise<readonly MenuItem[]>
  obtener(id: bigint): Promise<MenuItem | null>
  crear(datos: NuevaMenuItem, contexto: EscrituraMenuItem): Promise<MenuItem>
  guardar(entidad: MenuItem, actualizadoEnAnterior: Date, contexto: EscrituraMenuItem): Promise<void>
}
