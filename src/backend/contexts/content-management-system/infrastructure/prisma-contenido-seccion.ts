import { ContenidoSeccion as EntidadContenidoSeccion } from '../domain/contenido-seccion.js'
import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioContenidosSeccion, ConsultaContenidosSeccion, NuevaContenidoSeccion, EscrituraContenidoSeccion } from '../application/ports/repositorio-contenido-seccion.js'
import { mapearContenidoSeccion } from './mappers/contenido-seccion.js'
import type { ContenidoSeccion } from '../domain/contenido-seccion.js'
import { idCMS } from '../domain/cms-values.js'
import { transaccionCms, gestionarCms, paginaCms, cambioCms, mismoCms, auditarCms, filtroEstadoCms, jsonObjetoCms } from './operaciones-cms.js'
import { validarContenidoSeccion } from './reglas-cms.js'

function datosContenidoSeccion(e: ContenidoSeccion) {
  return {
    empresaId: e.empresaId,
    tipoSeccionId: e.tipoSeccionId,
    titulo: e.campos.titulo,
    subtitulo: e.campos.subtitulo,
    descripcion: e.campos.descripcion,
    icono: e.campos.icono,
    imagen: e.campos.imagen,
    metadata: jsonObjetoCms(e.metadata),
    orden: e.orden.value,
    mostrar: e.mostrar,
    estado: e.estado,
    eliminadoEn: e.eliminadoEn,
    creadoEn: e.creadoEn,
    actualizadoEn: e.actualizadoEn,
  }
}

export class PrismaContenidosSeccion implements RepositorioContenidosSeccion {
  constructor(private readonly db: PrismaClient) {}

  async listar(consulta: ConsultaContenidosSeccion): Promise<readonly ContenidoSeccion[]> {
    if (consulta.empresaId !== undefined) idCMS(consulta.empresaId)
    if (consulta.tipoSeccionId !== undefined) idCMS(consulta.tipoSeccionId)
    const where = { ...filtroEstadoCms(consulta), empresaId: consulta.empresaId, tipoSeccionId: consulta.tipoSeccionId }
    const filas = await this.db.contenidoSeccion.findMany({ where, ...paginaCms(consulta), orderBy: [{ orden: 'asc' }, { id: 'asc' }] })
    return filas.map(mapearContenidoSeccion)
  }

  async obtener(id: bigint): Promise<ContenidoSeccion | null> {
    const fila = await this.db.contenidoSeccion.findUnique({ where: { id: idCMS(id) } })
    return fila === null ? null : mapearContenidoSeccion(fila)
  }

  async crear(datos: NuevaContenidoSeccion, contexto: EscrituraContenidoSeccion): Promise<ContenidoSeccion> {
    return transaccionCms(this.db, async tx => {
      await gestionarCms(tx, contexto, 'contenidos-seccion')
      const e = new EntidadContenidoSeccion({ ...datos, id: 1n, estado: 'activo', fechas: { creadoEn: contexto.cuando, actualizadoEn: contexto.cuando, eliminadoEn: null } })
      await validarContenidoSeccion(tx, e)
      const fila = await tx.contenidoSeccion.create({ data: datosContenidoSeccion(e) })
      const resultado = mapearContenidoSeccion(fila)
      await auditarCms(tx, contexto, 'contenidos-seccion', 'contenido_seccion', fila.id, null, resultado)
      return resultado
    })
  }

  async guardar(entidad: ContenidoSeccion, actualizadoEnAnterior: Date, contexto: EscrituraContenidoSeccion): Promise<void> {
    await transaccionCms(this.db, async tx => {
      await gestionarCms(tx, contexto, 'contenidos-seccion')
      cambioCms(actualizadoEnAnterior, entidad.actualizadoEn, contexto)
      const anterior = await tx.contenidoSeccion.findUnique({ where: { id: entidad.id } })
      if (!anterior || anterior.eliminadoEn !== null) throw new Error('Registro CMS no disponible')
      if (!mismoCms(anterior.actualizadoEn, actualizadoEnAnterior)) throw new Error('Registro CMS modificado por otra operación')
      const datos = datosContenidoSeccion(entidad)
      if (!mismoCms(anterior.creadoEn, datos.creadoEn)) throw new Error('Campo inmutable: creadoEn')
      if (!mismoCms(anterior.empresaId, datos.empresaId)) throw new Error('Campo inmutable: empresaId')
      if (!mismoCms(anterior.tipoSeccionId, datos.tipoSeccionId)) throw new Error('Campo inmutable: tipoSeccionId')
      await validarContenidoSeccion(tx, entidad)
      const cambio = await tx.contenidoSeccion.updateMany({ where: { id: entidad.id, actualizadoEn: actualizadoEnAnterior, eliminadoEn: null }, data: datos })
      if (cambio.count !== 1) throw new Error('Registro CMS modificado por otra operación')
      await auditarCms(tx, contexto, 'contenidos-seccion', 'contenido_seccion', entidad.id, anterior, entidad)
    })
  }
}
