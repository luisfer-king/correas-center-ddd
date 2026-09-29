import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { DatosNuevaMarca, RepositorioMarcas } from '../application/ports/repositorio-marcas.js'
import type { Marca } from '../domain/marca.js'
import { idCatalogo } from '../domain/catalog-values.js'
import { aMarca } from './mappers/marca.js'
import { auditarCatalogo, paginaCatalogo, permitirCatalogo, referenciaActiva, sinEliminados, transaccionCatalogo, versionCatalogo } from './operaciones-catalogo.js'

export class PrismaMarcas implements RepositorioMarcas {
  constructor(private readonly db: PrismaClient) {}
  async buscarPorId(id: bigint, incluirEliminados: boolean): Promise<Marca | null> {
    const fila = await this.db.marca.findFirst({ where: { id: idCatalogo(id), ...sinEliminados(incluirEliminados) } })
    return fila ? aMarca(fila) : null
  }
  async buscarPorSlug(slug: string, incluirEliminados: boolean): Promise<Marca | null> {
    const fila = await this.db.marca.findFirst({ where: { slug, ...sinEliminados(incluirEliminados) } })
    return fila ? aMarca(fila) : null
  }
  async listar(pagina: number, incluirEliminados: boolean): Promise<readonly Marca[]> {
    const filas = await this.db.marca.findMany({ where: { ...sinEliminados(incluirEliminados),  }, orderBy: [{ orden: 'asc' }, { id: 'asc' }], skip: paginaCatalogo(pagina), take: 100 })
    return filas.map(aMarca)
  }
  async crear(datos: DatosNuevaMarca, actorId: string): Promise<Marca> {
    return transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'marcas')
      
      const ahora = new Date()
      const fila = await tx.marca.create({ data: { nombre: datos.nombre, slug: datos.slug.value,  logo: datos.logo, orden: datos.orden.value, estado: 'activo', creadoEn: ahora, actualizadoEn: ahora } })
      const resultado = aMarca(fila)
      await auditarCatalogo(tx, actorId, 'marcas', fila.id, null, resultado.estado)
      return resultado
    })
  }
  async guardar(registro: Marca, versionAnterior: Date, actorId: string): Promise<void> {
    await transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'marcas')
      
      const anterior = await tx.marca.findUnique({ where: { id: registro.id }, select: { estado: true, eliminadoEn: true } })
      if (!anterior || anterior.eliminadoEn !== null) throw new Error('Registro no disponible')
      const cambio = await tx.marca.updateMany({ where: { id: registro.id, actualizadoEn: versionCatalogo(versionAnterior), eliminadoEn: null },
        data: { nombre: registro.nombre, logo: registro.logo, orden: registro.orden.value, estado: registro.estado, eliminadoEn: registro.eliminadoEn, actualizadoEn: registro.actualizadoEn } })
      if (cambio.count !== 1) throw new Error('Registro modificado por otra operación')
      await auditarCatalogo(tx, actorId, 'marcas', registro.id, anterior.estado, registro.estado)
    })
  }
}
