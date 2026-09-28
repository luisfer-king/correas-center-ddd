import type { Empresa } from '../../../domain/empresa.js'
import type { RepositorioEmpresas } from '../../ports/repositorio-empresas.js'
import { exigirLectura, puedeVerEliminados, type AutorizacionCrm } from '../../acceso-crm.js'

export class ObtenerEmpresa {
  constructor(private readonly repositorio: RepositorioEmpresas, private readonly autorizar: AutorizacionCrm) {}
  async ejecutar(actorId: string, id: bigint): Promise<Empresa> {
    await exigirLectura(this.autorizar, actorId, 'empresas')
    const empresa = await this.repositorio.buscarPorId(id, await puedeVerEliminados(this.autorizar, actorId))
    if (!empresa) throw new Error('Empresa no disponible')
    return empresa
  }
}
