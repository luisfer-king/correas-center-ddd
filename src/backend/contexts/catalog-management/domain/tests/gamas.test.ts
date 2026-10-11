import assert from 'node:assert/strict'
import { test } from 'node:test'
import { GamaCategoria } from '../gama-categoria.js'
import { PlantillaGamaProducto } from '../plantilla-gama-producto.js'
import { GrupoColumnaGama } from '../grupo-columna-gama.js'
import { GrupoFilaGama } from '../grupo-fila-gama.js'
import { ColumnaGama } from '../columna-gama.js'
import { FilaGama } from '../fila-gama.js'
import { ValorGama } from '../valor-gama.js'
import { ValorTecnico } from '../valor-tecnico.js'
import { AsignacionAtributo } from '../asignacion-atributo.js'
import { AtributoTecnico } from '../atributo-tecnico.js'
import { Orden } from '../../../../shared/domain/value-objects.js'
import { siguienteOrdenGama, enlaceGama, idGama } from '../gama-values.js'
const fecha = new Date('2026-10-10T00:00:00Z')
const despues = new Date('2026-10-10T00:01:00Z')
const base = { estado: 'activo' as const, fechas: { creadoEn: fecha, actualizadoEn: fecha, eliminadoEn: null } }
const gama = (id = 1n, productoId = 1n, origen: bigint | null = null) => new GamaCategoria({ ...base, id, categoriaId: id, productoId, gamaOrigenId: origen, titulo: 'Gama', descripcion: null, imagen: '/storage/esquema.webp' })
const columna = (id = 1n, gamaId = 1n, orden = 1) => new ColumnaGama({ ...base, id, gamaId, atributoId: id, tipoDato: 'numero', grupoId: null, etiqueta: null, unidadMedida: 'mm', orden })
const fila = (id = 1n, gamaId = 1n, orden = 1) => new FilaGama({ ...base, id, gamaId, codigo: `fila-${id}`, grupoId: null, nombre: 'Sección A', descripcion: null, enlaceDetalle: '/products/correas/a/', orden })
const estructura = () => ({ gruposColumnas: [], columnas: [columna()], gruposFilas: [], filas: [fila()], valores: [] })
test('valores conservan precisión, cero, false y texto vacío; rechazan coerciones', () => {
  for (const valor of ['0', '-0.001', '123456789012345678901234567890.123456789']) assert.equal(ValorTecnico.crear({ tipo: 'numero', valor }).valor, valor)
  assert.equal(ValorTecnico.crear({ tipo: 'booleano', valor: false }).valor, false)
  assert.equal(ValorTecnico.crear({ tipo: 'texto', valor: '' }).valor, '')
  for (const valor of ['NaN', 'Infinity', '1e3', '1,2', '']) assert.throws(() => ValorTecnico.crear({ tipo: 'numero', valor }))
  assert.throws(() => ValorTecnico.crear({ tipo: 'numero', valor: '1' }).exigirTipo('texto'))
})
test('plantilla pertenece al mismo producto y la copia se edita independientemente', () => {
  const original = gama(), copia = gama(2n, 1n, 1n)
  copia.exigirOrigen(original)
  copia.editar({ titulo: 'Gama B', descripcion: null, imagen: null }, despues)
  assert.equal(original.titulo, 'Gama')
  const plantilla = new PlantillaGamaProducto({ productoId: 1n, gama: original, creadoEn: fecha, actualizadoEn: fecha })
  assert.throws(() => plantilla.seleccionar(gama(3n, 2n), despues))
  assert.equal(plantilla.gamaId, 1n)
  plantilla.seleccionar(copia, despues)
  assert.equal(plantilla.gamaId, 2n)
  assert.throws(() => gama(1n, 1n, 1n))
  assert.throws(() => gama(3n, 2n, 1n).exigirOrigen(original))
  copia.inactivar(despues)
  assert.throws(() => plantilla.seleccionar(copia, despues))
})
test('estructura rechaza identidades ajenas, órdenes y atributos repetidos', () => {
  const g = gama()
  assert.doesNotThrow(() => g.validarEstructura(estructura()))
  assert.throws(() => g.validarEstructura({ ...estructura(), filas: [fila(2n, 2n)] }))
  assert.throws(() => g.validarEstructura({ ...estructura(), filas: [fila(), fila(2n)] }))
  const c = new ColumnaGama({ ...base, id: 2n, gamaId: 1n, atributoId: 1n, tipoDato: 'numero', grupoId: null, etiqueta: null, unidadMedida: null, orden: 2 })
  assert.throws(() => g.validarEstructura({ ...estructura(), columnas: [columna(), c] }))
})
test('grupos de filas y encabezados son independientes y sus referencias se validan', () => {
  const gc = new GrupoColumnaGama({ ...base, id: 1n, gamaId: 1n, codigo: 'fabricacion', nombre: 'Fabricación', orden: 1 })
  const gf = new GrupoFilaGama({ ...base, id: 1n, gamaId: 1n, codigo: 'clasicas', nombre: 'Clásicas', orden: 1 })
  const c = columna(), f = fila()
  c.editar({ ...c.presentacion, grupoId: 1n }, despues)
  f.editar({ ...f.detalle, grupoId: 1n }, despues)
  const e = { gruposColumnas: [gc], columnas: [c], gruposFilas: [gf], filas: [f], valores: [] }
  assert.doesNotThrow(() => gama().validarEstructura(e))
  assert.throws(() => gama().validarEstructura({ ...e, gruposColumnas: [] }))
  assert.throws(() => gama().validarEstructura({ ...e, gruposFilas: [] }))
})
test('celdas opcionales, pero las presentes deben corresponder a fila, columna y tipo', () => {
  const v = new ValorGama({ filaId: 1n, columnaId: 1n, gamaId: 1n, tipoDato: 'numero', valor: ValorTecnico.crear({ tipo: 'numero', valor: '13' }), creadoEn: fecha, actualizadoEn: fecha })
  assert.doesNotThrow(() => gama().validarEstructura({ ...estructura(), valores: [v] }))
  assert.throws(() => gama().validarEstructura({ ...estructura(), valores: [v, v] }))
  assert.throws(() => gama().validarEstructura({ ...estructura(), filas: [], valores: [v] }))
  assert.throws(() => v.cambiar(ValorTecnico.crear({ tipo: 'texto', valor: '13' }), despues))
  assert.equal(v.valor.valor, '13')
})
test('órdenes comienzan en uno e incluyen inactivos; eliminados liberan posición', () => {
  assert.equal(siguienteOrdenGama([]), 1)
  assert.equal(siguienteOrdenGama([{ orden: 2, estado: 'inactivo' }, { orden: 9, estado: 'eliminado' }]), 3)
  assert.throws(() => fila(1n, 1n, 0))
  const f = fila(2n); f.eliminar(despues)
  assert.doesNotThrow(() => gama().validarEstructura({ ...estructura(), filas: [fila(), f] }))
  assert.throws(() => f.reordenar(2, despues))
})
test('ediciones inválidas son atómicas; fechas y vistas no exponen estado mutable', () => {
  const f = fila(); assert.throws(() => f.editar({ ...f.detalle, nombre: '' }, despues))
  assert.equal(f.detalle.nombre, 'Sección A'); assert.equal(f.actualizadoEn.getTime(), fecha.getTime())
  const fechaExterna = f.creadoEn; fechaExterna.setFullYear(2000)
  assert.equal(f.creadoEn.getFullYear(), 2026)
  const detalle = f.detalle; Reflect.set(detalle, 'nombre', 'Alterado')
  assert.equal(f.detalle.nombre, 'Sección A')
  assert.throws(() => idGama(9223372036854775808n))
  for (const url of ['javascript:alert(1)', '//otro.test', '/\\otro.test', 'https://usuario:clave@otro.test']) assert.throws(() => enlaceGama(url))
})
test('asignación general sigue aceptando el contrato numérico heredado', () => {
  const a = new AsignacionAtributo({ ...base, id: 1n, categoriaId: 1n, atributoId: 1n, valorPersonalizado: '13', orden: Orden.create(0) })
  assert.equal(a.tipoDato, 'numero'); a.personalizar('14.5', despues); assert.equal(a.valorPersonalizado, '14.5')
  a.personalizar(null, despues); assert.equal(a.valor, null)
})
test('asignación tipada distingue falso de ausente y evita escrituras numéricas heredadas', () => {
  const a = new AsignacionAtributo({ ...base, id: 1n, categoriaId: 1n, atributoId: 1n, tipoDato: 'booleano', valorPersonalizado: null, valorBooleano: false, orden: Orden.create(1) })
  assert.equal(a.valorBooleano, false)
  assert.throws(() => a.personalizar(null, despues)); assert.equal(a.valorBooleano, false)
  assert.throws(() => a.personalizarValor(ValorTecnico.crear({ tipo: 'numero', valor: '1' }), despues))
  a.personalizarValor(null, despues); assert.equal(a.valor, null)
})
test('atributo de texto no acepta valor numérico heredado', () => {
  assert.throws(() => new AtributoTecnico({ ...base, id: 1n, tipoAtributoId: 1n, tipoDato: 'texto', nombre: 'Material', valores: { descripcion: null, valorNumerico: '1', unidadMedida: null }, orden: Orden.create(1) }))
})
