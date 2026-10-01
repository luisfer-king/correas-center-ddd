import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { DatosNuevoProducto, RepositorioProductos } from '../application/ports/repositorio-productos.js'
import type { Producto } from '../domain/producto.js'
import { idCatalogo } from '../domain/catalog-values.js'
import { aProducto } from './mappers/producto.js'
import { auditarCatalogo, paginaCatalogo, permitirCatalogo, referenciaActiva, sinEliminados, transaccionCatalogo, versionCatalogo } from './operaciones-catalogo.js'

export class PrismaProductos implements RepositorioProductos {
  constructor(private readonly db: PrismaClient) {}
  async buscarPorId(id: bigint, incluirEliminados: boolean): Promise<Producto | null> {
    const fila = await this.db.producto.findFirst({ where: { id: idCatalogo(id), ...sinEliminados(incluirEliminados) } })
    return fila ? aProducto(fila) : null
  }
  async buscarPorSlug(slug: string, incluirEliminados: boolean): Promise<Producto | null> {
    const fila = await this.db.producto.findFirst({ where: { slug, ...sinEliminados(incluirEliminados) } })
    return fila ? aProducto(fila) : null
  }
  async listar(pagina: number, incluirEliminados: boolean, empresaId?: bigint): Promise<readonly Producto[]> {
    const filas = await this.db.producto.findMany({ where: { ...sinEliminados(incluirEliminados), ...( empresaId === undefined ? {} : { empresaId: idCatalogo(empresaId) }), }, orderBy: [{ orden: 'asc' }, { id: 'asc' }], skip: paginaCatalogo(pagina), take: 100 })
    return filas.map(aProducto)
  }
  async crear(datos: DatosNuevoProducto, actorId: string): Promise<Producto> {
    return transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'productos')
      await referenciaActiva(tx, 'empresa', datos.empresaId)
      const ahora = new Date()
      const fila = await tx.producto.create({ data: { nombre: datos.nombre, slug: datos.slug.value, empresaId: datos.empresaId, imagen: datos.imagen, orden: datos.orden.value, estado: 'activo', creadoEn: ahora, actualizadoEn: ahora } })
      const resultado = aProducto(fila)
      await auditarCatalogo(tx, actorId, 'productos', fila.id, null, resultado.estado)
      return resultado
    })
  }
  async guardar(registro: Producto, versionAnterior: Date, actorId: string): Promise<void> {
    await transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'productos')
      await referenciaActiva(tx, 'empresa', registro.empresaId)
      const anterior = await tx.producto.findUnique({ where: { id: registro.id }, select: { estado: true, eliminadoEn: true } })
      if (!anterior || anterior.eliminadoEn !== null) throw new Error('Registro no disponible')
      const cambio = await tx.producto.updateMany({ where: { id: registro.id, actualizadoEn: versionCatalogo(versionAnterior), eliminadoEn: null },
        data: { nombre: registro.nombre, imagen: registro.imagen, orden: registro.orden.value, estado: registro.estado, eliminadoEn: registro.eliminadoEn, actualizadoEn: registro.actualizadoEn } })
      if (cambio.count !== 1) throw new Error('Registro modificado por otra operación')
      await auditarCatalogo(tx, actorId, 'productos', registro.id, anterior.estado, registro.estado)
    })
  }
}
