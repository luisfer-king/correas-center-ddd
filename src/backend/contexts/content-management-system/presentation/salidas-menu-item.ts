import type { MenuItem } from '../domain/menu-item.js'

export function salidaMenuItem(e: MenuItem) {
  return {
    id: e.id.toString(),
    menuId: e.menuId.toString(),
    ruta: e.ruta.value,
    orden: e.orden.value,
    estado: e.estado, creadoEn: e.creadoEn.toISOString(), actualizadoEn: e.actualizadoEn.toISOString(), eliminadoEn: e.eliminadoEn?.toISOString() ?? null,
  }
}
