import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { DatosNuevaGama, GamaCompleta } from '../application/ports/repositorio-gamas.js'
import type { UnidadTrabajoGamas, SesionGama, ResultadoEscrituraGama } from '../application/ports/unidad-trabajo-gamas.js'
import { GamaCategoria } from '../domain/gama-categoria.js'
import { idGama } from '../domain/gama-values.js'
import { transaccionCatalogo, permitirCatalogo, referenciaActiva, versionCatalogo, type TxCatalogo } from './operaciones-catalogo.js'
import { cargarGama, bloquearGama, nuevaVersionGama, validarReferenciasGama, jsonGama, auditarGama } from './operaciones-gamas.js'
import { aGamaCategoria, datosGamaCategoria } from './mappers/gama-categoria.js'
import { PrismaGruposColumnasGama } from './prisma-grupos-columnas-gama.js'
import { PrismaGruposFilasGama } from './prisma-grupos-filas-gama.js'
import { PrismaColumnasGama } from './prisma-columnas-gama.js'
import { PrismaFilasGama } from './prisma-filas-gama.js'
import { PrismaValoresGama } from './prisma-valores-gama.js'
import type { Json } from '../../identity-access-management/domain/iam-values.js'
export class PrismaUnidadTrabajoGamas implements UnidadTrabajoGamas {
  constructor(private readonly db: PrismaClient) {}
  crear<T>(d: DatosNuevaGama,actorId: string,trabajo: (s: SesionGama)=>Promise<T>): Promise<ResultadoEscrituraGama<T>> {
    return transaccionCatalogo(this.db,async tx=>{
      await permitirCatalogo(tx,actorId,'categorias')
      const categoriaId=idGama(d.categoriaId)
      await tx.$queryRaw`SELECT id FROM public.categorias WHERE id=${categoriaId} FOR UPDATE`
      const categoria=await tx.categoria.findFirst({where:{id:categoriaId,estado:'activo',eliminadoEn:null},select:{productoId:true}})
      if (!categoria) throw new Error('Categoría no disponible')
      await referenciaActiva(tx,'producto',categoria.productoId)
      if (await tx.gamaCategoria.findUnique({where:{categoriaId},select:{id:true}})) throw new Error('La categoría ya tiene una gama')
      const cuando=new Date(), origenId=d.gamaOrigenId??null
      if (origenId!==null) {
        const origen=await tx.gamaCategoria.findFirst({where:{id:idGama(origenId),productoId:categoria.productoId,estado:'activo',eliminadoEn:null},select:{id:true}})
        if (!origen) throw new Error('Origen incompatible o no disponible')
      }
      const candidata=new GamaCategoria({id:1n,categoriaId,productoId:categoria.productoId,gamaOrigenId:null,titulo:d.titulo,descripcion:d.descripcion,imagen:d.imagen,estado:'activo',fechas:{creadoEn:cuando,actualizadoEn:cuando,eliminadoEn:null}})
      const f=await tx.gamaCategoria.create({data:{...datosGamaCategoria(candidata),categoriaId,productoId:categoria.productoId,gamaOrigenId:origenId,creadoEn:cuando,actualizadoEn:cuando}})
      return this.trabajar(tx,aGamaCategoria(f),cuando,actorId,null,trabajo)
    })
  }
  editar<T>(gamaId: bigint,versionAnterior: Date,actorId: string,trabajo: (s: SesionGama)=>Promise<T>): Promise<ResultadoEscrituraGama<T>> {
    return transaccionCatalogo(this.db,async tx=>{
      await permitirCatalogo(tx,actorId,'categorias'); await bloquearGama(tx,gamaId)
      const actual=await cargarGama(tx,gamaId)
      if (!actual || actual.gama.estado==='eliminado') throw new Error('Gama no disponible')
      if (actual.gama.actualizadoEn.getTime()!==versionCatalogo(versionAnterior).getTime()) throw new Error('Gama modificada por otra operación')
      return this.trabajar(tx,actual.gama,nuevaVersionGama(actual.gama.actualizadoEn),actorId,jsonGama(actual),trabajo)
    })
  }
  private async trabajar<T>(tx: TxCatalogo,gama: GamaCategoria,cuando: Date,actorId: string,anterior: Json,trabajo: (s: SesionGama)=>Promise<T>): Promise<ResultadoEscrituraGama<T>> {
    const resultado=await trabajo(Object.freeze({gama,cuando:new Date(cuando),gruposColumnas:new PrismaGruposColumnasGama(tx,gama.id,cuando),gruposFilas:new PrismaGruposFilasGama(tx,gama.id,cuando),columnas:new PrismaColumnasGama(tx,gama.id,cuando),filas:new PrismaFilasGama(tx,gama.id,cuando),valores:new PrismaValoresGama(tx,gama.id,cuando)}))
    if (gama.actualizadoEn>cuando) throw new Error('Fecha posterior a la transacción')
    if (gama.estado==='eliminado') {
      const where={gamaId:gama.id,estado:{not:'eliminado' as const}},data={estado:'eliminado' as const,eliminadoEn:cuando,actualizadoEn:cuando}
      await tx.columnaGama.updateMany({where,data});await tx.filaGama.updateMany({where,data})
      await tx.grupoColumnaGama.updateMany({where,data});await tx.grupoFilaGama.updateMany({where,data})
    }
    await tx.gamaCategoria.update({where:{id:gama.id},data:{...datosGamaCategoria(gama),actualizadoEn:cuando}})
    const final=await cargarGama(tx,gama.id) as GamaCompleta
    await validarReferenciasGama(tx,final)
    await auditarGama(tx,actorId,'gamas_categoria',gama.id,anterior,jsonGama(final),gama.estado==='eliminado')
    return {gamaId:gama.id,version:new Date(cuando),resultado}
  }
}
