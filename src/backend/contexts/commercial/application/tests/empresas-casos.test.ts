import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { RepositorioEmpresas } from '../ports/repositorio-empresas.js'
import type { AutorizacionCrm } from '../acceso-crm.js'
import { Empresa } from '../../domain/empresa.js'
import { ListarEmpresas } from '../use-cases/empresas/listar-empresas.js'
import { EditarEmpresa } from '../use-cases/empresas/editar-empresa.js'

const actor = '11111111-1111-4111-8111-111111111111'
const t0 = new Date('2026-09-28T12:00:00Z')
function acceso(permisos: readonly string[], superAdmin = false): AutorizacionCrm {
  return { async ejecutar(_id, codigo) {
    if (!permisos.includes(codigo)) throw new Error('Acceso denegado')
  }, async tienePermiso(_id, codigo) { return permisos.includes(codigo) },
  async tieneRolActivo() { return superAdmin } }
}

test('empresas: listado exige lectura y solo el superadministrador pide eliminados', async () => {
  let consultas = 0
  let incluir = true
  const repositorio = { listar: async (_p: number, eliminados: boolean) => {
    consultas++; incluir = eliminados; return []
  } } as unknown as RepositorioEmpresas
  await assert.rejects(new ListarEmpresas(repositorio, acceso([])).ejecutar(actor), /Acceso denegado/)
  assert.equal(consultas, 0)
  await new ListarEmpresas(repositorio, acceso(['crm.empresas.read'])).ejecutar(actor)
  assert.equal(incluir, false)
  await new ListarEmpresas(repositorio, acceso(['crm.empresas.read'], true)).ejecutar(actor)
  assert.equal(incluir, true)
})

test('empresas: edición pasa la versión previa y genera una fecha posterior', async () => {
  const empresa = new Empresa({ id: 1n, nombre: 'Central', logo: null, estado: 'activo',
    fechas: { creadoEn: t0, actualizadoEn: t0, eliminadoEn: null } })
  let version: Date | null = null
  const repo = { buscarPorId: async () => empresa,
    guardar: async (_empresa: Empresa, anterior: Date) => { version = anterior } } as unknown as RepositorioEmpresas
  const resultado = await new EditarEmpresa(repo, acceso(['crm.empresas.manage']),
    { ahora: () => t0 }).ejecutar(actor, 1n, { nombre: 'Central SCZ', logo: null })
  assert.deepEqual(version, t0)
  assert.equal(resultado.nombre, 'Central SCZ')
  assert.ok(resultado.actualizadoEn > t0)
})
