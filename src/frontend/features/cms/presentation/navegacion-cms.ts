import type { RecursoCms } from '../api/modelos-cms'
export type EnlaceCms = { titulo: string; ruta: string; recurso: RecursoCms }
export const gruposNavegacionCms: { titulo: string; enlaces: EnlaceCms[] }[] = [
 {titulo:'Contenido',enlaces:[{titulo:'Tipos de sección',ruta:'tipos-seccion',recurso:'tipos_seccion'},{titulo:'Secciones',ruta:'contenidos-seccion',recurso:'contenidos_seccion'},{titulo:'Registros',ruta:'registros-cms',recurso:'registros_cms'},{titulo:'Contenidos de registro',ruta:'contenidos-registro',recurso:'contenidos_registro'}]},
 {titulo:'Navegación',enlaces:[{titulo:'Menús',ruta:'menus',recurso:'menus'},{titulo:'Ítems de menú',ruta:'items-menu',recurso:'items_menu'},{titulo:'Footer',ruta:'elementos-footer',recurso:'elementos_footer'}]},
 {titulo:'Sitio',enlaces:[{titulo:'Configuración',ruta:'configuracion-sitio',recurso:'configuracion_sitio'},{titulo:'Wizard',ruta:'pasos-wizard',recurso:'pasos_wizard'}]},
]
