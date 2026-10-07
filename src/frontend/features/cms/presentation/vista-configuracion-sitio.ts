import type { CrearConfiguracionSitio, EditarConfiguracionSitio } from '../api/tipos-configuracion-sitio'
import { configuracion_sitioApi } from '../api/cliente-configuracion-sitio'
import type { ConfiguracionVistaCms } from './listado-cms'
export const vistaConfiguracionSitio: ConfiguracionVistaCms = {
 recurso: 'configuracion_sitio', ruta: 'configuracion-sitio', titulo: 'Configuración del sitio',
 crear: [{"clave": "empresaId", "etiqueta": "Empresa (ID)", "tipo": "id", "nullable": true, "ayuda": "ID de la empresa registrada. Déjalo vacío para configuración global."}, {"clave": "clave", "etiqueta": "Clave", "tipo": "texto"}, {"clave": "valor", "etiqueta": "Valor", "tipo": "area", "nullable": true}, {"clave": "tipo", "etiqueta": "Tipo", "tipo": "texto", "nullable": true}, {"clave": "descripcion", "etiqueta": "Descripción", "tipo": "area", "nullable": true}, {"clave": "grupo", "etiqueta": "Grupo", "tipo": "texto", "nullable": true}, {"clave": "activo", "etiqueta": "Activo", "tipo": "triestado", "nullable": true}],
 editar: [{"clave": "valor", "etiqueta": "Valor", "tipo": "area", "nullable": true}, {"clave": "tipo", "etiqueta": "Tipo", "tipo": "texto", "nullable": true}, {"clave": "descripcion", "etiqueta": "Descripción", "tipo": "area", "nullable": true}, {"clave": "grupo", "etiqueta": "Grupo", "tipo": "texto", "nullable": true}],
 filtros: ["empresaId", "clave", "grupo"],
 api: { ...configuracion_sitioApi, crear: datos => configuracion_sitioApi.crear(datos as CrearConfiguracionSitio), editar: (id, version, datos) => configuracion_sitioApi.editar(id, version, datos as EditarConfiguracionSitio) },
}
