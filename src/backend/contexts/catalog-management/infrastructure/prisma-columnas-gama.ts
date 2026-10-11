import type { TxCatalogo } from './operaciones-catalogo.js'
import type { RepositorioColumnasGama, DatosNuevaColumnaGama } from '../application/ports/repositorio-columnas-gama.js'
import { ColumnaGama } from '../domain/columna-gama.js'
import { aColumnaGama, datosColumnaGama } from './mappers/columna-gama.js'
import { siguienteOrdenGama } from '../domain/gama-values.js'
import { comprobarEntidadGama, validarPermutacion, referenciaColumna, referenciaGrupo } from './operaciones-gamas.js'
/** Adaptador interno ligado a la transacción de PrismaUnidadTrabajoGamas. */
export class PrismaColumnasGama implements RepositorioColumnasGama {
  constructor(private readonly tx: TxCatalogo, private readonly gamaId: bigint, private readonly cuando: Date) {}
  async listar(incluirEliminados = false): Promise<readonly ColumnaGama[]> {
    return (await this.tx.columnaGama.findMany({ where: { gamaId: this.gamaId, ...(incluirEliminados ? {} : { estado: { not: 'eliminado' as const } }) }, orderBy: [{ orden: 'asc' }, { id: 'asc' }] })).map(aColumnaGama)
  }
  async crear(d: DatosNuevaColumnaGama): Promise<ColumnaGama> {
    await referenciaColumna(this.tx, d.atributoId, d.tipoDato)
    await referenciaGrupo(this.tx, 'columna', this.gamaId, d.grupoId)
    const orden = siguienteOrdenGama(await this.listar())
    const candidato = new ColumnaGama({ ...{ atributoId: d.atributoId, tipoDato: d.tipoDato, grupoId: d.grupoId, etiqueta: d.etiqueta, unidadMedida: d.unidadMedida }, id: 1n, gamaId: this.gamaId, orden, estado: 'activo', fechas: { creadoEn: this.cuando, actualizadoEn: this.cuando, eliminadoEn: null } })
    const f = await this.tx.columnaGama.create({ data: { ...datosColumnaGama(candidato), gamaId: this.gamaId, creadoEn: this.cuando, actualizadoEn: this.cuando } })
    return aColumnaGama(f)
  }
  async guardar(e: ColumnaGama): Promise<void> {
    comprobarEntidadGama(e, this.gamaId, this.cuando)
    const anterior = await this.tx.columnaGama.findFirst({ where: { id: e.id, gamaId: this.gamaId, estado: { not: 'eliminado' } } })
    if (!anterior) throw new Error('Elemento no disponible en la gama')
    if (e.atributoId !== anterior.atributoId || e.tipoDato !== anterior.tipoDato) throw new Error('Identidad de columna inmutable')
    if (e.estado !== 'eliminado') { await referenciaColumna(this.tx, e.atributoId, e.tipoDato); await referenciaGrupo(this.tx, 'columna', this.gamaId, e.presentacion.grupoId) }
    await this.tx.columnaGama.update({ where: { id: e.id }, data: { ...datosColumnaGama(e), actualizadoEn: this.cuando } })
  }
  async reordenar(ids: readonly bigint[]): Promise<void> {
    const actuales = await this.listar()
    const desplazamiento = validarPermutacion(ids, actuales)
    for (let i = 0; i < ids.length; i++) await this.tx.columnaGama.update({ where: { id: ids[i] }, data: { orden: desplazamiento + i + 1 } })
    for (let i = 0; i < ids.length; i++) await this.tx.columnaGama.update({ where: { id: ids[i] }, data: { orden: i + 1, actualizadoEn: this.cuando } })
  }
}
