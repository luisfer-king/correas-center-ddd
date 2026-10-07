import type { FooterElemento } from '../domain/footer-elemento.js'

export function salidaFooterElemento(e: FooterElemento) {
  return {
    id: e.id.toString(),
    empresaId: e.empresaId.toString(),
    tipo: e.tipo,
    destino: e.destino === null ? null : { tipo: e.destino.tipo, id: e.destino.id.toString() },
    titulo: e.titulo,
    enlace: e.enlace?.value ?? null,
    icono: e.icono,
    orden: e.orden.value,
    mostrar: e.mostrar,
    estado: e.estado, creadoEn: e.creadoEn.toISOString(), actualizadoEn: e.actualizadoEn.toISOString(), eliminadoEn: e.eliminadoEn?.toISOString() ?? null,
  }
}
