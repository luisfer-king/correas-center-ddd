import type { CrearContenidoRegistro, EditarContenidoRegistro } from '../api/tipos-contenidos-registro'
import { contenidos_registroApi } from '../api/cliente-contenidos-registro'
import type { ConfiguracionVistaCms } from './listado-cms'
export const vistaContenidoRegistro: ConfiguracionVistaCms = {
 recurso: 'contenidos_registro', ruta: 'contenidos-registro', titulo: 'Contenidos de registro',
 crear: [{"clave": "empresaId", "etiqueta": "Empresa (ID)", "tipo": "id", "ayuda": "ID de la empresa registrada."}, {"clave": "registroId", "etiqueta": "Registro (ID)", "tipo": "id"}, {"clave": "campos.titulo", "etiqueta": "Título", "tipo": "texto", "nullable": true}, {"clave": "campos.subtitulo", "etiqueta": "Subtitulo", "tipo": "texto", "nullable": true}, {"clave": "campos.descripcion", "etiqueta": "Descripción", "tipo": "area", "nullable": true}, {"clave": "campos.icono", "etiqueta": "Icono", "tipo": "texto", "nullable": true}, {"clave": "campos.stats", "etiqueta": "Stats", "tipo": "texto", "nullable": true}, {"clave": "orden", "etiqueta": "Orden", "tipo": "numero"}],
 editar: [{"clave": "campos.titulo", "etiqueta": "Título", "tipo": "texto", "nullable": true}, {"clave": "campos.subtitulo", "etiqueta": "Subtitulo", "tipo": "texto", "nullable": true}, {"clave": "campos.descripcion", "etiqueta": "Descripción", "tipo": "area", "nullable": true}, {"clave": "campos.icono", "etiqueta": "Icono", "tipo": "texto", "nullable": true}, {"clave": "campos.stats", "etiqueta": "Stats", "tipo": "texto", "nullable": true}],
 filtros: ["empresaId", "registroId"],
 api: { ...contenidos_registroApi, crear: datos => contenidos_registroApi.crear(datos as CrearContenidoRegistro), editar: (id, version, datos) => contenidos_registroApi.editar(id, version, datos as EditarContenidoRegistro) },
}
