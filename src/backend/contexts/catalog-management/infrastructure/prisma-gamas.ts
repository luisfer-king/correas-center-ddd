import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioGamas } from '../application/ports/repositorio-gamas.js'
import { idGama } from '../domain/gama-values.js'
import { transaccionCatalogo, paginaCatalogo } from './operaciones-catalogo.js'
import { cargarGama, visibilidadGama } from './operaciones-gamas.js'
import { aGamaCategoria } from './mappers/gama-categoria.js'
export class PrismaGamas implements RepositorioGamas {
  constructor(private readonly db: PrismaClient) {}
  buscarPorId(id: bigint,incluirEliminados=false) {
    return transaccionCatalogo(this.db,async tx=>visibilidadGama(await cargarGama(tx,id),incluirEliminados))
  }
  buscarPorCategoria(categoriaId: bigint,incluirEliminados=false) {
    return transaccionCatalogo(this.db,async tx=>{
      const f=await tx.gamaCategoria.findUnique({where:{categoriaId:idGama(categoriaId)},select:{id:true}})
      return f ? visibilidadGama(await cargarGama(tx,f.id),incluirEliminados) : null
    })
  }
  async listarPorProducto(productoId: bigint,pagina=1,incluirEliminados=false) {
    const filas=await this.db.gamaCategoria.findMany({where:{productoId:idGama(productoId),...(incluirEliminados?{}:{estado:{not:'eliminado' as const}})},orderBy:{id:'asc'},skip:paginaCatalogo(pagina),take:100})
    return filas.map(aGamaCategoria)
  }
}
