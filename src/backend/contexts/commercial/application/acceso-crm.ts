// Contrato estructural: en composición puede recibir ExigirPermiso de IAM.
export interface AutorizacionCrm {
    ejecutar(actorId: string, codigo: string): Promise<void>
    tienePermiso(actorId: string, codigo: string): Promise<boolean>
    tieneRolActivo(actorId: string, slugs: readonly string[]): Promise<boolean>
}
export type RecursoCrm = 'empresas' | 'sucursales' | 'contactos' | 'suscriptores' | 'leads'

export function exigirLectura(autorizar: AutorizacionCrm, actorId: string, recurso: RecursoCrm) {
    return autorizar.ejecutar(actorId, `crm.${recurso}.read`)
}

export function exigirGestion(autorizar: AutorizacionCrm, actorId: string, recurso: RecursoCrm) {
    return autorizar.ejecutar(actorId, `crm.${recurso}.manage`)
}

export function puedeVerEliminados(autorizar: AutorizacionCrm, actorId: string) {
    return autorizar.tieneRolActivo(actorId, ['super_admin'])
}
