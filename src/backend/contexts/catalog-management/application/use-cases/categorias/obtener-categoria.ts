import type { RepositorioCategorias } from '../../ports/repositorio-categorias.js'
import type { Categoria } from '../../../domain/categoria.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCatalogo } from '../../acceso-catalogo.js'
export class ObtenerCategoria {
  constructor(private readonly repositorio: RepositorioCategorias, private readonly autorizar: AutorizacionCatalogo) {}
  async ejecutar(actor: string, id: bigint): Promise<Categoria> {
    await exigirLectura(this.autorizar, actor, 'categorias')
    const registro = await this.repositorio.buscarPorId(id, await puedeVerEliminados(this.autorizar, actor))
    if (!registro) throw new Error('Registro no disponible')
    return registro
  }
}
