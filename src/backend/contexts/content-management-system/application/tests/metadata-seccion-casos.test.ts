import { codigosPermisoCms } from '../permisos-cms.js'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ObtenerMetadataSeccion } from '../use-cases/metadata-seccion/obtener-metadata-seccion.js'
import { ReemplazarMetadataSeccion } from '../use-cases/metadata-seccion/reemplazar-metadata-seccion.js'
import { entorno, contexto, actor, antes, despues } from './soporte-pruebas-cms.js'

function casos(env: ReturnType<typeof entorno>) {
  return {
    obtener: new ObtenerMetadataSeccion(env.repo as unknown as ConstructorParameters<typeof ObtenerMetadataSeccion>[0], env.auth,
      env.secciones as unknown as ConstructorParameters<typeof ObtenerMetadataSeccion>[2]),
    reemplazar: new ReemplazarMetadataSeccion(env.repo as unknown as ConstructorParameters<typeof ReemplazarMetadataSeccion>[0], env.auth,
      env.reloj, env.secciones as unknown as ConstructorParameters<typeof ReemplazarMetadataSeccion>[3],
      env.tipos as unknown as ConstructorParameters<typeof ReemplazarMetadataSeccion>[4]),
  }
}
test('metadata: lectura y reemplazo comprueban su permiso antes de acceder', async () => {
  const env = entorno('MetadataSeccion'); env.opciones.permitir = false
  await assert.rejects(casos(env).obtener.ejecutar(actor, 2n), /Acceso denegado/)
  await assert.rejects(casos(env).reemplazar.ejecutar(contexto, 2n, antes, {}), /Acceso denegado/)
  assert.equal(env.llamadas.length, 0)
  assert.deepEqual(env.permisos, [...codigosPermisoCms('metadata_seccion', 'read'), ...codigosPermisoCms('metadata_seccion', 'manage')])
})
test('metadata: devuelve proyección de la sección con su versión', async () => {
  const env = entorno('MetadataSeccion')
  const resultado = await casos(env).obtener.ejecutar(actor, 2n)
  assert.equal(resultado.contenidoSeccionId, 2n)
  assert.deepEqual(resultado.metadata, { cta: 'Cotizar' })
})
test('metadata: baja lógica solo se consulta con super_admin y nunca se modifica', async () => {
  const env = entorno('MetadataSeccion'); env.actual.eliminar(despues)
  await assert.rejects(casos(env).obtener.ejecutar(actor, 2n), /no disponible/)
  env.opciones.superAdmin = true
  assert.ok(await casos(env).obtener.ejecutar(actor, 2n))
  await assert.rejects(casos(env).reemplazar.ejecutar(contexto, 2n, despues, {}), /no disponible/)
})
test('metadata: rechaza versión obsoleta antes de persistir', async () => {
  const env = entorno('MetadataSeccion')
  await assert.rejects(casos(env).reemplazar.ejecutar(contexto, 2n, despues, {}), /modificado/)
  assert.equal(env.llamadas.filter(x => x.operacion === 'reemplazar').length, 0)
})
test('metadata: rechaza JSON inválido y claves no declaradas', async () => {
  const env = entorno('MetadataSeccion')
  for (const metadata of [null, [], { desconocida: true }, { cta: Infinity }]) {
    await assert.rejects(casos(env).reemplazar.ejecutar(contexto, 2n, antes, metadata))
  }
  assert.equal(env.llamadas.filter(x => x.operacion === 'reemplazar').length, 0)
})
test('metadata: reemplaza con ID, versión y contexto de sección', async () => {
  const env = entorno('MetadataSeccion')
  const resultado = await casos(env).reemplazar.ejecutar(contexto, 2n, antes, { cta: 'Consultar' })
  assert.deepEqual(resultado.metadata, { cta: 'Consultar' })
  const cambio = env.llamadas.find(x => x.operacion === 'reemplazar')!
  assert.equal(cambio.args[0], 2n)
  assert.equal(cambio.args[2].getTime(), antes.getTime())
  assert.equal(cambio.args[3].ipAddress, contexto.ipAddress)
  assert.ok(cambio.args[3].cuando > antes)
})
test('metadata: cambio concurrente durante lectura no entrega proyección inconsistente', async () => {
  const env = entorno('MetadataSeccion')
  const repo = { obtener: async () => ({ contenidoSeccionId: 2n, empresaId: 1n, tipoSeccionId: 2n, metadata: {}, actualizadoEn: despues }) }
  const caso = new ObtenerMetadataSeccion(repo as unknown as ConstructorParameters<typeof ObtenerMetadataSeccion>[0], env.auth,
    env.secciones as unknown as ConstructorParameters<typeof ObtenerMetadataSeccion>[2])
  await assert.rejects(caso.ejecutar(actor, 2n), /modificado/)
})
