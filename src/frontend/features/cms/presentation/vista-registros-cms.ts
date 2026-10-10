import type { CrearRegistroCMS, EditarRegistroCMS } from '../api/tipos-registros-cms'
import { registros_cmsApi } from '../api/cliente-registros-cms'
import type { ConfiguracionVistaCms } from './listado-cms'
export const vistaRegistroCMS: ConfiguracionVistaCms = {
 recurso: 'registros_cms', ruta: 'registros-cms', titulo: 'Registros',
 crear: [{"clave": "identificador", "etiqueta": "Identificador", "tipo": "texto"}, {"clave": "nombre", "etiqueta": "Nombre", "tipo": "texto"}, {"clave": "descripcion", "etiqueta": "Descripción", "tipo": "area", "nullable": true}],
 editar: [{"clave": "nombre", "etiqueta": "Nombre", "tipo": "texto"}, {"clave": "descripcion", "etiqueta": "Descripción", "tipo": "area", "nullable": true}],
 filtros: [],
 api: { ...registros_cmsApi, crear: datos => registros_cmsApi.crear(datos as CrearRegistroCMS), editar: (id, version, datos) => registros_cmsApi.editar(id, version, datos as EditarRegistroCMS) },
}
