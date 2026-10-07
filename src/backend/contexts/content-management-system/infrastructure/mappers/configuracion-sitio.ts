import { ConfiguracionSitio } from '../../domain/configuracion-sitio.js'

/** Campos escalares del modelo Prisma ConfiguracionSitio; no requiere cliente ni conexión. */
export type FilaConfiguracionSitio = Readonly<{
  id: number
  empresaId: bigint | null
  clave: string
  valor: string | null
  tipo: string | null
  descripcion: string | null
  grupo: string | null
  activo: boolean | null
  creadoEn: Date | null
  actualizadoEn: Date | null
}>

export function mapearConfiguracionSitio(fila: FilaConfiguracionSitio): ConfiguracionSitio {
  return new ConfiguracionSitio({
    id: fila.id,
    empresaId: fila.empresaId,
    clave: fila.clave,
    valor: fila.valor,
    tipo: fila.tipo,
    descripcion: fila.descripcion,
    grupo: fila.grupo,
    activo: fila.activo,
    creadoEn: fila.creadoEn,
    actualizadoEn: fila.actualizadoEn,
  })
}
