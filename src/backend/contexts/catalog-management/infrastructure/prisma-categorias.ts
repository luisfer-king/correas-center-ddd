import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { DatosNuevaCategoria, RepositorioCategorias } from '../application/ports/repositorio-categorias.js'
import type { Categoria } from '../domain/categoria.js'
import { idCatalogo } from '../domain/catalog-values.js'
import { aCategoria } from './mappers/categoria.js'
import { auditarCatalogo, paginaCatalogo, permitirCatalogo, referenciaActiva, sinEliminados, transaccionCatalogo, versionCatalogo } from './operaciones-catalogo.js'

export class PrismaCategorias implements RepositorioCategorias {
  constructor(private readonly db: PrismaClient) {}
  async buscarPorId(id: bigint, incluirEliminados: boolean): Promise<Categoria | null> {
    const fila = await this.db.categoria.findFirst({ where: { id: idCatalogo(id), ...sinEliminados(incluirEliminados) } })
    return fila ? aCategoria(fila) : null
  }
  async buscarPorSlug(slug: string, incluirEliminados: boolean): Promise<Categoria | null> {
    const fila = await this.db.categoria.findFirst({ where: { slug, ...sinEliminados(incluirEliminados) } })
    return fila ? aCategoria(fila) : null
  }
  async listar(pagina: number, incluirEliminados: boolean, productoId?: bigint): Promise<readonly Categoria[]> {
    const filas = await this.db.categoria.findMany({ where: { ...sinEliminados(incluirEliminados), ...( productoId === undefined ? {} : { productoId: idCatalogo(productoId) }), }, orderBy: [{ orden: 'asc' }, { id: 'asc' }], skip: paginaCatalogo(pagina), take: 100 })
    return filas.map(aCategoria)
  }
  async crear(datos: DatosNuevaCategoria, actorId: string): Promise<Categoria> {
    return transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'categorias')
      await referenciaActiva(tx, 'producto', datos.productoId)
      const ahora = new Date()
      const fila = await tx.categoria.create({ data: { nombre: datos.nombre, slug: datos.slug.value, productoId: datos.productoId, imagen: datos.imagen, descripcion: datos.descripcion, descripcionCorta: datos.descripcionCorta, uso: datos.uso, orden: datos.orden.value, estado: 'activo', creadoEn: ahora, actualizadoEn: ahora } })
      const resultado = aCategoria(fila)
      await auditarCatalogo(tx, actorId, 'categorias', fila.id, null, resultado.estado)
      return resultado
    })
  }
  async guardar(registro: Categoria, versionAnterior: Date, actorId: string): Promise<void> {
    await transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'categorias')
      await referenciaActiva(tx, 'producto', registro.productoId)
      const anterior = await tx.categoria.findUnique({ where: { id: registro.id }, select: { estado: true, eliminadoEn: true } })
      if (!anterior || anterior.eliminadoEn !== null) throw new Error('Registro no disponible')
      const cambio = await tx.categoria.updateMany({ where: { id: registro.id, actualizadoEn: versionCatalogo(versionAnterior), eliminadoEn: null },
        data: { nombre: registro.nombre, imagen: registro.imagen, descripcion: registro.descripcion, descripcionCorta: registro.descripcionCorta, uso: registro.uso, orden: registro.orden.value, estado: registro.estado, eliminadoEn: registro.eliminadoEn, actualizadoEn: registro.actualizadoEn } })
      if (cambio.count !== 1) throw new Error('Registro modificado por otra operación')
      await auditarCatalogo(tx, actorId, 'categorias', registro.id, anterior.estado, registro.estado)
    })
  }
}
