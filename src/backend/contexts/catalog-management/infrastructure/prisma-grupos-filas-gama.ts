import type { TxCatalogo } from './operaciones-catalogo.js'
import type { RepositorioGruposFilasGama, DatosNuevaGrupoFilaGama } from '../application/ports/repositorio-grupos-filas-gama.js'
import { GrupoFilaGama } from '../domain/grupo-fila-gama.js'
import { aGrupoFilaGama, datosGrupoFilaGama } from './mappers/grupo-fila-gama.js'
import { siguienteOrdenGama } from '../domain/gama-values.js'
import { comprobarEntidadGama, validarPermutacion } from './operaciones-gamas.js'
/** Adaptador interno ligado a la transacción de PrismaUnidadTrabajoGamas. */
export class PrismaGruposFilasGama implements RepositorioGruposFilasGama {
  constructor(private readonly tx: TxCatalogo, private readonly gamaId: bigint, private readonly cuando: Date) {}
  async listar(incluirEliminados = false): Promise<readonly GrupoFilaGama[]> {
    return (await this.tx.grupoFilaGama.findMany({ where: { gamaId: this.gamaId, ...(incluirEliminados ? {} : { estado: { not: 'eliminado' as const } }) }, orderBy: [{ orden: 'asc' }, { id: 'asc' }] })).map(aGrupoFilaGama)
  }
  async crear(d: DatosNuevaGrupoFilaGama): Promise<GrupoFilaGama> {
    
    const orden = siguienteOrdenGama(await this.listar())
    const candidato = new GrupoFilaGama({ ...{ codigo: d.codigo, nombre: d.nombre }, id: 1n, gamaId: this.gamaId, orden, estado: 'activo', fechas: { creadoEn: this.cuando, actualizadoEn: this.cuando, eliminadoEn: null } })
    const f = await this.tx.grupoFilaGama.create({ data: { ...datosGrupoFilaGama(candidato), gamaId: this.gamaId, creadoEn: this.cuando, actualizadoEn: this.cuando } })
    return aGrupoFilaGama(f)
  }
  async guardar(e: GrupoFilaGama): Promise<void> {
    comprobarEntidadGama(e, this.gamaId, this.cuando)
    const anterior = await this.tx.grupoFilaGama.findFirst({ where: { id: e.id, gamaId: this.gamaId, estado: { not: 'eliminado' } } })
    if (!anterior) throw new Error('Elemento no disponible en la gama')
    if (e.codigo !== anterior.codigo) throw new Error('Código inmutable')
    await this.tx.grupoFilaGama.update({ where: { id: e.id }, data: { ...datosGrupoFilaGama(e), actualizadoEn: this.cuando } })
  }
  async reordenar(ids: readonly bigint[]): Promise<void> {
    const actuales = await this.listar()
    const desplazamiento = validarPermutacion(ids, actuales)
    for (let i = 0; i < ids.length; i++) await this.tx.grupoFilaGama.update({ where: { id: ids[i] }, data: { orden: desplazamiento + i + 1 } })
    for (let i = 0; i < ids.length; i++) await this.tx.grupoFilaGama.update({ where: { id: ids[i] }, data: { orden: i + 1, actualizadoEn: this.cuando } })
  }
}
