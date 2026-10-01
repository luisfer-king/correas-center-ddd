import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { DatosNuevaIndustria, RepositorioIndustrias } from '../application/ports/repositorio-industrias.js'
import type { Industria } from '../domain/industria.js'
import { idCatalogo } from '../domain/catalog-values.js'
import { aIndustria } from './mappers/industria.js'
import { auditarCatalogo, paginaCatalogo, permitirCatalogo, referenciaActiva, sinEliminados, transaccionCatalogo, versionCatalogo } from './operaciones-catalogo.js'

export class PrismaIndustrias implements RepositorioIndustrias {
  constructor(private readonly db: PrismaClient) {}
  async buscarPorId(id: bigint, incluirEliminados: boolean): Promise<Industria | null> {
    const fila = await this.db.industria.findFirst({ where: { id: idCatalogo(id), ...sinEliminados(incluirEliminados) } })
    return fila ? aIndustria(fila) : null
  }
  async buscarPorSlug(slug: string, incluirEliminados: boolean): Promise<Industria | null> {
    const fila = await this.db.industria.findFirst({ where: { slug, ...sinEliminados(incluirEliminados) } })
    return fila ? aIndustria(fila) : null
  }
  async listar(pagina: number, incluirEliminados: boolean, empresaId?: bigint): Promise<readonly Industria[]> {
    const filas = await this.db.industria.findMany({ where: { ...sinEliminados(incluirEliminados), ...( empresaId === undefined ? {} : { empresaId: idCatalogo(empresaId) }), }, orderBy: [{ orden: 'asc' }, { id: 'asc' }], skip: paginaCatalogo(pagina), take: 100 })
    return filas.map(aIndustria)
  }
  async crear(datos: DatosNuevaIndustria, actorId: string): Promise<Industria> {
    return transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'industrias')
      await referenciaActiva(tx, 'empresa', datos.empresaId)
      const ahora = new Date()
      const fila = await tx.industria.create({ data: { nombre: datos.nombre, slug: datos.slug.value, empresaId: datos.empresaId, imagen: datos.imagen, orden: datos.orden.value, estado: 'activo', creadoEn: ahora, actualizadoEn: ahora } })
      const resultado = aIndustria(fila)
      await auditarCatalogo(tx, actorId, 'industrias', fila.id, null, resultado.estado)
      return resultado
    })
  }
  async guardar(registro: Industria, versionAnterior: Date, actorId: string): Promise<void> {
    await transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'industrias')
      await referenciaActiva(tx, 'empresa', registro.empresaId)
      const anterior = await tx.industria.findUnique({ where: { id: registro.id }, select: { estado: true, eliminadoEn: true } })
      if (!anterior || anterior.eliminadoEn !== null) throw new Error('Registro no disponible')
      const cambio = await tx.industria.updateMany({ where: { id: registro.id, actualizadoEn: versionCatalogo(versionAnterior), eliminadoEn: null },
        data: { nombre: registro.nombre, imagen: registro.imagen, orden: registro.orden.value, estado: registro.estado, eliminadoEn: registro.eliminadoEn, actualizadoEn: registro.actualizadoEn } })
      if (cambio.count !== 1) throw new Error('Registro modificado por otra operación')
      await auditarCatalogo(tx, actorId, 'industrias', registro.id, anterior.estado, registro.estado)
    })
  }
}
