import { Email } from '../../../../../shared/domain/value-objects.js'
import type { RepositorioSuscriptores } from '../../ports/repositorio-suscriptores.js'
import type { RepositorioEmpresas } from '../../ports/repositorio-empresas.js'
import { exigirGestion, type AutorizacionCrm } from '../../acceso-crm.js'
import { textoOpcionalCrm } from '../../validaciones-crm.js'
import { idCRM } from '../../../domain/commercial-values.js'

export class CrearSuscriptor {
  constructor(private readonly suscriptores: RepositorioSuscriptores,
    private readonly empresas: RepositorioEmpresas, private readonly autorizar: AutorizacionCrm) {}
  async ejecutar(actorId: string, datos: { empresaId: bigint; email: string; nombre: string | null }) {
    await exigirGestion(this.autorizar, actorId, 'suscriptores')
    const empresaId = idCRM(datos.empresaId)
    const email = Email.create(datos.email)
    const nombre = textoOpcionalCrm(datos.nombre, 'Nombre')
    const empresa = await this.empresas.buscarPorId(empresaId, false)
    if (empresa?.estado !== 'activo') throw new Error('Empresa no disponible')
    // La restricción UNIQUE del repositorio confirma esto bajo concurrencia.
    if (await this.suscriptores.buscarPorEmail(email, true)) throw new Error('Email ya registrado')
    return this.suscriptores.crear({ empresaId, email, nombre }, actorId)
  }
}
