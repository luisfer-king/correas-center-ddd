import type { AtributoTecnico, ValoresAtributo } from '../../domain/atributo-tecnico.js'
import type { Orden } from '../../../../shared/domain/value-objects.js'

export type DatosNuevoAtributoTecnico = { tipoAtributoId: bigint; nombre: string; valores: ValoresAtributo; orden: Orden }

export interface RepositorioAtributosTecnicos {
  buscarPorId(id: bigint, incluirEliminados: boolean): Promise<AtributoTecnico | null>
  listar(pagina: number, incluirEliminados: boolean, tipoAtributoId?: bigint): Promise<readonly AtributoTecnico[]>
  crear(datos: DatosNuevoAtributoTecnico, actorId: string): Promise<AtributoTecnico>
  guardar(registro: AtributoTecnico, versionAnterior: Date, actorId: string): Promise<void>
}
