import type { CrearMenuItem, EditarMenuItem } from '../api/tipos-items-menu'
import { items_menuApi } from '../api/cliente-items-menu'
import type { ConfiguracionVistaCms } from './listado-cms'
export const vistaMenuItem: ConfiguracionVistaCms = {
 recurso: 'items_menu', ruta: 'items-menu', titulo: 'Ítems de menú',
 crear: [{"clave": "menuId", "etiqueta": "Menú (ID)", "tipo": "id"}, {"clave": "ruta", "etiqueta": "Ruta", "tipo": "texto"}, {"clave": "orden", "etiqueta": "Orden", "tipo": "numero"}],
 editar: [{"clave": "ruta", "etiqueta": "Ruta", "tipo": "texto"}],
 filtros: ["menuId"],
 api: { ...items_menuApi, crear: datos => items_menuApi.crear(datos as CrearMenuItem), editar: (id, version, datos) => items_menuApi.editar(id, version, datos as EditarMenuItem) },
}
