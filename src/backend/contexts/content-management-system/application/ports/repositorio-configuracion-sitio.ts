import type { ConfiguracionSitio } from '../../domain/configuracion-sitio.js'

export type ConsultaConfiguracionesSitio = Readonly<{
  empresaId?: bigint | null
  clave?: string
  grupo?: string
  activo?: boolean | null
  limite?: number
  desplazamiento?: number
}>

export type NuevaConfiguracionSitio = Omit<ConstructorParameters<typeof ConfiguracionSitio>[0], 'id' | 'creadoEn' | 'actualizadoEn'>

export type EscrituraConfiguracionSitio = Readonly<{
  actorId: string
  cuando: Date
  ipAddress?: string | null
  userAgent?: string | null
}>

/**
 * Implementar autorización, relaciones, concurrencia y auditoría en la misma transacción.
 * crear genera el ID en BD; guardar compara actualizadoEnAnterior y falla ante conflicto.
 * empresaId=null selecciona globales; undefined no filtra. Las claves pueden repetirse.
 */
export interface RepositorioConfiguracionesSitio {
  listar(consulta: ConsultaConfiguracionesSitio): Promise<readonly ConfiguracionSitio[]>
  obtener(id: number): Promise<ConfiguracionSitio | null>
  crear(datos: NuevaConfiguracionSitio, contexto: EscrituraConfiguracionSitio): Promise<ConfiguracionSitio>
  guardar(entidad: ConfiguracionSitio, actualizadoEnAnterior: Date | null, contexto: EscrituraConfiguracionSitio): Promise<void>
}
