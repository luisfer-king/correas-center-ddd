import type { PlantillaGamaProducto } from '../../domain/plantilla-gama-producto.js'
export interface RepositorioPlantillasGama {
  buscarPorProducto(productoId: bigint): Promise<PlantillaGamaProducto | null>
  /** null exige que aún no exista; Date exige coincidencia con la versión leída. */
  seleccionar(productoId: bigint, gamaId: bigint, versionAnterior: Date | null, actorId: string): Promise<PlantillaGamaProducto>
  quitar(productoId: bigint, versionAnterior: Date, actorId: string): Promise<void>
}
