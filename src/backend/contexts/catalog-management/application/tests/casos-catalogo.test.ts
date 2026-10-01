import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Orden, Slug } from '../../../../shared/domain/value-objects.js'
import { Marca } from '../../domain/marca.js'
import type { AutorizacionCatalogo } from '../acceso-catalogo.js'
import type { RepositorioMarcas } from '../ports/repositorio-marcas.js'
import { CrearMarca } from '../use-cases/marcas/crear-marca.js'
import { EditarMarca } from '../use-cases/marcas/editar-marca.js'
import { EliminarMarca } from '../use-cases/marcas/eliminar-marca.js'
import { ListarMarcas } from '../use-cases/marcas/listar-marcas.js'
const actor = '11111111-1111-4111-8111-111111111111'
const fecha = new Date('2026-09-20T00:00:00.000Z')
function preparar(permitir = true) {
  const permisos: string[] = []
  const marca = new Marca({
    id: 1n, nombre: 'SKF', slug: Slug.create('skf'), logo: null,
    orden: Orden.create(0), estado: 'activo', fechas: { creadoEn: fecha, actualizadoEn: fecha, eliminadoEn: null }
  })
  let inclusivo = false
  let guardado: Date | null = null
  const repo: RepositorioMarcas = {
    buscarPorId: async () => marca, buscarPorSlug: async () => null,
    listar: async (_pagina, incluir) => { inclusivo = incluir; return [marca] },
    crear: async () => marca, guardar: async (_registro, version) => { guardado = version }
  }
  const autorizacion: AutorizacionCatalogo = {
    ejecutar: async (_actor, codigo) => {
      permisos.push(codigo); if (!permitir) throw new Error('Acceso denegado')
    },
    tienePermiso: async () => permitir, tieneRolActivo: async () => true
  }
  return { repo, autorizacion, marca, permisos, get inclusivo() { return inclusivo }, get guardado() { return guardado } }
}
test('lectura exige permiso y consulta visibilidad de eliminados', async () => {
  const c = preparar()
  assert.equal((await new ListarMarcas(c.repo, c.autorizacion).ejecutar(actor)).length, 1)
  assert.equal(c.inclusivo, true)
  assert.deepEqual(c.permisos, ['catalog.marcas.read'])
  const denegado = preparar(false)
  await assert.rejects(new ListarMarcas(denegado.repo, denegado.autorizacion).ejecutar(actor), /Acceso denegado/)
})
test('creación valida nombre convertible a slug y orden', async () => {
  const c = preparar()
  await assert.rejects(new CrearMarca(c.repo, c.autorizacion).ejecutar(actor, { nombre: '---', slug: 'valor-ignorado', logo: null, orden: 0 }), /Slug inválido/)
  await assert.rejects(new CrearMarca(c.repo, c.autorizacion).ejecutar(actor, { nombre: 'SKF', slug: 'skf', logo: null, orden: -1 }), /Orden inválido/)
  await new CrearMarca(c.repo, c.autorizacion).ejecutar(actor, { nombre: 'SKF', slug: 'skf', logo: null, orden: 0 })
  assert.deepEqual(c.permisos, Array(3).fill('catalog.marcas.manage'))
})
test('edición optimista conserva versión y baja lógica', async () => {
  const c = preparar()
  const actualizado = await new EditarMarca(c.repo, c.autorizacion, { ahora: () => fecha }).ejecutar(actor, 1n, { nombre: 'Nueva', logo: null })
  assert.equal(actualizado.nombre, 'Nueva')
  assert.equal(actualizado.actualizadoEn.getTime(), fecha.getTime() + 1)
  assert.equal(c.guardado?.getTime(), fecha.getTime())
  await new EliminarMarca(c.repo, c.autorizacion, { ahora: () => fecha }).ejecutar(actor, 1n)
  assert.equal(c.marca.estado, 'eliminado')
})
