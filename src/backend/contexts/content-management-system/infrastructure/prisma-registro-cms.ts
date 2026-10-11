import { Orden } from '../../../shared/domain/value-objects.js'
import { RegistroCMS as EntidadRegistroCMS } from '../domain/registro-cms.js'
import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioRegistrosCMS, ConsultaRegistrosCMS, NuevaRegistroCMS, EscrituraRegistroCMS } from '../application/ports/repositorio-registro-cms.js'
import { mapearRegistroCMS } from './mappers/registro-cms.js'
import type { RegistroCMS } from '../domain/registro-cms.js'
import { idCMS } from '../domain/cms-values.js'
import { transaccionCms, gestionarCms, paginaCms, cambioCms, mismoCms, auditarCms, filtroEstadoCms } from './operaciones-cms.js'
import { validarRegistroCMS } from './reglas-cms.js'

function datosRegistroCMS(e: RegistroCMS) {
  return {
    identificador: e.identificador,
    nombre: e.nombre,
    descripcion: e.descripcion,
    orden: e.orden.value,
    estado: e.estado,
    eliminadoEn: e.eliminadoEn,
    creadoEn: e.creadoEn,
    actualizadoEn: e.actualizadoEn,
  }
}

export class PrismaRegistrosCMS implements RepositorioRegistrosCMS {
  constructor(private readonly db: PrismaClient) {}

  async listar(consulta: ConsultaRegistrosCMS): Promise<readonly RegistroCMS[]> {
    const where = { ...filtroEstadoCms(consulta) }
    const filas = await this.db.registroCMS.findMany({ where, ...paginaCms(consulta), orderBy: [{ orden: 'asc' }, { id: 'asc' }] })
    return filas.map(mapearRegistroCMS)
  }

  async obtener(id: bigint): Promise<RegistroCMS | null> {
    const fila = await this.db.registroCMS.findUnique({ where: { id: idCMS(id) } })
    return fila === null ? null : mapearRegistroCMS(fila)
  }

  async obtenerPorIdentificador(identificador: string): Promise<RegistroCMS | null> {
    const fila = await this.db.registroCMS.findUnique({ where: { identificador } })
    return fila === null ? null : mapearRegistroCMS(fila)
  }

  async crear(datos: NuevaRegistroCMS, contexto: EscrituraRegistroCMS): Promise<RegistroCMS> {
    return transaccionCms(this.db, async tx => {
      await gestionarCms(tx, contexto, 'registros-cms')
      const maximo=await tx.registroCMS.aggregate({where:{eliminadoEn:null,estado:{not:'eliminado'}},_max:{orden:true}})
      const ultimo=Math.max(0,maximo._max.orden??0)
      if(!Number.isSafeInteger(ultimo)||ultimo>=2147483647)throw new Error('Orden automático de registro inválido')
      const e = new EntidadRegistroCMS({ ...datos, orden:Orden.create(ultimo+1), id: 1n, estado: 'activo', fechas: { creadoEn: contexto.cuando, actualizadoEn: contexto.cuando, eliminadoEn: null } })
      const fila = await tx.registroCMS.create({ data: datosRegistroCMS(e) })
      const resultado = mapearRegistroCMS(fila)
      await auditarCms(tx, contexto, 'registros-cms', 'registros', fila.id, null, resultado)
      return resultado
    })
  }

  async guardar(entidad: RegistroCMS, actualizadoEnAnterior: Date, contexto: EscrituraRegistroCMS): Promise<void> {
    await transaccionCms(this.db, async tx => {
      await gestionarCms(tx, contexto, 'registros-cms')
      cambioCms(actualizadoEnAnterior, entidad.actualizadoEn, contexto)
      const anterior = await tx.registroCMS.findUnique({ where: { id: entidad.id } })
      if (!anterior || anterior.eliminadoEn !== null) throw new Error('Registro CMS no disponible')
      if (!mismoCms(anterior.actualizadoEn, actualizadoEnAnterior)) throw new Error('Registro CMS modificado por otra operación')
      const datos = datosRegistroCMS(entidad)
      if (!mismoCms(anterior.creadoEn, datos.creadoEn)) throw new Error('Campo inmutable: creadoEn')
      if (!mismoCms(anterior.identificador, datos.identificador)) throw new Error('Campo inmutable: identificador')
      await validarRegistroCMS(tx, entidad)
      const cambio = await tx.registroCMS.updateMany({ where: { id: entidad.id, actualizadoEn: actualizadoEnAnterior, eliminadoEn: null }, data: datos })
      if (cambio.count !== 1) throw new Error('Registro CMS modificado por otra operación')
      await auditarCms(tx, contexto, 'registros-cms', 'registros', entidad.id, anterior, entidad)
    })
  }
}
