export interface RepositorioMarcasProducto {
    actualizar(productoId: bigint, asignar: readonly bigint[], desasignar: readonly bigint[], actor: string): Promise<void>
}
