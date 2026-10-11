import { test } from 'node:test'
import assert from 'node:assert/strict'
import { aAsignacionAtributo } from '../mappers/asignacion-atributo.js'
import { aAtributoTecnico } from '../mappers/atributo-tecnico.js'
const fecha = new Date('2026-10-10T00:00:00Z')
const base = { id: 1n, orden: 1, estado: 'activo' as const, creadoEn: fecha, actualizadoEn: fecha }
test('mapper conserva texto y false de asignaciones generales', () => {
  const asignacion = { ...base, categoriaId: 1n, atributoId: 1n, valorPersonalizado: null }
  assert.equal(aAsignacionAtributo({ ...asignacion, tipoDato: 'texto', valorTexto: 'Caucho', valorBooleano: null }).valorTexto, 'Caucho')
  assert.equal(aAsignacionAtributo({ ...asignacion, tipoDato: 'booleano', valorTexto: null, valorBooleano: false }).valorBooleano, false)
})
test('mapper conserva el tipo del atributo y rechaza valores incompatibles', () => {
  const atributo = aAtributoTecnico({ ...base, tipoAtributoId: 1n, tipoDato: 'texto', nombre: 'Material', descripcion: null, valorNumerico: null, unidadMedida: null, eliminadoEn: null })
  assert.equal(atributo.tipoDato, 'texto')
  assert.throws(() => atributo.editar('Material', { descripcion: null, valorNumerico: '2', unidadMedida: null }, fecha))
})
