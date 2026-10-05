import type { ConfiguracionSitio } from '../domain/configuracion-sitio.js'

export function salidaConfiguracionSitio(e: ConfiguracionSitio) {
  return {
    id: e.id,
    empresaId: e.empresaId?.toString() ?? null,
    clave: e.clave,
    valor: e.valor,
    tipo: e.tipo,
    descripcion: e.descripcion,
    grupo: e.grupo,
    activo: e.activo,
    creadoEn: e.creadoEn?.toISOString() ?? null, actualizadoEn: e.actualizadoEn?.toISOString() ?? null,
  }
}
