import type { ContenidoSeccion } from '../domain/contenido-seccion.js'

export function salidaContenidoSeccion(e: ContenidoSeccion) {
  return {
    id: e.id.toString(),
    empresaId: e.empresaId.toString(),
    tipoSeccionId: e.tipoSeccionId.toString(),
    campos: e.campos,
    metadata: e.metadata,
    orden: e.orden.value,
    mostrar: e.mostrar,
    estado: e.estado, creadoEn: e.creadoEn.toISOString(), actualizadoEn: e.actualizadoEn.toISOString(), eliminadoEn: e.eliminadoEn?.toISOString() ?? null,
  }
}
