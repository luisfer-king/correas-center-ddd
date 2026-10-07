import { Orden } from '../../../shared/domain/value-objects.js'
import { TipoSeccion as EntidadTipoSeccion } from '../domain/tipo-seccion.js'
import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioTiposSeccion, ConsultaTiposSeccion, NuevaTipoSeccion, EscrituraTipoSeccion } from '../application/ports/repositorio-tipo-seccion.js'
import { mapearTipoSeccion } from './mappers/tipo-seccion.js'
import type { TipoSeccion } from '../domain/tipo-seccion.js'
import { idCMS } from '../domain/cms-values.js'
import { transaccionCms, gestionarCms, paginaCms, cambioCms, mismoCms, auditarCms, filtroEstadoCms } from './operaciones-cms.js'
import { validarTipoSeccion } from './reglas-cms.js'

function datosTipoSeccion(e: TipoSeccion) {
  return {
    nombre: e.nombre,
    slug: e.slug.value,
    descripcion: e.descripcion,
    camposMetadata: [...e.clavesMetadata],
    icono: e.icono,
    orden: e.orden.value,
    estado: e.estado,
    eliminadoEn: e.eliminadoEn,
    creadoEn: e.creadoEn,
    actualizadoEn: e.actualizadoEn,
  }
}

export class PrismaTiposSeccion implements RepositorioTiposSeccion {
  constructor(private readonly db: PrismaClient) {}

  async listar(consulta: ConsultaTiposSeccion): Promise<readonly TipoSeccion[]> {
    const where = { ...filtroEstadoCms(consulta) }
    const filas = await this.db.tipoSeccion.findMany({ where, ...paginaCms(consulta), orderBy: [{ orden: 'asc' }, { id: 'asc' }] })
    return filas.map(mapearTipoSeccion)
  }

  async obtener(id: bigint): Promise<TipoSeccion | null> {
    const fila = await this.db.tipoSeccion.findUnique({ where: { id: idCMS(id) } })
    return fila === null ? null : mapearTipoSeccion(fila)
  }

  async obtenerPorSlug(slug: string): Promise<TipoSeccion | null> {
    const fila = await this.db.tipoSeccion.findUnique({ where: { slug } })
    return fila === null ? null : mapearTipoSeccion(fila)
  }

  async crear(datos: NuevaTipoSeccion, contexto: EscrituraTipoSeccion): Promise<TipoSeccion> {
    return transaccionCms(this.db, async tx => {
      await gestionarCms(tx, contexto, 'tipos-seccion')
      let orden = datos.orden
      if (orden === null) {
        const maximo = await tx.tipoSeccion.aggregate({ where: { estado: { not: 'eliminado' }, eliminadoEn: null }, _max: { orden: true } })
        const siguiente = maximo._max.orden === null ? 0 : maximo._max.orden + 1
        if (siguiente > 2147483647) throw new Error('Orden automático inválido; asigna un orden manual')
        orden = Orden.create(siguiente)
      }
      const e = new EntidadTipoSeccion({ ...datos, orden, id: 1n, estado: 'activo', fechas: { creadoEn: contexto.cuando, actualizadoEn: contexto.cuando, eliminadoEn: null } })
      const fila = await tx.tipoSeccion.create({ data: datosTipoSeccion(e) })
      const resultado = mapearTipoSeccion(fila)
      await auditarCms(tx, contexto, 'tipos-seccion', 'tipo_seccion', fila.id, null, resultado)
      return resultado
    })
  }

  async guardar(entidad: TipoSeccion, actualizadoEnAnterior: Date, contexto: EscrituraTipoSeccion): Promise<void> {
    await transaccionCms(this.db, async tx => {
      await gestionarCms(tx, contexto, 'tipos-seccion')
      cambioCms(actualizadoEnAnterior, entidad.actualizadoEn, contexto)
      const anterior = await tx.tipoSeccion.findUnique({ where: { id: entidad.id } })
      if (!anterior || anterior.eliminadoEn !== null) throw new Error('Registro CMS no disponible')
      if (!mismoCms(anterior.actualizadoEn, actualizadoEnAnterior)) throw new Error('Registro CMS modificado por otra operación')
      const datos = datosTipoSeccion(entidad)
      if (!mismoCms(anterior.creadoEn, datos.creadoEn)) throw new Error('Campo inmutable: creadoEn')
      if (!mismoCms(anterior.slug, datos.slug)) throw new Error('Campo inmutable: slug')
      await validarTipoSeccion(tx, entidad)
      const cambio = await tx.tipoSeccion.updateMany({ where: { id: entidad.id, actualizadoEn: actualizadoEnAnterior, eliminadoEn: null }, data: datos })
      if (cambio.count !== 1) throw new Error('Registro CMS modificado por otra operación')
      await auditarCms(tx, contexto, 'tipos-seccion', 'tipo_seccion', entidad.id, anterior, entidad)
    })
  }
}
