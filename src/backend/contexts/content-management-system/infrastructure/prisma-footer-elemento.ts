import { Orden } from '../../../shared/domain/value-objects.js'
import { FooterElemento as EntidadFooterElemento } from '../domain/footer-elemento.js'
import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioElementosFooter, ConsultaElementosFooter, NuevaFooterElemento, EscrituraFooterElemento } from '../application/ports/repositorio-footer-elemento.js'
import { mapearFooterElemento } from './mappers/footer-elemento.js'
import type { FooterElemento } from '../domain/footer-elemento.js'
import { idCMS } from '../domain/cms-values.js'
import { transaccionCms, gestionarCms, paginaCms, cambioCms, mismoCms, auditarCms, filtroEstadoCms } from './operaciones-cms.js'
import { validarFooterElemento } from './reglas-cms.js'

function datosFooterElemento(e: FooterElemento) {
  return {
    empresaId: e.empresaId,
    tipo: e.tipo,
    tipoRegistro: e.destino?.tipo ?? null,
    registroId: e.destino?.id ?? null,
    titulo: e.titulo,
    url: e.enlace?.value ?? null,
    icono: e.icono,
    orden: e.orden.value,
    mostrar: e.mostrar,
    estado: e.estado,
    eliminadoEn: e.eliminadoEn,
    creadoEn: e.creadoEn,
    actualizadoEn: e.actualizadoEn,
  }
}

export class PrismaElementosFooter implements RepositorioElementosFooter {
  constructor(private readonly db: PrismaClient) {}

  async listar(consulta: ConsultaElementosFooter): Promise<readonly FooterElemento[]> {
    if (consulta.empresaId !== undefined) idCMS(consulta.empresaId)
    const where = { ...filtroEstadoCms(consulta), empresaId: consulta.empresaId }
    const filas = await this.db.footerElemento.findMany({ where, ...paginaCms(consulta), orderBy: [{ orden: 'asc' }, { id: 'asc' }] })
    return filas.map(mapearFooterElemento)
  }

  async obtener(id: bigint): Promise<FooterElemento | null> {
    const fila = await this.db.footerElemento.findUnique({ where: { id: idCMS(id) } })
    return fila === null ? null : mapearFooterElemento(fila)
  }

  async crear(datos: NuevaFooterElemento, contexto: EscrituraFooterElemento): Promise<FooterElemento> {
    return transaccionCms(this.db, async tx => {
      await gestionarCms(tx, contexto, 'elementos-footer')
      const maximo=await tx.footerElemento.aggregate({where:{empresaId:datos.empresaId,tipo:datos.tipo,eliminadoEn:null,estado:{not:'eliminado'}},_max:{orden:true}})
      const ultimo=Math.max(0,maximo._max.orden??0)
      if(!Number.isSafeInteger(ultimo)||ultimo>=2147483647)throw new Error('Orden automático de footer inválido')
      const e = new EntidadFooterElemento({ ...datos, orden:Orden.create(ultimo+1), id: 1n, estado: 'activo', fechas: { creadoEn: contexto.cuando, actualizadoEn: contexto.cuando, eliminadoEn: null } })
      await validarFooterElemento(tx, e)
      const fila = await tx.footerElemento.create({ data: datosFooterElemento(e) })
      const resultado = mapearFooterElemento(fila)
      await auditarCms(tx, contexto, 'elementos-footer', 'footers', fila.id, null, resultado)
      return resultado
    })
  }

  async guardar(entidad: FooterElemento, actualizadoEnAnterior: Date, contexto: EscrituraFooterElemento): Promise<void> {
    await transaccionCms(this.db, async tx => {
      await gestionarCms(tx, contexto, 'elementos-footer')
      cambioCms(actualizadoEnAnterior, entidad.actualizadoEn, contexto)
      const anterior = await tx.footerElemento.findUnique({ where: { id: entidad.id } })
      if (!anterior || anterior.eliminadoEn !== null) throw new Error('Registro CMS no disponible')
      if (!mismoCms(anterior.actualizadoEn, actualizadoEnAnterior)) throw new Error('Registro CMS modificado por otra operación')
      const datos = datosFooterElemento(entidad)
      if (!mismoCms(anterior.creadoEn, datos.creadoEn)) throw new Error('Campo inmutable: creadoEn')
      if (!mismoCms(anterior.empresaId, datos.empresaId)) throw new Error('Campo inmutable: empresaId')
      if (!mismoCms(anterior.tipo, datos.tipo)) throw new Error('Campo inmutable: tipo')
      await validarFooterElemento(tx, entidad)
      const cambio = await tx.footerElemento.updateMany({ where: { id: entidad.id, actualizadoEn: actualizadoEnAnterior, eliminadoEn: null }, data: datos })
      if (cambio.count !== 1) throw new Error('Registro CMS modificado por otra operación')
      await auditarCms(tx, contexto, 'elementos-footer', 'footers', entidad.id, anterior, entidad)
    })
  }
}
