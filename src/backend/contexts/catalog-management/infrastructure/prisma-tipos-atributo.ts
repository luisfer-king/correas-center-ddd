import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { DatosNuevoTipoAtributo, RepositorioTiposAtributo } from '../application/ports/repositorio-tipos-atributo.js'
import type { TipoAtributo } from '../domain/tipo-atributo.js'
import { idCatalogo } from '../domain/catalog-values.js'
import { aTipoAtributo } from './mappers/tipo-atributo.js'
import { auditarCatalogo, paginaCatalogo, permitirCatalogo, referenciaActiva, sinEliminados, transaccionCatalogo, versionCatalogo } from './operaciones-catalogo.js'

export class PrismaTiposAtributo implements RepositorioTiposAtributo {
  constructor(private readonly db: PrismaClient) {}
  async buscarPorId(id: bigint, incluirEliminados: boolean): Promise<TipoAtributo | null> {
    const fila = await this.db.tipoAtributo.findFirst({ where: { id: idCatalogo(id), ...sinEliminados(incluirEliminados) } })
    return fila ? aTipoAtributo(fila) : null
  }
  async buscarPorSlug(slug: string, incluirEliminados: boolean): Promise<TipoAtributo | null> {
    const fila = await this.db.tipoAtributo.findFirst({ where: { slug, ...sinEliminados(incluirEliminados) } })
    return fila ? aTipoAtributo(fila) : null
  }
  async listar(pagina: number, incluirEliminados: boolean): Promise<readonly TipoAtributo[]> {
    const filas = await this.db.tipoAtributo.findMany({ where: { ...sinEliminados(incluirEliminados),  }, orderBy: [{ orden: 'asc' }, { id: 'asc' }], skip: paginaCatalogo(pagina), take: 100 })
    return filas.map(aTipoAtributo)
  }
  async crear(datos: DatosNuevoTipoAtributo, actorId: string): Promise<TipoAtributo> {
    return transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'tipos-atributo')
      
      const ahora = new Date()
      const fila = await tx.tipoAtributo.create({ data: { nombre: datos.nombre, slug: datos.slug.value,  descripcion: datos.descripcion, icono: datos.icono, orden: datos.orden.value, permiteDescripcion: datos.capacidades.descripcion, permiteValorNumerico: datos.capacidades.numero, permiteUnidadMedida: datos.capacidades.unidad, estado: 'activo', creadoEn: ahora, actualizadoEn: ahora } })
      const resultado = aTipoAtributo(fila)
      await auditarCatalogo(tx, actorId, 'tipos-atributo', fila.id, null, resultado.estado)
      return resultado
    })
  }
  async guardar(registro: TipoAtributo, versionAnterior: Date, actorId: string): Promise<void> {
    await transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'tipos-atributo')
      
      const anterior = await tx.tipoAtributo.findUnique({ where: { id: registro.id }, select: { estado: true, eliminadoEn: true } })
      if (!anterior || anterior.eliminadoEn !== null) throw new Error('Registro no disponible')
      const cambio = await tx.tipoAtributo.updateMany({ where: { id: registro.id, actualizadoEn: versionCatalogo(versionAnterior), eliminadoEn: null },
        data: { nombre: registro.nombre, descripcion: registro.descripcion, icono: registro.icono, orden: registro.orden.value, permiteDescripcion: registro.capacidades.descripcion, permiteValorNumerico: registro.capacidades.numero, permiteUnidadMedida: registro.capacidades.unidad, estado: registro.estado, eliminadoEn: registro.eliminadoEn, actualizadoEn: registro.actualizadoEn } })
      if (cambio.count !== 1) throw new Error('Registro modificado por otra operación')
      await auditarCatalogo(tx, actorId, 'tipos-atributo', registro.id, anterior.estado, registro.estado)
    })
  }
}
