import type { Prisma } from '../../../../generated/prisma/client.js'
import { PlantillaGamaProducto } from '../../domain/plantilla-gama-producto.js'
import { aGamaCategoria } from './gama-categoria.js'
export type FilaPlantillaGamaProducto = Prisma.PlantillaGamaProductoGetPayload<{ include: { gama: true } }>
export function aPlantillaGamaProducto(f: FilaPlantillaGamaProducto): PlantillaGamaProducto {
  return new PlantillaGamaProducto({ ...f, gama: aGamaCategoria(f.gama) })
}
