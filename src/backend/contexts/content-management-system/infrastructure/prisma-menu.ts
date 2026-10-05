import { Menu as EntidadMenu } from '../domain/menu.js'
import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioMenus, ConsultaMenus, NuevaMenu, EscrituraMenu } from '../application/ports/repositorio-menu.js'
import { mapearMenu } from './mappers/menu.js'
import type { Menu } from '../domain/menu.js'
import { idCMS } from '../domain/cms-values.js'
import { transaccionCms, gestionarCms, paginaCms, cambioCms, mismoCms, auditarCms, filtroEstadoCms } from './operaciones-cms.js'
import { validarMenu } from './reglas-cms.js'

function datosMenu(e: Menu) {
  return {
    empresaId: e.empresaId,
    grupo: e.grupo,
    tipoRegistro: e.destino.tipo,
    registroId: e.destino.id,
    ruta: e.ruta.value,
    icono: e.icono,
    mostrar: e.mostrar,
    orden: e.orden.value,
    estado: e.estado,
    eliminadoEn: e.eliminadoEn,
    creadoEn: e.creadoEn,
    actualizadoEn: e.actualizadoEn,
    cargarSubmenu: e.cargarSubmenu,
  }
}

export class PrismaMenus implements RepositorioMenus {
  constructor(private readonly db: PrismaClient) {}

  async listar(consulta: ConsultaMenus): Promise<readonly Menu[]> {
    if (consulta.empresaId !== undefined) idCMS(consulta.empresaId)
    const where = { ...filtroEstadoCms(consulta), empresaId: consulta.empresaId }
    const filas = await this.db.menu.findMany({ where, ...paginaCms(consulta), orderBy: [{ orden: 'asc' }, { id: 'asc' }], include: { relMenuItem: true } })
    return filas.map(mapearMenu)
  }

  async obtener(id: bigint): Promise<Menu | null> {
    const fila = await this.db.menu.findUnique({ where: { id: idCMS(id) }, include: { relMenuItem: true } })
    return fila === null ? null : mapearMenu(fila)
  }

  async crear(datos: NuevaMenu, contexto: EscrituraMenu): Promise<Menu> {
    return transaccionCms(this.db, async tx => {
      await gestionarCms(tx, contexto, 'menus')
      const e = new EntidadMenu({ ...datos, id: 1n, estado: 'activo', fechas: { creadoEn: contexto.cuando, actualizadoEn: contexto.cuando, eliminadoEn: null }, items: [] })
      await validarMenu(tx, e)
      const fila = await tx.menu.create({ data: datosMenu(e), include: { relMenuItem: true } })
      const resultado = mapearMenu(fila)
      await auditarCms(tx, contexto, 'menus', 'menus', fila.id, null, resultado)
      return resultado
    })
  }

  async guardar(entidad: Menu, actualizadoEnAnterior: Date, contexto: EscrituraMenu): Promise<void> {
    await transaccionCms(this.db, async tx => {
      await gestionarCms(tx, contexto, 'menus')
      cambioCms(actualizadoEnAnterior, entidad.actualizadoEn, contexto)
      const anterior = await tx.menu.findUnique({ where: { id: entidad.id }, include: { relMenuItem: true } })
      if (!anterior || anterior.eliminadoEn !== null) throw new Error('Registro CMS no disponible')
      if (!mismoCms(anterior.actualizadoEn, actualizadoEnAnterior)) throw new Error('Registro CMS modificado por otra operación')
      const datos = datosMenu(entidad)
      if (!mismoCms(anterior.creadoEn, datos.creadoEn)) throw new Error('Campo inmutable: creadoEn')
      if (!mismoCms(anterior.empresaId, datos.empresaId)) throw new Error('Campo inmutable: empresaId')
      if (!mismoCms(anterior.tipoRegistro, datos.tipoRegistro)) throw new Error('Campo inmutable: tipoRegistro')
      if (!mismoCms(anterior.registroId, datos.registroId)) throw new Error('Campo inmutable: registroId')
      await validarMenu(tx, entidad)
      // Los cambios de ítems usan su repositorio; no descartarlos silenciosamente al guardar el menú.
      const items = entidad.itemsOrdenados
      if (items.length !== anterior.relMenuItem.length || anterior.relMenuItem.some(fila => {
        const item = items.find(x => x.id === fila.id)
        return !item || item.menuId !== fila.menuId || item.ruta.value !== fila.ruta ||
          item.orden.value !== fila.orden || item.estado !== fila.estado ||
          !mismoCms(item.creadoEn, fila.creadoEn) || !mismoCms(item.actualizadoEn, fila.actualizadoEn) ||
          !mismoCms(item.eliminadoEn, fila.eliminadoEn)
      })) throw new Error('Gestiona los ítems mediante su repositorio')
      const cambio = await tx.menu.updateMany({ where: { id: entidad.id, actualizadoEn: actualizadoEnAnterior, eliminadoEn: null }, data: datos })
      if (cambio.count !== 1) throw new Error('Registro CMS modificado por otra operación')
      await auditarCms(tx, contexto, 'menus', 'menus', entidad.id, anterior, entidad)
    })
  }
}
