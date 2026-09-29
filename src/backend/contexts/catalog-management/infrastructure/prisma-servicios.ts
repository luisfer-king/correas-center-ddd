import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { DatosNuevoServicio, RepositorioServicios } from '../application/ports/repositorio-servicios.js'
import type { Servicio } from '../domain/servicio.js'
import { idCatalogo } from '../domain/catalog-values.js'
import { aServicio } from './mappers/servicio.js'
import { auditarCatalogo, paginaCatalogo, permitirCatalogo, referenciaActiva, sinEliminados, transaccionCatalogo, versionCatalogo } from './operaciones-catalogo.js'

export class PrismaServicios implements RepositorioServicios {
  constructor(private readonly db: PrismaClient) {}
  async buscarPorId(id: bigint, incluirEliminados: boolean): Promise<Servicio | null> {
    const fila = await this.db.servicio.findFirst({ where: { id: idCatalogo(id), ...sinEliminados(incluirEliminados) } })
    return fila ? aServicio(fila) : null
  }
  async listar(pagina: number, incluirEliminados: boolean, empresaId?: bigint): Promise<readonly Servicio[]> {
    const filas = await this.db.servicio.findMany({ where: { ...sinEliminados(incluirEliminados), ...( empresaId === undefined ? {} : { empresaId: idCatalogo(empresaId) }), }, orderBy: [{ orden: 'asc' }, { id: 'asc' }], skip: paginaCatalogo(pagina), take: 100 })
    return filas.map(aServicio)
  }
  async crear(datos: DatosNuevoServicio, actorId: string): Promise<Servicio> {
    return transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'servicios')
      await referenciaActiva(tx, 'empresa', datos.empresaId)
      const ahora = new Date()
      const fila = await tx.servicio.create({ data: { nombre: datos.nombre, empresaId: datos.empresaId, descripcion: datos.descripcion, imagen: datos.imagen, orden: datos.orden.value, estado: 'activo', creadoEn: ahora, actualizadoEn: ahora } })
      const resultado = aServicio(fila)
      await auditarCatalogo(tx, actorId, 'servicios', fila.id, null, resultado.estado)
      return resultado
    })
  }
  async guardar(registro: Servicio, versionAnterior: Date, actorId: string): Promise<void> {
    await transaccionCatalogo(this.db, async tx => {
      await permitirCatalogo(tx, actorId, 'servicios')
      await referenciaActiva(tx, 'empresa', registro.empresaId)
      const anterior = await tx.servicio.findUnique({ where: { id: registro.id }, select: { estado: true, eliminadoEn: true } })
      if (!anterior || anterior.eliminadoEn !== null) throw new Error('Registro no disponible')
      const cambio = await tx.servicio.updateMany({ where: { id: registro.id, actualizadoEn: versionCatalogo(versionAnterior), eliminadoEn: null },
        data: { nombre: registro.nombre, descripcion: registro.descripcion, imagen: registro.imagen, orden: registro.orden.value, estado: registro.estado, eliminadoEn: registro.eliminadoEn, actualizadoEn: registro.actualizadoEn } })
      if (cambio.count !== 1) throw new Error('Registro modificado por otra operación')
      await auditarCatalogo(tx, actorId, 'servicios', registro.id, anterior.estado, registro.estado)
    })
  }
}
