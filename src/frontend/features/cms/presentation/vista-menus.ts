import type { CrearMenu, EditarMenu } from '../api/tipos-menus'
import { menusApi } from '../api/cliente-menus'
import type { ConfiguracionVistaCms } from './listado-cms'
export const vistaMenu: ConfiguracionVistaCms = {
 recurso: 'menus', ruta: 'menus', titulo: 'Menús',
 crear: [{"clave": "empresaId", "etiqueta": "Empresa", "tipo": "id", "ayuda": "ID de la empresa registrada."}, {"clave": "grupo", "etiqueta": "Grupo", "tipo": "select", "opciones": ["Producto", "Aplicacion", "Servicio"]}, {"clave": "destino.tipo", "etiqueta": "Tipo de registro", "tipo": "select", "opciones": ["producto", "industria", "servicio"], "inicial": "producto"}, {"clave": "registroId", "etiqueta": "Registro ID", "tipo": "id", "ayuda": "ID real del producto, industria o servicio."}, {"clave": "ruta", "etiqueta": "Ruta", "tipo": "texto"}, {"clave": "icono", "etiqueta": "Icono de Lucide", "tipo": "icono-lucide", "nullable": true}, {"clave": "mostrar", "etiqueta": "Visible", "tipo": "booleano"}, {"clave": "orden", "etiqueta": "Orden (automático)", "tipo": "numero"}, {"clave": "cargarSubmenu", "etiqueta": "Cargar submenú", "tipo": "select", "nullable": true, "opciones": ["activo", "inactivo"]}],
 editar: [{"clave": "grupo", "etiqueta": "Grupo", "tipo": "select", "opciones": ["Producto", "Aplicacion", "Servicio"]}, {"clave": "ruta", "etiqueta": "Ruta", "tipo": "texto"}, {"clave": "icono", "etiqueta": "Icono de Lucide", "tipo": "icono-lucide", "nullable": true}, {"clave": "mostrar", "etiqueta": "Visible", "tipo": "booleano"}, {"clave": "cargarSubmenu", "etiqueta": "Cargar submenú", "tipo": "select", "nullable": true, "opciones": ["activo", "inactivo"]}],
 filtros: ["empresaId"],
 api: { ...menusApi, crear: datos => menusApi.crear(datos as CrearMenu), editar: (id, version, datos) => menusApi.editar(id, version, datos as EditarMenu) },
}
