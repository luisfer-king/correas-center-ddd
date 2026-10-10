import type { PasoWizard } from '../../domain/paso-wizard.js'
import type { EstadoCMS } from '../../domain/cms-values.js'

export type ConsultaPasosWizard = Readonly<{
  estado?: EstadoCMS
  incluirEliminados?: boolean
  empresaId?: bigint
  limite?: number
  desplazamiento?: number
}>

export type NuevaPasoWizard = Omit<ConstructorParameters<typeof PasoWizard>[0], 'id' | 'fechas' | 'estado' | 'orden'> & { orden?: PasoWizard['orden'] }

export type EscrituraPasoWizard = Readonly<{
  actorId: string
  cuando: Date
  ipAddress?: string | null
  userAgent?: string | null
}>

/**
 * Implementar autorización, relaciones, concurrencia y auditoría en la misma transacción.
 * crear genera el ID en BD; guardar compara actualizadoEnAnterior y falla ante conflicto.
 */
export interface RepositorioPasosWizard {
  listar(consulta: ConsultaPasosWizard): Promise<readonly PasoWizard[]>
  obtener(id: bigint): Promise<PasoWizard | null>
  crear(datos: NuevaPasoWizard, contexto: EscrituraPasoWizard): Promise<PasoWizard>
  guardar(entidad: PasoWizard, actualizadoEnAnterior: Date, contexto: EscrituraPasoWizard): Promise<void>
}
