import type { RepositorioSuscriptores } from '../../ports/repositorio-suscriptores.js'
import { exigirGestion, type AutorizacionCrm } from '../../acceso-crm.js'
import { fechaCambioCrm, type RelojCrm } from '../../fecha-cambio-crm.js'
import { textoOpcionalCrm } from '../../validaciones-crm.js'

export class EditarSuscriptor {
  constructor(private readonly suscriptores: RepositorioSuscriptores, private readonly autorizar: AutorizacionCrm,
    private readonly reloj: RelojCrm) {}
  async ejecutar(actorId: string, id: bigint, nombre: string | null) {
    await exigirGestion(this.autorizar, actorId, 'suscriptores')
    const suscriptor = await this.suscriptores.buscarPorId(id, false)
    if (!suscriptor) throw new Error('Suscriptor no disponible')
    const version = suscriptor.actualizadoEn
    suscriptor.editarNombre(textoOpcionalCrm(nombre, 'Nombre'), fechaCambioCrm(this.reloj, version))
    await this.suscriptores.guardar(suscriptor, version, actorId)
    return suscriptor
  }
}
