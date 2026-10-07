import type { CrearTipoSeccion, EditarTipoSeccion } from '../api/tipos-tipos-seccion'
import { tipos_seccionApi } from '../api/cliente-tipos-seccion'
import type { ConfiguracionVistaCms } from './listado-cms'
export const vistaTipoSeccion: ConfiguracionVistaCms = {
 recurso: 'tipos_seccion', ruta: 'tipos-seccion', titulo: 'Tipos de sección',
 crear: [{"clave": "nombre", "etiqueta": "Nombre", "tipo": "texto"}, {"clave": "slug", "etiqueta": "Slug automático", "tipo": "slug"}, {"clave": "descripcion", "etiqueta": "Descripción", "tipo": "area", "nullable": true}, {"clave": "camposMetadata", "etiqueta": "Claves de metadata", "tipo": "claves", "ayuda": "Opcional. Agrega los campos JSON que podrá tener este tipo."}, {"clave": "icono", "etiqueta": "Icono (Lucide)", "tipo": "icono-lucide", "nullable": true}, {"clave": "orden", "etiqueta": "Orden", "tipo": "orden-auto"}],
 editar: [{"clave": "nombre", "etiqueta": "Nombre", "tipo": "texto"}, {"clave": "descripcion", "etiqueta": "Descripción", "tipo": "area", "nullable": true}, {"clave": "icono", "etiqueta": "Icono (Lucide)", "tipo": "icono-lucide", "nullable": true}],
 filtros: [],
 api: { ...tipos_seccionApi, crear: datos => tipos_seccionApi.crear(datos as CrearTipoSeccion), editar: (id, version, datos) => tipos_seccionApi.editar(id, version, datos as EditarTipoSeccion) },
}
