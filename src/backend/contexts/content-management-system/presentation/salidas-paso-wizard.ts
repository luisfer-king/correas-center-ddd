import type { PasoWizard } from '../domain/paso-wizard.js'

export function salidaPasoWizard(e: PasoWizard) {
  return {
    id: e.id.toString(),
    empresaId: e.empresaId.toString(),
    identificador: e.identificador,
    titulo: e.titulo,
    descripcion: e.descripcion,
    fuenteDatos: e.fuenteDatos,
    campoFiltro: e.campoFiltro,
    orden: e.orden.value,
    estado: e.estado, creadoEn: e.creadoEn.toISOString(), actualizadoEn: e.actualizadoEn.toISOString(), eliminadoEn: e.eliminadoEn?.toISOString() ?? null,
  }
}
