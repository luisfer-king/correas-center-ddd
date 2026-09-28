export interface ConsultaAutorizacion {
    permisosEfectivos(usuarioId: string): Promise<ReadonlySet<string>>
    tieneRolActivo(usuarioId: string, slugs: readonly string[]): Promise<boolean>
}