import type { RepositorioEmpresas } from '../../ports/repositorio-empresas.js'
import { exigirGestion, type AutorizacionCrm } from '../../acceso-crm.js'
import { logoCrm } from '../../validaciones-crm.js'
import { textoCRM } from '../../../domain/commercial-values.js'

export class CrearEmpresa {
  constructor(private readonly empresas: RepositorioEmpresas, private readonly autorizar: AutorizacionCrm) {}
  async ejecutar(actorId: string, datos: { nombre: string; logo: string | null }) {
    await exigirGestion(this.autorizar, actorId, 'empresas')
    const nombre = textoCRM(datos.nombre, 'Nombre de empresa')
    return this.empresas.crear({ nombre, logo: logoCrm(datos.logo) }, actorId)
  }
}
