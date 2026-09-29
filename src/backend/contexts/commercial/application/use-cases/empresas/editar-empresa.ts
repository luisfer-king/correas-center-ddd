import type { RepositorioEmpresas } from '../../ports/repositorio-empresas.js'
import { exigirGestion, type AutorizacionCrm } from '../../acceso-crm.js'
import { fechaCambioCrm, type RelojCrm } from '../../fecha-cambio-crm.js'
import { logoCrm } from '../../validaciones-crm.js'

export class EditarEmpresa {
  constructor(private readonly empresas: RepositorioEmpresas, private readonly autorizar: AutorizacionCrm,
    private readonly reloj: RelojCrm) {}
  async ejecutar(actorId: string, id: bigint, datos: { nombre: string; logo: string | null }) {
    await exigirGestion(this.autorizar, actorId, 'empresas')
    const empresa = await this.empresas.buscarPorId(id, false)
    if (!empresa) throw new Error('Empresa no disponible')
    const version = empresa.actualizadoEn
    empresa.editar(datos.nombre, logoCrm(datos.logo), fechaCambioCrm(this.reloj, version))
    await this.empresas.guardar(empresa, version, actorId)
    return empresa
  }
}
