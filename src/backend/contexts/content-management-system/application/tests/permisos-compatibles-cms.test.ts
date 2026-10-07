import { test } from 'node:test'
import assert from 'node:assert/strict'
import { codigosPermisoCms, exigirAlternativaCms } from '../permisos-cms.js'
import { ObtenerCapacidadesCms } from '../use-cases/autorizacion/obtener-capacidades-cms.js'
const actor = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
const legados = ['menus','footers','secciones','registros','wizard','configuracion']
for (const accion of ['read','manage'] as const) test(`Todos los permisos existentes reconocidos: ${accion}`, async () => {
 const auth = { ejecutar: async () => {}, tieneRolActivo: async () => false,
 tienePermiso: async (_actor: string, codigo: string) => legados.some(r => codigo === `cms.${r}.${accion}`) }
 const caps = await new ObtenerCapacidadesCms(auth).ejecutar(actor)
 for (const c of Object.values(caps.recursos)) { assert.equal(c[accion === 'read' ? 'leer' : 'gestionar'], true); assert.equal(c[accion === 'read' ? 'gestionar' : 'leer'], false) }
})
test('Fallback solo ante denegación, conserva errores de infraestructura', async () => {
 const codigos = codigosPermisoCms('contenidos-seccion','manage'); const llamadas: string[] = []
 await exigirAlternativaCms(codigos, async c => { llamadas.push(c); if (c !== 'cms.secciones.manage') throw new Error('Acceso denegado') })
 assert.deepEqual(llamadas, codigos)
 await assert.rejects(exigirAlternativaCms(codigos, async () => { throw new Error('DB desconectada') }), /DB desconectada/)
 await assert.rejects(exigirAlternativaCms(codigos, async () => { throw new Error('Acceso denegado') }), /Acceso denegado/)
})
test('No extiende permisos a recursos ajenos ni confunde read con manage', async () => {
 assert.throws(() => codigosPermisoCms('usuarios','manage'))
 assert.deepEqual(codigosPermisoCms('menus','read'), ['cms.menus.read'])
 const a = { ejecutar: async () => {}, tieneRolActivo: async () => false, tienePermiso: async (_a: string,c: string) => c === 'cms.secciones.read' }
 const c = await new ObtenerCapacidadesCms(a).ejecutar(actor)
 assert.equal(c.recursos.contenidos_seccion.leer,true); assert.equal(c.recursos.menus.leer,false); assert.equal(c.recursos.metadata_seccion.gestionar,false)
})
