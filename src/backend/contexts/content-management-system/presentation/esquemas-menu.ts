import * as S from './esquemas-cms.js'
import { salidaMenuItemSchema } from './esquemas-menu-item.js'

const referenciaMenuSchema = S.objetoCms({ tipo: { type:'string', enum:['producto','industria','servicio'] }, id:S.idSchemaCms })
const grupoMenuSchema = { type:'string', enum:['Producto','Aplicacion','Servicio','Productos','Aplicación','Aplicaciones','Servicios','producto','aplicacion','servicio','productos','aplicación','aplicaciones','servicios'] }
const crearBase = S.objetoCms({ empresaId: S.idSchemaCms, grupo: grupoMenuSchema, destino: referenciaMenuSchema, ruta: S.textoObligatorioSchemaCms, icono: S.textoNullableSchemaCms, mostrar: { type: 'boolean' }, orden: S.nullableCms(S.ordenSchemaCms), cargarSubmenu: { anyOf: [{ type: 'string', enum: ['activo','inactivo'] }, { type: 'null' }] } })
export const crearMenuSchema = { ...crearBase, required: crearBase.required.filter(k => k !== 'orden') }
const editarBase = S.objetoCms({ version: S.versionSchemaCms, grupo: grupoMenuSchema, ruta: S.textoObligatorioSchemaCms, icono: S.textoNullableSchemaCms, mostrar: { type: 'boolean' }, cargarSubmenu: { anyOf: [{ type: 'string', enum: ['activo','inactivo'] }, { type: 'null' }] } })
export const editarMenuSchema = { ...editarBase, properties: { ...editarBase.properties, destino:referenciaMenuSchema } }
export const salidaMenuSchema = S.objetoCms({ registroId: S.idSchemaCms, id: S.idSchemaCms, empresaId: S.idSchemaCms, grupo: S.textoObligatorioSchemaCms, destino: referenciaMenuSchema, ruta: S.textoObligatorioSchemaCms, icono: S.textoNullableSchemaCms, mostrar: { type: 'boolean' }, orden: S.ordenSchemaCms, cargarSubmenu: { anyOf: [{ type: 'string', enum: ['activo','inactivo'] }, { type: 'null' }] }, estado: S.estadoSchemaCms, creadoEn: S.versionSchemaCms, actualizadoEn: S.versionSchemaCms, eliminadoEn: S.nullableCms(S.versionSchemaCms), items: { type: 'array', items: salidaMenuItemSchema } })
