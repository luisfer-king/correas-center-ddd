import { Orden } from '../../../shared/domain/value-objects.js'
import { ContenidoRegistro as EntidadContenidoRegistro } from '../domain/contenido-registro.js'
import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioContenidosRegistro, ConsultaContenidosRegistro, NuevaContenidoRegistro, EscrituraContenidoRegistro } from '../application/ports/repositorio-contenido-registro.js'
import { mapearContenidoRegistro } from './mappers/contenido-registro.js'
import type { ContenidoRegistro } from '../domain/contenido-registro.js'
import { idCMS } from '../domain/cms-values.js'
import { transaccionCms, gestionarCms, paginaCms, cambioCms, mismoCms, auditarCms, filtroEstadoCms } from './operaciones-cms.js'
import { validarContenidoRegistro } from './reglas-cms.js'

function datosContenidoRegistro(e: ContenidoRegistro) {
  return {
    empresaId: e.empresaId,
    registroId: e.registroId,
    titulo: e.campos.titulo,
    subtitulo: e.campos.subtitulo,
    descripcion: e.campos.descripcion,
    icono: e.campos.icono,
    orden: e.orden.value,
    estado: e.estado,
    eliminadoEn: e.eliminadoEn,
    creadoEn: e.creadoEn,
    actualizadoEn: e.actualizadoEn,
  }
}

export class PrismaContenidosRegistro implements RepositorioContenidosRegistro {
  constructor(private readonly db: PrismaClient) {}

  async listar(consulta: ConsultaContenidosRegistro): Promise<readonly ContenidoRegistro[]> {
    if (consulta.empresaId !== undefined) idCMS(consulta.empresaId)
    if (consulta.registroId !== undefined) idCMS(consulta.registroId)
    const where = { ...filtroEstadoCms(consulta), empresaId: consulta.empresaId, registroId: consulta.registroId }
    const filas = await this.db.contenidoRegistro.findMany({ where, ...paginaCms(consulta), orderBy: [{ orden: 'asc' }, { id: 'asc' }] })
    return filas.map(mapearContenidoRegistro)
  }

  async obtener(id: bigint): Promise<ContenidoRegistro | null> {
    const fila = await this.db.contenidoRegistro.findUnique({ where: { id: idCMS(id) } })
    return fila === null ? null : mapearContenidoRegistro(fila)
  }

  async crear(datos: NuevaContenidoRegistro, contexto: EscrituraContenidoRegistro): Promise<ContenidoRegistro> {
    return transaccionCms(this.db, async tx => {
      await gestionarCms(tx, contexto, 'contenidos-registro')
      const maximo=await tx.contenidoRegistro.aggregate({where:{registroId:datos.registroId,eliminadoEn:null,estado:{not:'eliminado'}},_max:{orden:true}})
      const ultimo=Math.max(0,maximo._max.orden??0)
      if(!Number.isSafeInteger(ultimo)||ultimo>=2147483647)throw new Error('Orden automático de registro inválido')
      const e = new EntidadContenidoRegistro({ ...datos, orden:Orden.create(ultimo+1), id: 1n, estado: 'activo', fechas: { creadoEn: contexto.cuando, actualizadoEn: contexto.cuando, eliminadoEn: null } })
      await validarContenidoRegistro(tx, e)
      const fila = await tx.contenidoRegistro.create({ data: datosContenidoRegistro(e) })
      const resultado = mapearContenidoRegistro(fila)
      await auditarCms(tx, contexto, 'contenidos-registro', 'registro_contenido', fila.id, null, resultado)
      return resultado
    })
  }

  async guardar(entidad: ContenidoRegistro, actualizadoEnAnterior: Date, contexto: EscrituraContenidoRegistro): Promise<void> {
    await transaccionCms(this.db, async tx => {
      await gestionarCms(tx, contexto, 'contenidos-registro')
      cambioCms(actualizadoEnAnterior, entidad.actualizadoEn, contexto)
      const anterior = await tx.contenidoRegistro.findUnique({ where: { id: entidad.id } })
      if (!anterior || anterior.eliminadoEn !== null) throw new Error('Registro CMS no disponible')
      if (!mismoCms(anterior.actualizadoEn, actualizadoEnAnterior)) throw new Error('Registro CMS modificado por otra operación')
      const datos = datosContenidoRegistro(entidad)
      if (!mismoCms(anterior.creadoEn, datos.creadoEn)) throw new Error('Campo inmutable: creadoEn')
      if (!mismoCms(anterior.empresaId, datos.empresaId)) throw new Error('Campo inmutable: empresaId')
      if (!mismoCms(anterior.registroId, datos.registroId)) throw new Error('Campo inmutable: registroId')
      await validarContenidoRegistro(tx, entidad)
      const cambio = await tx.contenidoRegistro.updateMany({ where: { id: entidad.id, actualizadoEn: actualizadoEnAnterior, eliminadoEn: null }, data: datos })
      if (cambio.count !== 1) throw new Error('Registro CMS modificado por otra operación')
      await auditarCms(tx, contexto, 'contenidos-registro', 'registro_contenido', entidad.id, anterior, entidad)
    })
  }
}
