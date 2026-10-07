import type { ContenidoRegistro } from '../domain/contenido-registro.js'

export function salidaContenidoRegistro(e: ContenidoRegistro) {
  return {
    id: e.id.toString(),
    empresaId: e.empresaId.toString(),
    registroId: e.registroId.toString(),
    campos: e.campos,
    orden: e.orden.value,
    estado: e.estado, creadoEn: e.creadoEn.toISOString(), actualizadoEn: e.actualizadoEn.toISOString(), eliminadoEn: e.eliminadoEn?.toISOString() ?? null,
  }
}
