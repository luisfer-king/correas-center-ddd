import type { TxCatalogo } from './operaciones-catalogo.js'
import type { RepositorioGruposColumnasGama, DatosNuevaGrupoColumnaGama } from '../application/ports/repositorio-grupos-columnas-gama.js'
import { GrupoColumnaGama } from '../domain/grupo-columna-gama.js'
import { aGrupoColumnaGama, datosGrupoColumnaGama } from './mappers/grupo-columna-gama.js'
import { siguienteOrdenGama } from '../domain/gama-values.js'
import { comprobarEntidadGama, validarPermutacion } from './operaciones-gamas.js'
/** Adaptador interno ligado a la transacción de PrismaUnidadTrabajoGamas. */
export class PrismaGruposColumnasGama implements RepositorioGruposColumnasGama {
  constructor(private readonly tx: TxCatalogo, private readonly gamaId: bigint, private readonly cuando: Date) {}
  async listar(incluirEliminados = false): Promise<readonly GrupoColumnaGama[]> {
    return (await this.tx.grupoColumnaGama.findMany({ where: { gamaId: this.gamaId, ...(incluirEliminados ? {} : { estado: { not: 'eliminado' as const } }) }, orderBy: [{ orden: 'asc' }, { id: 'asc' }] })).map(aGrupoColumnaGama)
  }
  async crear(d: DatosNuevaGrupoColumnaGama): Promise<GrupoColumnaGama> {
    
    const orden = siguienteOrdenGama(await this.listar())
    const candidato = new GrupoColumnaGama({ ...{ codigo: d.codigo, nombre: d.nombre }, id: 1n, gamaId: this.gamaId, orden, estado: 'activo', fechas: { creadoEn: this.cuando, actualizadoEn: this.cuando, eliminadoEn: null } })
    const f = await this.tx.grupoColumnaGama.create({ data: { ...datosGrupoColumnaGama(candidato), gamaId: this.gamaId, creadoEn: this.cuando, actualizadoEn: this.cuando } })
    return aGrupoColumnaGama(f)
  }
  async guardar(e: GrupoColumnaGama): Promise<void> {
    comprobarEntidadGama(e, this.gamaId, this.cuando)
    const anterior = await this.tx.grupoColumnaGama.findFirst({ where: { id: e.id, gamaId: this.gamaId, estado: { not: 'eliminado' } } })
    if (!anterior) throw new Error('Elemento no disponible en la gama')
    if (e.codigo !== anterior.codigo) throw new Error('Código inmutable')
    await this.tx.grupoColumnaGama.update({ where: { id: e.id }, data: { ...datosGrupoColumnaGama(e), actualizadoEn: this.cuando } })
  }
  async reordenar(ids: readonly bigint[]): Promise<void> {
    const actuales = await this.listar()
    const desplazamiento = validarPermutacion(ids, actuales)
    for (let i = 0; i < ids.length; i++) await this.tx.grupoColumnaGama.update({ where: { id: ids[i] }, data: { orden: desplazamiento + i + 1 } })
    for (let i = 0; i < ids.length; i++) await this.tx.grupoColumnaGama.update({ where: { id: ids[i] }, data: { orden: i + 1, actualizadoEn: this.cuando } })
  }
}
