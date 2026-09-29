import { Email } from '../../../../../shared/domain/value-objects.js'
import type { RepositorioContactosEntrantes } from '../../ports/repositorio-contactos-entrantes.js'
import type { RepositorioEmpresas } from '../../ports/repositorio-empresas.js'
import { exigirGestion, type AutorizacionCrm } from '../../acceso-crm.js'
import { textoOpcionalCrm } from '../../validaciones-crm.js'
import { idCRM, textoCRM } from '../../../domain/commercial-values.js'
import { ContactoEntrante } from '../../../domain/contacto-entrante.js'

export class CrearContacto {
  constructor(private readonly contactos: RepositorioContactosEntrantes,
    private readonly empresas: RepositorioEmpresas, private readonly autorizar: AutorizacionCrm) {}
  async ejecutar(actorId: string, datos: { empresaId: bigint; nombre: string; empresaDeclarada: string | null;
    telefono: string; email: string; mensaje: string }) {
    await exigirGestion(this.autorizar, actorId, 'contactos')
    const ahora = new Date()
    const contacto = new ContactoEntrante({ id: 1n, empresaId: idCRM(datos.empresaId),
      nombre: textoCRM(datos.nombre, 'Nombre'),
      empresaDeclarada: textoOpcionalCrm(datos.empresaDeclarada, 'Empresa declarada'),
      telefono: textoCRM(datos.telefono, 'Teléfono'), email: Email.create(datos.email),
      mensaje: textoCRM(datos.mensaje, 'Mensaje'), estado: 'nuevo',
      fechas: { creadoEn: ahora, actualizadoEn: ahora, eliminadoEn: null } })
    if (contacto.mensaje.length > 16000) throw new Error('Mensaje demasiado largo')
    const empresa = await this.empresas.buscarPorId(contacto.empresaId, false)
    if (empresa?.estado !== 'activo') throw new Error('Empresa no disponible')
    return this.contactos.crear({ empresaId: contacto.empresaId, nombre: contacto.nombre,
      empresaDeclarada: contacto.empresaDeclarada, telefono: contacto.telefono,
      email: contacto.email, mensaje: contacto.mensaje }, actorId)
  }
}
