import type { RepositorioEmpresas } from '../../ports/repositorio-empresas.js'
import { exigirGestion, type AutorizacionCrm } from '../../acceso-crm.js'
import { fechaCambioCrm, type RelojCrm } from '../../fecha-cambio-crm.js'

export class EliminarEmpresa {
  constructor(private readonly repositorio: RepositorioEmpresas, private readonly autorizar: AutorizacionCrm,
    private readonly reloj: RelojCrm) {}
  async ejecutar(actorId: string, id: bigint): Promise<void> {
    await exigirGestion(this.autorizar, actorId, 'empresas')
    const empresa = await this.repositorio.buscarPorId(id, false)
    if (!empresa) throw new Error('Empresa no disponible')
    const version = empresa.actualizadoEn
    empresa.eliminar(fechaCambioCrm(this.reloj, version))
    await this.repositorio.guardar(empresa, version, actorId)
  }
}
