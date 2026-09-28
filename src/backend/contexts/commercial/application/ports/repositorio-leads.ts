import type { Lead } from '../../domain/lead.js'

export type DatosNuevoLead = {
    empresaId: bigint
    contactoId: bigint | null
    responsableId: string | null
}

export interface RepositorioLeads {
    buscarPorId(id: string, incluirEliminados: boolean): Promise<Lead | null>
    buscarPorContactoId(contactoId: bigint, incluirEliminados: boolean): Promise<Lead | null>
    listar(pagina: number, incluirEliminados: boolean): Promise<readonly Lead[]>
    crear(datos: DatosNuevoLead, actorId: string): Promise<Lead>
    guardar(lead: Lead, versionAnterior: Date, actorId: string): Promise<void>
}
