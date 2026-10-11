import type { CrearConfiguracionSitio, EditarConfiguracionSitio } from '../api/tipos-configuracion-sitio'
import { configuracion_sitioApi } from '../api/cliente-configuracion-sitio'
import type { ConfiguracionVistaCms } from './listado-cms'
export const vistaConfiguracionSitio: ConfiguracionVistaCms = {
 recurso: 'configuracion_sitio', ruta: 'configuracion-sitio', titulo: 'Configuración del sitio',
 crear: [{"clave": "empresaId", "etiqueta": "Empresa", "tipo": "id", "nullable": true, "ayuda": "Selecciona la empresa o utiliza configuración global."}, {"clave": "clave", "etiqueta": "Clave", "tipo": "texto"}, {"clave": "valor", "etiqueta": "Valor", "tipo": "area", "nullable": true}, {"clave": "tipo", "etiqueta": "Tipo", "tipo": "texto", "nullable": true}, {"clave": "descripcion", "etiqueta": "Descripción", "tipo": "area", "nullable": true}, {"clave": "grupo", "etiqueta": "Grupo", "tipo": "select", "nullable": true, "opciones": ["general", "analytics", "whatsapp", "chat", "redes_sociales"]}, {"clave": "activo", "etiqueta": "Activo", "tipo": "triestado", "nullable": true}],
 editar: [{"clave": "valor", "etiqueta": "Valor", "tipo": "area", "nullable": true}, {"clave": "tipo", "etiqueta": "Tipo", "tipo": "texto", "nullable": true}, {"clave": "descripcion", "etiqueta": "Descripción", "tipo": "area", "nullable": true}, {"clave": "grupo", "etiqueta": "Grupo", "tipo": "select", "nullable": true, "opciones": ["general", "analytics", "whatsapp", "chat", "redes_sociales"]}],
 filtros: ["empresaId", "clave", "grupo"],
 api: { ...configuracion_sitioApi, crear: datos => configuracion_sitioApi.crear(datos as CrearConfiguracionSitio), editar: (id, version, datos) => configuracion_sitioApi.editar(id, version, datos as EditarConfiguracionSitio) },
}
