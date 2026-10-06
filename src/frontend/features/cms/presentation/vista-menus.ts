import type { CrearMenu, EditarMenu } from '../api/tipos-menus'
import { menusApi } from '../api/cliente-menus'
import type { ConfiguracionVistaCms } from './listado-cms'
export const vistaMenu: ConfiguracionVistaCms = {
 recurso: 'menus', ruta: 'menus', titulo: 'Menús',
 crear: [{"clave": "empresaId", "etiqueta": "Empresa (ID)", "tipo": "id", "ayuda": "ID de la empresa registrada."}, {"clave": "grupo", "etiqueta": "Grupo", "tipo": "texto"}, {"clave": "destino.tipo", "etiqueta": "Tipo de destino", "tipo": "select", "opciones": ["producto", "industria", "servicio"], "inicial": "producto"}, {"clave": "destino.id", "etiqueta": "Destino (ID)", "tipo": "id", "ayuda": "ID del producto, industria o servicio."}, {"clave": "ruta", "etiqueta": "Ruta", "tipo": "texto"}, {"clave": "icono", "etiqueta": "Icono", "tipo": "texto", "nullable": true}, {"clave": "mostrar", "etiqueta": "Visible", "tipo": "booleano"}, {"clave": "orden", "etiqueta": "Orden", "tipo": "numero"}, {"clave": "cargarSubmenu", "etiqueta": "Cargar submenú", "tipo": "select", "nullable": true, "opciones": ["activo", "inactivo"]}],
 editar: [{"clave": "grupo", "etiqueta": "Grupo", "tipo": "texto"}, {"clave": "ruta", "etiqueta": "Ruta", "tipo": "texto"}, {"clave": "icono", "etiqueta": "Icono", "tipo": "texto", "nullable": true}, {"clave": "mostrar", "etiqueta": "Visible", "tipo": "booleano"}, {"clave": "cargarSubmenu", "etiqueta": "Cargar submenú", "tipo": "select", "nullable": true, "opciones": ["activo", "inactivo"]}],
 filtros: ["empresaId"],
 api: { ...menusApi, crear: datos => menusApi.crear(datos as CrearMenu), editar: (id, version, datos) => menusApi.editar(id, version, datos as EditarMenu) },
}
