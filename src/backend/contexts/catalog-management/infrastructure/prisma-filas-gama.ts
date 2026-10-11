import type { TxCatalogo } from './operaciones-catalogo.js'
import type { RepositorioFilasGama, DatosNuevaFilaGama } from '../application/ports/repositorio-filas-gama.js'
import { FilaGama } from '../domain/fila-gama.js'
import { aFilaGama, datosFilaGama } from './mappers/fila-gama.js'
import { siguienteOrdenGama } from '../domain/gama-values.js'
import { comprobarEntidadGama, validarPermutacion, referenciaGrupo } from './operaciones-gamas.js'
/** Adaptador interno ligado a la transacción de PrismaUnidadTrabajoGamas. */
export class PrismaFilasGama implements RepositorioFilasGama {
  constructor(private readonly tx: TxCatalogo, private readonly gamaId: bigint, private readonly cuando: Date) {}
  async listar(incluirEliminados = false): Promise<readonly FilaGama[]> {
    return (await this.tx.filaGama.findMany({ where: { gamaId: this.gamaId, ...(incluirEliminados ? {} : { estado: { not: 'eliminado' as const } }) }, orderBy: [{ orden: 'asc' }, { id: 'asc' }] })).map(aFilaGama)
  }
  async crear(d: DatosNuevaFilaGama): Promise<FilaGama> {
    await referenciaGrupo(this.tx, 'fila', this.gamaId, d.grupoId)
    const orden = siguienteOrdenGama(await this.listar())
    const candidato = new FilaGama({ ...{ codigo: d.codigo, grupoId: d.grupoId, nombre: d.nombre, descripcion: d.descripcion, enlaceDetalle: d.enlaceDetalle }, id: 1n, gamaId: this.gamaId, orden, estado: 'activo', fechas: { creadoEn: this.cuando, actualizadoEn: this.cuando, eliminadoEn: null } })
    const f = await this.tx.filaGama.create({ data: { ...datosFilaGama(candidato), gamaId: this.gamaId, creadoEn: this.cuando, actualizadoEn: this.cuando } })
    return aFilaGama(f)
  }
  async guardar(e: FilaGama): Promise<void> {
    comprobarEntidadGama(e, this.gamaId, this.cuando)
    const anterior = await this.tx.filaGama.findFirst({ where: { id: e.id, gamaId: this.gamaId, estado: { not: 'eliminado' } } })
    if (!anterior) throw new Error('Elemento no disponible en la gama')
    if (e.codigo !== anterior.codigo) throw new Error('Código inmutable')
    if (e.estado !== 'eliminado') await referenciaGrupo(this.tx, 'fila', this.gamaId, e.detalle.grupoId)
    await this.tx.filaGama.update({ where: { id: e.id }, data: { ...datosFilaGama(e), actualizadoEn: this.cuando } })
  }
  async reordenar(ids: readonly bigint[]): Promise<void> {
    const actuales = await this.listar()
    const desplazamiento = validarPermutacion(ids, actuales)
    for (let i = 0; i < ids.length; i++) await this.tx.filaGama.update({ where: { id: ids[i] }, data: { orden: desplazamiento + i + 1 } })
    for (let i = 0; i < ids.length; i++) await this.tx.filaGama.update({ where: { id: ids[i] }, data: { orden: i + 1, actualizadoEn: this.cuando } })
  }
}
