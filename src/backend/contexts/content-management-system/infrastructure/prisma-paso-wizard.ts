import { PasoWizard as EntidadPasoWizard } from '../domain/paso-wizard.js'
import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioPasosWizard, ConsultaPasosWizard, NuevaPasoWizard, EscrituraPasoWizard } from '../application/ports/repositorio-paso-wizard.js'
import { mapearPasoWizard } from './mappers/paso-wizard.js'
import type { PasoWizard } from '../domain/paso-wizard.js'
import { idCMS } from '../domain/cms-values.js'
import { transaccionCms, gestionarCms, paginaCms, cambioCms, mismoCms, auditarCms, filtroEstadoCms } from './operaciones-cms.js'
import { validarPasoWizard } from './reglas-cms.js'

function datosPasoWizard(e: PasoWizard) {
  return {
    empresaId: e.empresaId,
    identificador: e.identificador,
    titulo: e.titulo,
    descripcion: e.descripcion,
    fuenteDatos: e.fuenteDatos,
    campoFiltro: e.campoFiltro,
    orden: e.orden.value,
    estado: e.estado,
    eliminadoEn: e.eliminadoEn,
    creadoEn: e.creadoEn,
    actualizadoEn: e.actualizadoEn,
  }
}

export class PrismaPasosWizard implements RepositorioPasosWizard {
  constructor(private readonly db: PrismaClient) {}

  async listar(consulta: ConsultaPasosWizard): Promise<readonly PasoWizard[]> {
    if (consulta.empresaId !== undefined) idCMS(consulta.empresaId)
    const where = { ...filtroEstadoCms(consulta), empresaId: consulta.empresaId }
    const filas = await this.db.pasoWizard.findMany({ where, ...paginaCms(consulta), orderBy: [{ orden: 'asc' }, { id: 'asc' }] })
    return filas.map(mapearPasoWizard)
  }

  async obtener(id: bigint): Promise<PasoWizard | null> {
    const fila = await this.db.pasoWizard.findUnique({ where: { id: idCMS(id) } })
    return fila === null ? null : mapearPasoWizard(fila)
  }

  async crear(datos: NuevaPasoWizard, contexto: EscrituraPasoWizard): Promise<PasoWizard> {
    return transaccionCms(this.db, async tx => {
      await gestionarCms(tx, contexto, 'pasos-wizard')
      const e = new EntidadPasoWizard({ ...datos, id: 1n, estado: 'activo', fechas: { creadoEn: contexto.cuando, actualizadoEn: contexto.cuando, eliminadoEn: null } })
      await validarPasoWizard(tx, e)
      const fila = await tx.pasoWizard.create({ data: datosPasoWizard(e) })
      const resultado = mapearPasoWizard(fila)
      await auditarCms(tx, contexto, 'pasos-wizard', 'pasos_wizard', fila.id, null, resultado)
      return resultado
    })
  }

  async guardar(entidad: PasoWizard, actualizadoEnAnterior: Date, contexto: EscrituraPasoWizard): Promise<void> {
    await transaccionCms(this.db, async tx => {
      await gestionarCms(tx, contexto, 'pasos-wizard')
      cambioCms(actualizadoEnAnterior, entidad.actualizadoEn, contexto)
      const anterior = await tx.pasoWizard.findUnique({ where: { id: entidad.id } })
      if (!anterior || anterior.eliminadoEn !== null) throw new Error('Registro CMS no disponible')
      if (!mismoCms(anterior.actualizadoEn, actualizadoEnAnterior)) throw new Error('Registro CMS modificado por otra operación')
      const datos = datosPasoWizard(entidad)
      if (!mismoCms(anterior.creadoEn, datos.creadoEn)) throw new Error('Campo inmutable: creadoEn')
      if (!mismoCms(anterior.empresaId, datos.empresaId)) throw new Error('Campo inmutable: empresaId')
      if (!mismoCms(anterior.identificador, datos.identificador)) throw new Error('Campo inmutable: identificador')
      await validarPasoWizard(tx, entidad)
      const cambio = await tx.pasoWizard.updateMany({ where: { id: entidad.id, actualizadoEn: actualizadoEnAnterior, eliminadoEn: null }, data: datos })
      if (cambio.count !== 1) throw new Error('Registro CMS modificado por otra operación')
      await auditarCms(tx, contexto, 'pasos-wizard', 'pasos_wizard', entidad.id, anterior, entidad)
    })
  }
}
