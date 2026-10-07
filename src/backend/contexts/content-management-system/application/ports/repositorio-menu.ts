import type { Menu } from '../../domain/menu.js'
import type { EstadoCMS } from '../../domain/cms-values.js'

export type ConsultaMenus = Readonly<{
  estado?: EstadoCMS
  incluirEliminados?: boolean
  empresaId?: bigint
  registroId?: bigint
  limite?: number
  desplazamiento?: number
}>

export type NuevaMenu = Omit<ConstructorParameters<typeof Menu>[0], 'id' | 'fechas' | 'estado' | 'items' | 'orden'> & { orden?: Menu['orden'] | null }

export type EscrituraMenu = Readonly<{
  actorId: string
  cuando: Date
  ipAddress?: string | null
  userAgent?: string | null
}>

/**
 * Implementar autorización, relaciones, concurrencia y auditoría en la misma transacción.
 * crear genera el ID en BD; guardar compara actualizadoEnAnterior y falla ante conflicto.
 * Consultas reconstruyen el agregado con todos sus ítems; guardar no borra ítems ausentes.
 */
export interface RepositorioMenus {
  listar(consulta: ConsultaMenus): Promise<readonly Menu[]>
  obtener(id: bigint): Promise<Menu | null>
  crear(datos: NuevaMenu, contexto: EscrituraMenu): Promise<Menu>
  guardar(entidad: Menu, actualizadoEnAnterior: Date, contexto: EscrituraMenu): Promise<void>
}
