import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { DatosNuevaAsignacionAtributo, RepositorioAsignacionesAtributo } from '../application/ports/repositorio-asignaciones-atributo.js'
import type { AsignacionAtributo } from '../domain/asignacion-atributo.js'

import { idCatalogo } from '../domain/catalog-values.js'
import { aAsignacionAtributo } from './mappers/asignacion-atributo.js'
import { auditarCatalogo, paginaCatalogo, permitirCatalogo, referenciaActiva, sinVinculosEliminados, transaccionCatalogo, versionCatalogo } from './operaciones-catalogo.js'

export class PrismaAsignacionesAtributo implements RepositorioAsignacionesAtributo {
  constructor(private readonly db: PrismaClient) { }
  async buscarPorId(id: bigint, incluirEliminados: boolean): Promise<AsignacionAtributo | null> {
    const fila = await this.db.categoriaAtributo.findFirst({ where: { id: idCatalogo(id), ...sinVinculosEliminados(incluirEliminados) } })
    return fila ? aAsignacionAtributo(fila) : null
  }
  async buscarPorPar(categoriaId: bigint, atributoId: bigint, incluirEliminados: boolean): Promise<AsignacionAtributo | null> {
    const fila = await this.db.categoriaAtributo.findFirst({ where: { categoriaId: idCatalogo(categoriaId), atributoId: idCatalogo(atributoId), ...sinVinculosEliminados(incluirEliminados) } })
    return fila ? aAsignacionAtributo(fila) : null
  }
  async listar(pagina: number, incluirEliminados: boolean, categoriaId: bigint): Promise<readonly AsignacionAtributo[]> {
    const filas = await this.db.categoriaAtributo.findMany({
      where: { categoriaId: idCatalogo(categoriaId), ...sinVinculosEliminados(incluirEliminados) },
      orderBy: [{ orden: 'asc' }, { id: 'asc' }], skip: paginaCatalogo(pagina), take: 100
    })
    return filas.map(aAsignacionAtributo)
  }
  async crear(datos: DatosNuevaAsignacionAtributo, actorId: string): Promise<AsignacionAtributo> {
    return transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'asignaciones-atributo')
      await referenciaActiva(tx, 'categoria', datos.categoriaId)
      await referenciaActiva(tx, 'atributoTecnico', datos.atributoId)
      const tipo = await tx.atributoTecnico.findUnique({ where: { id: datos.atributoId }, select: { tipoAtributo: { select: { permiteValorNumerico: true } } } })
      if (datos.valorPersonalizado !== null && !tipo?.tipoAtributo.permiteValorNumerico) throw new Error('Valor personalizado incompatible')
      const existente = await tx.categoriaAtributo.findFirst({ where: { categoriaId: datos.categoriaId, atributoId: datos.atributoId }, select: { id: true } })
      if (existente) throw new Error('Asignación ya registrada')
      const ahora = new Date()
      const fila = await tx.categoriaAtributo.create({ data: { categoriaId: datos.categoriaId, atributoId: datos.atributoId, orden: datos.orden.value, valorPersonalizado: datos.valorPersonalizado, estado: 'activo', creadoEn: ahora, actualizadoEn: ahora } })
      const resultado = aAsignacionAtributo(fila)
      await auditarCatalogo(tx, actorId, 'asignaciones-atributo', fila.id, null, resultado.estado)
      return resultado
    })
  }
  async guardar(registro: AsignacionAtributo, versionAnterior: Date, actorId: string): Promise<void> {
    await transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'asignaciones-atributo')
      const anterior = await tx.categoriaAtributo.findUnique({ where: { id: registro.id }, select: { estado: true } })
      if (!anterior || anterior.estado === 'eliminado') throw new Error('Asignación no disponible')
      if (registro.valorPersonalizado !== null) {
        const atributo = await tx.atributoTecnico.findUnique({
          where: { id: registro.atributoId },
          select: { tipoAtributo: { select: { permiteValorNumerico: true } } }
        })
        if (!atributo?.tipoAtributo.permiteValorNumerico) throw new Error('Valor personalizado incompatible')
      }
      const cambio = await tx.categoriaAtributo.updateMany({
        where: { id: registro.id, actualizadoEn: versionCatalogo(versionAnterior), estado: { not: 'eliminado' } },
        data: { orden: registro.orden.value, valorPersonalizado: registro.valorPersonalizado, estado: registro.estado, actualizadoEn: registro.actualizadoEn }
      })
      if (cambio.count !== 1) throw new Error('Asignación modificada por otra operación')
      await auditarCatalogo(tx, actorId, 'asignaciones-atributo', registro.id, anterior.estado, registro.estado)
    })
  }
}
