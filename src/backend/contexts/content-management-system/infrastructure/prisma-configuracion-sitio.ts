import { ConfiguracionSitio as EntidadConfiguracionSitio } from '../domain/configuracion-sitio.js'
import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioConfiguracionesSitio, ConsultaConfiguracionesSitio, NuevaConfiguracionSitio, EscrituraConfiguracionSitio } from '../application/ports/repositorio-configuracion-sitio.js'
import { mapearConfiguracionSitio } from './mappers/configuracion-sitio.js'
import type { ConfiguracionSitio } from '../domain/configuracion-sitio.js'
import { idConfiguracionCms } from './operaciones-cms.js'
import { transaccionCms, gestionarCms, paginaCms, cambioCms, mismoCms, auditarCms } from './operaciones-cms.js'
import { validarConfiguracionSitio } from './reglas-cms.js'

function datosConfiguracionSitio(e: ConfiguracionSitio) {
  return {
    empresaId: e.empresaId,
    clave: e.clave,
    valor: e.valor,
    tipo: e.tipo,
    descripcion: e.descripcion,
    grupo: e.grupo,
    activo: e.activo,
    creadoEn: e.creadoEn,
    actualizadoEn: e.actualizadoEn,
  }
}

export class PrismaConfiguracionesSitio implements RepositorioConfiguracionesSitio {
  constructor(private readonly db: PrismaClient) {}

  async listar(consulta: ConsultaConfiguracionesSitio): Promise<readonly ConfiguracionSitio[]> {
    if (consulta.empresaId !== undefined && consulta.empresaId !== null) idEmpresa(consulta.empresaId)
    const where = { empresaId: consulta.empresaId, clave: consulta.clave, grupo: consulta.grupo, activo: consulta.activo }
    const filas = await this.db.configuracionSitio.findMany({ where, ...paginaCms(consulta), orderBy: [{ id: 'asc' }] })
    return filas.map(mapearConfiguracionSitio)
  }

  async obtener(id: number): Promise<ConfiguracionSitio | null> {
    const fila = await this.db.configuracionSitio.findUnique({ where: { id: idConfiguracionCms(id) } })
    return fila === null ? null : mapearConfiguracionSitio(fila)
  }

  async crear(datos: NuevaConfiguracionSitio, contexto: EscrituraConfiguracionSitio): Promise<ConfiguracionSitio> {
    return transaccionCms(this.db, async tx => {
      await gestionarCms(tx, contexto, 'configuracion-sitio')
      const e = new EntidadConfiguracionSitio({ ...datos, id: 1, creadoEn: contexto.cuando, actualizadoEn: contexto.cuando })
      await validarConfiguracionSitio(tx, e)
      const fila = await tx.configuracionSitio.create({ data: datosConfiguracionSitio(e) })
      const resultado = mapearConfiguracionSitio(fila)
      await auditarCms(tx, contexto, 'configuracion-sitio', 'configuracion_sitio', fila.id, null, resultado)
      return resultado
    })
  }

  async guardar(entidad: ConfiguracionSitio, actualizadoEnAnterior: Date | null, contexto: EscrituraConfiguracionSitio): Promise<void> {
    await transaccionCms(this.db, async tx => {
      await gestionarCms(tx, contexto, 'configuracion-sitio')
      cambioCms(actualizadoEnAnterior, entidad.actualizadoEn, contexto)
      const anterior = await tx.configuracionSitio.findUnique({ where: { id: entidad.id } })
      if (!anterior) throw new Error('Registro CMS no disponible')
      if (!mismoCms(anterior.actualizadoEn, actualizadoEnAnterior)) throw new Error('Registro CMS modificado por otra operación')
      const datos = datosConfiguracionSitio(entidad)
      if (!mismoCms(anterior.creadoEn, datos.creadoEn)) throw new Error('Campo inmutable: creadoEn')
      if (!mismoCms(anterior.empresaId, datos.empresaId)) throw new Error('Campo inmutable: empresaId')
      if (!mismoCms(anterior.clave, datos.clave)) throw new Error('Campo inmutable: clave')
      await validarConfiguracionSitio(tx, entidad)
      const cambio = await tx.configuracionSitio.updateMany({ where: { id: entidad.id, actualizadoEn: actualizadoEnAnterior }, data: datos })
      if (cambio.count !== 1) throw new Error('Registro CMS modificado por otra operación')
      await auditarCms(tx, contexto, 'configuracion-sitio', 'configuracion_sitio', entidad.id, anterior, entidad)
    })
  }
}

import { idCMS as idEmpresa } from '../domain/cms-values.js'
