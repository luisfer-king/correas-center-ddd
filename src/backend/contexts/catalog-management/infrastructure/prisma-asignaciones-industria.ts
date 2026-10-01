import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { DatosNuevaAsignacionIndustria, RepositorioAsignacionesIndustria } from '../application/ports/repositorio-asignaciones-industria.js'
import type { AsignacionIndustria } from '../domain/asignacion-industria.js'
import type { DestinoIndustria } from '../domain/asignacion-industria.js'
import { idCatalogo } from '../domain/catalog-values.js'
import { aAsignacionIndustria } from './mappers/asignacion-industria.js'
import { auditarCatalogo, paginaCatalogo, permitirCatalogo, referenciaActiva, sinVinculosEliminados, transaccionCatalogo, versionCatalogo } from './operaciones-catalogo.js'

export class PrismaAsignacionesIndustria implements RepositorioAsignacionesIndustria {
  constructor(private readonly db: PrismaClient) {}
  async buscarPorId(id: bigint, incluirEliminados: boolean): Promise<AsignacionIndustria | null> {
    const fila = await this.db.industriaAsignacion.findFirst({ where: { id: idCatalogo(id), ...sinVinculosEliminados(incluirEliminados) } })
    return fila ? aAsignacionIndustria(fila) : null
  }
  async buscarPorPar(industriaId: bigint, destino: DestinoIndustria, incluirEliminados: boolean): Promise<AsignacionIndustria | null> {
    const fila = await this.db.industriaAsignacion.findFirst({ where: { industriaId: idCatalogo(industriaId), tipoRegistro: destino.tipo, registroId: idCatalogo(destino.id), ...sinVinculosEliminados(incluirEliminados) } })
    return fila ? aAsignacionIndustria(fila) : null
  }
  async listar(pagina: number, incluirEliminados: boolean, industriaId: bigint): Promise<readonly AsignacionIndustria[]> {
    const filas = await this.db.industriaAsignacion.findMany({ where: { industriaId: idCatalogo(industriaId), ...sinVinculosEliminados(incluirEliminados) },
      orderBy: [{ orden: 'asc' }, { id: 'asc' }], skip: paginaCatalogo(pagina), take: 100 })
    return filas.map(aAsignacionIndustria)
  }
  async crear(datos: DatosNuevaAsignacionIndustria, actorId: string): Promise<AsignacionIndustria> {
    return transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'asignaciones-industria')
      await referenciaActiva(tx, 'industria', datos.industriaId)
      await referenciaActiva(tx, datos.destino.tipo, datos.destino.id)
      const industria = await tx.industria.findUnique({ where: { id: datos.industriaId }, select: { empresaId: true } })
      const empresaDestino = datos.destino.tipo === 'servicio'
        ? (await tx.servicio.findUnique({ where: { id: datos.destino.id }, select: { empresaId: true } }))?.empresaId
        : (await tx.categoria.findUnique({ where: { id: datos.destino.id }, select: { producto: { select: { empresaId: true } } } }))?.producto.empresaId
      if (!industria || industria.empresaId !== empresaDestino) throw new Error('La asignación debe pertenecer a la misma empresa')
      const existente = await tx.industriaAsignacion.findFirst({ where: { industriaId: datos.industriaId, tipoRegistro: datos.destino.tipo, registroId: datos.destino.id }, select: { id: true } })
      if (existente) throw new Error('Asignación ya registrada')
      const ahora = new Date()
      const fila = await tx.industriaAsignacion.create({ data: { industriaId: datos.industriaId, tipoRegistro: datos.destino.tipo, registroId: datos.destino.id, orden: datos.orden.value, estado: 'activo', creadoEn: ahora, actualizadoEn: ahora } })
      const resultado = aAsignacionIndustria(fila)
      await auditarCatalogo(tx, actorId, 'asignaciones-industria', fila.id, null, resultado.estado)
      return resultado
    })
  }
  async guardar(registro: AsignacionIndustria, versionAnterior: Date, actorId: string): Promise<void> {
    await transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'asignaciones-industria')
      const anterior = await tx.industriaAsignacion.findUnique({ where: { id: registro.id }, select: { estado: true } })
      if (!anterior || anterior.estado === 'eliminado') throw new Error('Asignación no disponible')
      const cambio = await tx.industriaAsignacion.updateMany({ where: { id: registro.id, actualizadoEn: versionCatalogo(versionAnterior), estado: { not: 'eliminado' } },
        data: { orden: registro.orden.value, estado: registro.estado, actualizadoEn: registro.actualizadoEn } })
      if (cambio.count !== 1) throw new Error('Asignación modificada por otra operación')
      await auditarCatalogo(tx, actorId, 'asignaciones-industria', registro.id, anterior.estado, registro.estado)
    })
  }
}
