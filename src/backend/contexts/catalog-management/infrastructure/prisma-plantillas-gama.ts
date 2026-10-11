import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioPlantillasGama } from '../application/ports/repositorio-plantillas-gama.js'
import { idGama } from '../domain/gama-values.js'
import { transaccionCatalogo, permitirCatalogo, referenciaActiva, versionCatalogo } from './operaciones-catalogo.js'
import { bloquearGama, nuevaVersionGama, auditarGama, jsonSeguro } from './operaciones-gamas.js'
import { aPlantillaGamaProducto } from './mappers/plantilla-gama-producto.js'
export class PrismaPlantillasGama implements RepositorioPlantillasGama {
  constructor(private readonly db: PrismaClient) {}
  async buscarPorProducto(productoId: bigint) {
    const f=await this.db.plantillaGamaProducto.findUnique({where:{productoId:idGama(productoId)},include:{gama:true}})
    return f ? aPlantillaGamaProducto(f) : null
  }
  seleccionar(productoId: bigint,gamaId: bigint,versionAnterior: Date|null,actorId: string) {
    return transaccionCatalogo(this.db,async tx=>{
      await permitirCatalogo(tx,actorId,'categorias')
      idGama(productoId);await tx.$queryRaw`SELECT id FROM public.productos WHERE id=${productoId} FOR UPDATE`
      await referenciaActiva(tx,'producto',productoId);await bloquearGama(tx,gamaId)
      const gama=await tx.gamaCategoria.findFirst({where:{id:gamaId,productoId,estado:'activo',eliminadoEn:null},select:{categoriaId:true}})
      if (!gama) throw new Error('Plantilla incompatible o no disponible')
      await referenciaActiva(tx,'categoria',gama.categoriaId)
      const anterior=await tx.plantillaGamaProducto.findUnique({where:{productoId}})
      if (versionAnterior===null ? anterior!==null : !anterior || anterior.actualizadoEn.getTime()!==versionCatalogo(versionAnterior).getTime()) throw new Error('Plantilla modificada por otra operación')
      if (!await tx.columnaGama.count({where:{gamaId,estado:'activo'}})) throw new Error('La plantilla necesita al menos una columna activa')
      const cuando=anterior?nuevaVersionGama(anterior.actualizadoEn):new Date()
      const f=await tx.plantillaGamaProducto.upsert({where:{productoId},create:{productoId,gamaId,creadoEn:cuando,actualizadoEn:cuando},update:{gamaId,actualizadoEn:cuando},include:{gama:true}})
      await auditarGama(tx,actorId,'plantillas_gama_producto',productoId,jsonSeguro(anterior),jsonSeguro({productoId,gamaId}))
      return aPlantillaGamaProducto(f)
    })
  }
  quitar(productoId: bigint,versionAnterior: Date,actorId: string): Promise<void> {
    return transaccionCatalogo(this.db,async tx=>{
      await permitirCatalogo(tx,actorId,'categorias');idGama(productoId)
      await tx.$queryRaw`SELECT id FROM public.productos WHERE id=${productoId} FOR UPDATE`
      const anterior=await tx.plantillaGamaProducto.findUnique({where:{productoId}})
      if (!anterior || anterior.actualizadoEn.getTime()!==versionCatalogo(versionAnterior).getTime()) throw new Error('Plantilla modificada por otra operación')
      await tx.plantillaGamaProducto.delete({where:{productoId}})
      await auditarGama(tx,actorId,'plantillas_gama_producto',productoId,jsonSeguro(anterior),null,true)
    })
  }
}
