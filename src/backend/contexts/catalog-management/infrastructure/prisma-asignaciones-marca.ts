import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { DatosNuevaAsignacionMarca, RepositorioAsignacionesMarca } from '../application/ports/repositorio-asignaciones-marca.js'
import type { AsignacionMarca } from '../domain/asignacion-marca.js'

import { idCatalogo } from '../domain/catalog-values.js'
import { aAsignacionMarca } from './mappers/asignacion-marca.js'
import { auditarCatalogo, paginaCatalogo, permitirCatalogo, referenciaActiva, sinVinculosEliminados, transaccionCatalogo, versionCatalogo } from './operaciones-catalogo.js'

export class PrismaAsignacionesMarca implements RepositorioAsignacionesMarca {
  constructor(private readonly db: PrismaClient) {}
  async buscarPorId(id: bigint, incluirEliminados: boolean): Promise<AsignacionMarca | null> {
    const fila = await this.db.productoMarca.findFirst({ where: { id: idCatalogo(id), ...sinVinculosEliminados(incluirEliminados) } })
    return fila ? aAsignacionMarca(fila) : null
  }
  async buscarPorPar(productoId: bigint, marcaId: bigint, incluirEliminados: boolean): Promise<AsignacionMarca | null> {
    const fila = await this.db.productoMarca.findFirst({ where: { productoId: idCatalogo(productoId), marcaId: idCatalogo(marcaId), ...sinVinculosEliminados(incluirEliminados) } })
    return fila ? aAsignacionMarca(fila) : null
  }
  async listar(pagina: number, incluirEliminados: boolean, productoId: bigint): Promise<readonly AsignacionMarca[]> {
    const filas = await this.db.productoMarca.findMany({ where: { productoId: idCatalogo(productoId), ...sinVinculosEliminados(incluirEliminados) },
      orderBy: [{ orden: 'asc' }, { id: 'asc' }], skip: paginaCatalogo(pagina), take: 100 })
    return filas.map(aAsignacionMarca)
  }
  async crear(datos: DatosNuevaAsignacionMarca, actorId: string): Promise<AsignacionMarca> {
    return transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'asignaciones-marca')
      await referenciaActiva(tx, 'producto', datos.productoId)
      await referenciaActiva(tx, 'marca', datos.marcaId)
      const existente = await tx.productoMarca.findFirst({ where: { productoId: datos.productoId, marcaId: datos.marcaId }, select: { id: true } })
      if (existente) throw new Error('Asignación ya registrada')
      const ahora = new Date()
      const fila = await tx.productoMarca.create({ data: { productoId: datos.productoId, marcaId: datos.marcaId, orden: datos.orden?.value ?? null, estado: 'activo', creadoEn: ahora, actualizadoEn: ahora } })
      const resultado = aAsignacionMarca(fila)
      await auditarCatalogo(tx, actorId, 'asignaciones-marca', fila.id, null, resultado.estado)
      return resultado
    })
  }
  async guardar(registro: AsignacionMarca, versionAnterior: Date, actorId: string): Promise<void> {
    await transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'asignaciones-marca')
      const anterior = await tx.productoMarca.findUnique({ where: { id: registro.id }, select: { estado: true } })
      if (!anterior || anterior.estado === 'eliminado') throw new Error('Asignación no disponible')
      const cambio = await tx.productoMarca.updateMany({ where: { id: registro.id, actualizadoEn: versionCatalogo(versionAnterior), estado: { not: 'eliminado' } },
        data: { orden: registro.orden?.value ?? null, estado: registro.estado, actualizadoEn: registro.actualizadoEn } })
      if (cambio.count !== 1) throw new Error('Asignación modificada por otra operación')
      await auditarCatalogo(tx, actorId, 'asignaciones-marca', registro.id, anterior.estado, registro.estado)
    })
  }
}
