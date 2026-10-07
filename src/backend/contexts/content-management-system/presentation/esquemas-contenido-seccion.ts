import * as S from './esquemas-cms.js'
function camposEntrada(properties: Record<string, unknown>) {
  const base = S.objetoCms(properties)
  return { ...base, required: base.required.filter(k => !['subtitulo', 'descripcion', 'imagen'].includes(k)) }
}

const crearBase = S.objetoCms({ empresaId: S.idSchemaCms, tipoSeccionId: S.idSchemaCms, campos: camposEntrada({ titulo: S.textoNullableSchemaCms, subtitulo: S.textoNullableSchemaCms, descripcion: S.textoNullableSchemaCms, icono: S.textoNullableSchemaCms, imagen: S.textoNullableSchemaCms }), metadata: { type: 'object', additionalProperties: true }, orden: S.nullableCms(S.ordenSchemaCms), mostrar: { type: 'boolean' } })
export const crearContenidoSeccionSchema = { ...crearBase, required: crearBase.required.filter(k => k !== 'orden') }
export const editarContenidoSeccionSchema = S.objetoCms({ version: S.versionSchemaCms, campos: camposEntrada({ titulo: S.textoNullableSchemaCms, subtitulo: S.textoNullableSchemaCms, descripcion: S.textoNullableSchemaCms, icono: S.textoNullableSchemaCms, imagen: S.textoNullableSchemaCms }), metadata: { type: 'object', additionalProperties: true } })
export const salidaContenidoSeccionSchema = S.objetoCms({ id: S.idSchemaCms, empresaId: S.idSchemaCms, tipoSeccionId: S.idSchemaCms, campos: S.objetoCms({ titulo: S.textoNullableSchemaCms, subtitulo: S.textoNullableSchemaCms, descripcion: S.textoNullableSchemaCms, icono: S.textoNullableSchemaCms, imagen: S.textoNullableSchemaCms }), metadata: { type: 'object', additionalProperties: true }, orden: S.ordenSchemaCms, mostrar: { type: 'boolean' }, estado: S.estadoSchemaCms, creadoEn: S.versionSchemaCms, actualizadoEn: S.versionSchemaCms, eliminadoEn: S.nullableCms(S.versionSchemaCms) })
