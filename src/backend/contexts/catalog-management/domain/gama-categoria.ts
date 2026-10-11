import { RegistroCatalogo } from './catalog-values.js'
import type { EstadoCatalogo, FechasCatalogo } from './catalog-values.js'
import { idGama, nombreGama, textoOpcionalGama, enlaceGama } from './gama-values.js'
import type { GrupoColumnaGama } from './grupo-columna-gama.js'
import type { GrupoFilaGama } from './grupo-fila-gama.js'
import type { ColumnaGama } from './columna-gama.js'
import type { FilaGama } from './fila-gama.js'
import type { ValorGama } from './valor-gama.js'
export type EstructuraGama = Readonly<{ gruposColumnas: readonly GrupoColumnaGama[]; columnas: readonly ColumnaGama[]; gruposFilas: readonly GrupoFilaGama[]; filas: readonly FilaGama[]; valores: readonly ValorGama[] }>
export class GamaCategoria extends RegistroCatalogo {
  readonly id: bigint
  readonly categoriaId: bigint
  readonly productoId: bigint
  readonly gamaOrigenId: bigint | null
  private _titulo: string
  private _descripcion: string | null
  private _imagen: string | null
  constructor(d: { id: bigint; categoriaId: bigint; productoId: bigint; gamaOrigenId: bigint | null; titulo: string; descripcion: string | null; imagen: string | null; estado: EstadoCatalogo; fechas: FechasCatalogo }) {
    super(d.estado, d.fechas)
    this.id = idGama(d.id); this.categoriaId = idGama(d.categoriaId); this.productoId = idGama(d.productoId)
    this.gamaOrigenId = d.gamaOrigenId === null ? null : idGama(d.gamaOrigenId)
    if (this.gamaOrigenId === this.id) throw new Error('Una gama no puede copiarse de sí misma')
    this._titulo = nombreGama(d.titulo); this._descripcion = textoOpcionalGama(d.descripcion); this._imagen = enlaceGama(d.imagen)
  }
  get titulo(): string { return this._titulo }
  get descripcion(): string | null { return this._descripcion }
  get imagen(): string | null { return this._imagen }
  editar(d: { titulo: string; descripcion: string | null; imagen: string | null }, cuando: Date): void {
    const titulo = nombreGama(d.titulo), descripcion = textoOpcionalGama(d.descripcion), imagen = enlaceGama(d.imagen)
    this.tocar(cuando); this._titulo = titulo; this._descripcion = descripcion; this._imagen = imagen
  }
  exigirOrigen(origen: GamaCategoria): void {
    if (this.gamaOrigenId !== origen.id || this.productoId !== origen.productoId || this.categoriaId === origen.categoriaId || origen.estado !== 'activo') throw new Error('Origen de gama incompatible')
  }
  /** Aplicación/repositorio deben invocarla con la estructura completa antes de persistir en una transacción. */
  validarEstructura(e: EstructuraGama): void {
    const grupos = [e.gruposColumnas, e.columnas, e.gruposFilas, e.filas]
    for (const lista of grupos) {
      const ids = new Set<bigint>(), ordenes = new Set<number>()
      for (const item of lista) {
        if (item.gamaId !== this.id || ids.has(item.id)) throw new Error('Elemento ajeno o identidad duplicada en gama')
        ids.add(item.id)
        if (item.estado !== 'eliminado') {
          if (ordenes.has(item.orden)) throw new Error('Orden duplicado en gama')
          ordenes.add(item.orden)
        }
      }
    }
    for (const lista of [e.gruposColumnas, e.gruposFilas, e.filas]) {
      const codigos = new Set<string>()
      for (const item of lista.filter(i => i.estado !== 'eliminado')) {
        if (codigos.has(item.codigo)) throw new Error('Código duplicado en gama')
        codigos.add(item.codigo)
      }
    }
    const atributos = new Set<bigint>()
    for (const c of e.columnas) {
      if (c.estado !== 'eliminado') {
        if (atributos.has(c.atributoId)) throw new Error('Atributo duplicado en gama')
        atributos.add(c.atributoId)
      }
      if (c.presentacion.grupoId !== null && !e.gruposColumnas.some(g => g.id === c.presentacion.grupoId)) throw new Error('Grupo de columna no disponible')
    }
    for (const f of e.filas) if (f.detalle.grupoId !== null && !e.gruposFilas.some(g => g.id === f.detalle.grupoId)) throw new Error('Grupo de fila no disponible')
    const celdas = new Set<string>()
    for (const v of e.valores) {
      const columna = e.columnas.find(c => c.id === v.columnaId), fila = e.filas.find(f => f.id === v.filaId)
      const clave = `${v.filaId}:${v.columnaId}`
      if (v.gamaId !== this.id || !columna || !fila || celdas.has(clave)) throw new Error('Celda ajena o duplicada en gama')
      v.valor.exigirTipo(columna.tipoDato); celdas.add(clave)
    }
  }
}
