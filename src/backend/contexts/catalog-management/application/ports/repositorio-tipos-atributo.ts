import type { TipoAtributo, CapacidadesAtributo } from '../../domain/tipo-atributo.js'
import type { Slug, Orden } from '../../../../shared/domain/value-objects.js'

export type DatosNuevoTipoAtributo = { nombre: string; slug: Slug; descripcion: string | null; icono: string | null; capacidades: CapacidadesAtributo; orden: Orden }

export interface RepositorioTiposAtributo {
  buscarPorId(id: bigint, incluirEliminados: boolean): Promise<TipoAtributo | null>
  buscarPorSlug(slug: string, incluirEliminados: boolean): Promise<TipoAtributo | null>
  listar(pagina: number, incluirEliminados: boolean): Promise<readonly TipoAtributo[]>
  crear(datos: DatosNuevoTipoAtributo, actorId: string): Promise<TipoAtributo>
  guardar(registro: TipoAtributo, versionAnterior: Date, actorId: string): Promise<void>
}
