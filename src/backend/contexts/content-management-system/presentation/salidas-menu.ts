import type { Menu } from '../domain/menu.js'
import { salidaMenuItem } from './salidas-menu-item.js'

export function salidaMenu(e: Menu) {
  return {
    id: e.id.toString(),
    empresaId: e.empresaId.toString(),
    grupo: e.grupo,
    destino: { tipo: e.destino.tipo, id: e.destino.id.toString() },
    ruta: e.ruta.value,
    icono: e.icono,
    mostrar: e.mostrar,
    orden: e.orden.value,
    cargarSubmenu: e.cargarSubmenu,
    estado: e.estado, creadoEn: e.creadoEn.toISOString(), actualizadoEn: e.actualizadoEn.toISOString(), eliminadoEn: e.eliminadoEn?.toISOString() ?? null,
    items: e.itemsOrdenados.map(salidaMenuItem),
  }
}
