import { MenuItem as EntidadMenuItem } from '../domain/menu-item.js'
import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioItemsMenu, ConsultaItemsMenu, NuevaMenuItem, EscrituraMenuItem } from '../application/ports/repositorio-menu-item.js'
import { mapearMenuItem } from './mappers/menu-item.js'
import type { MenuItem } from '../domain/menu-item.js'
import { idCMS } from '../domain/cms-values.js'
import { transaccionCms, gestionarCms, paginaCms, cambioCms, mismoCms, auditarCms, filtroEstadoCms } from './operaciones-cms.js'
import { validarMenuItem } from './reglas-cms.js'

function datosMenuItem(e: MenuItem) {
  return {
    menuId: e.menuId,
    ruta: e.ruta.value,
    orden: e.orden.value,
    estado: e.estado,
    eliminadoEn: e.eliminadoEn,
    creadoEn: e.creadoEn,
    actualizadoEn: e.actualizadoEn,
  }
}

export class PrismaItemsMenu implements RepositorioItemsMenu {
  constructor(private readonly db: PrismaClient) {}

  async listar(consulta: ConsultaItemsMenu): Promise<readonly MenuItem[]> {
    if (consulta.menuId !== undefined) idCMS(consulta.menuId)
    const where = { ...filtroEstadoCms(consulta), menuId: consulta.menuId }
    const filas = await this.db.menuItem.findMany({ where, ...paginaCms(consulta), orderBy: [{ orden: 'asc' }, { id: 'asc' }] })
    return filas.map(mapearMenuItem)
  }

  async obtener(id: bigint): Promise<MenuItem | null> {
    const fila = await this.db.menuItem.findUnique({ where: { id: idCMS(id) } })
    return fila === null ? null : mapearMenuItem(fila)
  }

  async crear(datos: NuevaMenuItem, contexto: EscrituraMenuItem): Promise<MenuItem> {
    return transaccionCms(this.db, async tx => {
      await gestionarCms(tx, contexto, 'items-menu')
      const e = new EntidadMenuItem({ ...datos, id: 1n, estado: 'activo', fechas: { creadoEn: contexto.cuando, actualizadoEn: contexto.cuando, eliminadoEn: null } })
      await validarMenuItem(tx, e)
      await avanzarMenu(tx, e.menuId, contexto.cuando)
      const fila = await tx.menuItem.create({ data: datosMenuItem(e) })
      const resultado = mapearMenuItem(fila)
      await auditarCms(tx, contexto, 'items-menu', 'menu_item', fila.id, null, resultado)
      return resultado
    })
  }

  async guardar(entidad: MenuItem, actualizadoEnAnterior: Date, contexto: EscrituraMenuItem): Promise<void> {
    await transaccionCms(this.db, async tx => {
      await gestionarCms(tx, contexto, 'items-menu')
      cambioCms(actualizadoEnAnterior, entidad.actualizadoEn, contexto)
      const anterior = await tx.menuItem.findUnique({ where: { id: entidad.id } })
      if (!anterior || anterior.eliminadoEn !== null) throw new Error('Registro CMS no disponible')
      if (!mismoCms(anterior.actualizadoEn, actualizadoEnAnterior)) throw new Error('Registro CMS modificado por otra operación')
      const datos = datosMenuItem(entidad)
      if (!mismoCms(anterior.creadoEn, datos.creadoEn)) throw new Error('Campo inmutable: creadoEn')
      if (!mismoCms(anterior.menuId, datos.menuId)) throw new Error('Campo inmutable: menuId')
      await validarMenuItem(tx, entidad)
      await avanzarMenu(tx, entidad.menuId, contexto.cuando)
      const cambio = await tx.menuItem.updateMany({ where: { id: entidad.id, actualizadoEn: actualizadoEnAnterior, eliminadoEn: null }, data: datos })
      if (cambio.count !== 1) throw new Error('Registro CMS modificado por otra operación')
      await auditarCms(tx, contexto, 'items-menu', 'menu_item', entidad.id, anterior, entidad)
    })
  }
}

import type { TxCms } from './operaciones-cms.js'
async function avanzarMenu(tx: TxCms, menuId: bigint, cuando: Date): Promise<void> {
  const menu = await tx.menu.findUnique({ where: { id: menuId } })
  if (!menu || menu.eliminadoEn !== null || cuando <= menu.actualizadoEn) throw new Error('La versión del menú debe avanzar')
  const resultado = await tx.menu.updateMany({ where: { id: menuId, actualizadoEn: menu.actualizadoEn, eliminadoEn: null }, data: { actualizadoEn: cuando } })
  if (resultado.count !== 1) throw new Error('Menú modificado por otra operación')
}
