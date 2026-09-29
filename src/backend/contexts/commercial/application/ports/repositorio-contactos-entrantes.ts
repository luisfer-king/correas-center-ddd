import type { Email } from '../../../../shared/domain/value-objects.js'
import type { ContactoEntrante } from '../../domain/contacto-entrante.js'

export type DatosNuevoContactoEntrante = {
    empresaId: bigint
    nombre: string
    empresaDeclarada: string | null
    telefono: string
    email: Email
    mensaje: string
}

export interface RepositorioContactosEntrantes {
    buscarPorId(id: bigint, incluirEliminados: boolean): Promise<ContactoEntrante | null>
    listar(pagina: number, incluirEliminados: boolean): Promise<readonly ContactoEntrante[]>
    crear(datos: DatosNuevoContactoEntrante, actorId: string): Promise<ContactoEntrante>
    /** Solo persiste cambios de estado o baja; el mensaje original no se edita. */
    guardar(contacto: ContactoEntrante, versionAnterior: Date, actorId: string): Promise<void>
}
