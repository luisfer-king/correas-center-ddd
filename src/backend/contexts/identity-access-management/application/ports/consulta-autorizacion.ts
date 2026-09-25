export interface ConsultaAutorizacion {
    permisosEfectivos(usuarioId: string): Promise<ReadonlySet<string>>
}