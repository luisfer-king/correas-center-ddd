import type { PrismaClient } from '../../../generated/prisma/client.js'
import { Orden } from '../../../shared/domain/value-objects.js'
import type { ConsultaItemsMenu, EscrituraMenuItem, NuevaMenuItem, RepositorioItemsMenu } from '../application/ports/repositorio-menu-item.js'
import { idCMS } from '../domain/cms-values.js'
import { MenuItem } from '../domain/menu-item.js'
import { mapearMenuItem } from './mappers/menu-item.js'
import { auditarCms, cambioCms, filtroEstadoCms, gestionarCms, mismoCms, paginaCms, transaccionCms, type TxCms } from './operaciones-cms.js'
import { validarMenuItem } from './reglas-cms.js'
import { rutaCategoriaMenu } from './ruta-item-menu.js'
function datos(e: MenuItem) { return { menuId: e.menuId, nombre: e.nombre, categoriaId: e.categoriaId, ruta: e.ruta.value, orden: e.orden.value, estado: e.estado, eliminadoEn: e.eliminadoEn, creadoEn: e.creadoEn, actualizadoEn: e.actualizadoEn } }
async function avanzarMenu(tx: TxCms, menuId: bigint, cuando: Date) {
  const m = await tx.menu.findUnique({ where: { id: menuId } })
  if (!m || m.eliminadoEn !== null || cuando <= m.actualizadoEn) throw new Error('La versión del menú debe avanzar')
  if ((await tx.menu.updateMany({ where: { id: menuId, actualizadoEn: m.actualizadoEn, eliminadoEn: null }, data: { actualizadoEn: cuando } })).count !== 1) throw new Error('Menú modificado por otra operación')
}
async function hermanos(tx: TxCms, menuId: bigint) { return tx.menuItem.findMany({ where: { menuId, eliminadoEn: null }, orderBy: [{ orden: 'asc' }, { id: 'asc' }] }) }
type Fila = Awaited<ReturnType<typeof hermanos>>[number]
/** Desocupar las posiciones evita colisiones transitorias del índice único al intercambiar 1 y 2. */
async function recolocar(tx: TxCms, lista: Fila[], ctx: EscrituraMenuItem, target?: { entidad: MenuItem; anterior: Fila }) {
  const cambios = lista.map((f, i) => ({ fila: f, orden: i + 1 })).filter(x => x.fila.orden !== x.orden || x.fila.id === target?.entidad.id)
  for (const { fila, orden } of cambios) {
    if (ctx.cuando <= fila.actualizadoEn) throw new Error('La versión del ítem debe avanzar')
    if ((await tx.menuItem.updateMany({ where: { id: fila.id, actualizadoEn: fila.actualizadoEn, eliminadoEn: null }, data: { orden: -orden } })).count !== 1) throw new Error('Ítem modificado por otra operación')
  }
  for (const { fila, orden } of cambios) {
    let data
    if (fila.id === target?.entidad.id) { target.entidad.reordenar(Orden.create(orden), ctx.cuando); data = datos(target.entidad) }
    else data = { orden, actualizadoEn: ctx.cuando }
    if ((await tx.menuItem.updateMany({ where: { id: fila.id, actualizadoEn: fila.actualizadoEn, eliminadoEn: null }, data })).count !== 1) throw new Error('Ítem modificado por otra operación')
    await auditarCms(tx, ctx, 'items-menu', 'menu_item', fila.id, fila, { estado: fila.id === target?.entidad.id ? target.entidad.estado : fila.estado })
  }
}
export class PrismaItemsMenu implements RepositorioItemsMenu {
  constructor(private readonly db: PrismaClient) { }
  async listar(q: ConsultaItemsMenu): Promise<readonly MenuItem[]> { if (q.menuId !== undefined) idCMS(q.menuId); return (await this.db.menuItem.findMany({ where: { ...filtroEstadoCms(q), menuId: q.menuId }, ...paginaCms(q), orderBy: [{ orden: 'asc' }, { id: 'asc' }] })).map(mapearMenuItem) }
  async obtener(id: bigint): Promise<MenuItem | null> { const f = await this.db.menuItem.findUnique({ where: { id: idCMS(id) } }); return f ? mapearMenuItem(f) : null }
  async crear(d: NuevaMenuItem, ctx: EscrituraMenuItem): Promise<MenuItem> {
    return transaccionCms(this.db, async tx => {
      await gestionarCms(tx, ctx, 'items-menu')
      const ruta = await rutaCategoriaMenu(tx, d.menuId, d.categoriaId), lista = await hermanos(tx, d.menuId)
      if (lista.length >= 2147483647) throw new Error('Orden de ítem inválido')
      const e = new MenuItem({ ...d, ruta, orden: Orden.create(lista.length + 1), id: 1n, estado: 'activo', fechas: { creadoEn: ctx.cuando, actualizadoEn: ctx.cuando, eliminadoEn: null } })
      await validarMenuItem(tx, e); await avanzarMenu(tx, e.menuId, ctx.cuando); await recolocar(tx, lista, ctx)
      const fila = await tx.menuItem.create({ data: datos(e) }), resultado = mapearMenuItem(fila)
      await auditarCms(tx, ctx, 'items-menu', 'menu_item', fila.id, null, resultado); return resultado
    })
  }
  async guardar(e: MenuItem, version: Date, ctx: EscrituraMenuItem): Promise<void> {
    await transaccionCms(this.db, async tx => {
      await gestionarCms(tx, ctx, 'items-menu'); cambioCms(version, e.actualizadoEn, ctx)
      const anterior = await tx.menuItem.findUnique({ where: { id: e.id } })
      if (!anterior || anterior.eliminadoEn !== null) throw new Error('Registro CMS no disponible')
      if (!mismoCms(anterior.actualizadoEn, version)) throw new Error('Registro CMS modificado por otra operación')
      if (!mismoCms(anterior.menuId, e.menuId) || !mismoCms(anterior.creadoEn, e.creadoEn)) throw new Error('Campo inmutable: menú o creadoEn')
      await validarMenuItem(tx, e)
      if (e.estado !== 'eliminado' && e.categoriaId !== null && (ctx.recalcularRuta === true || e.estado === 'activo' || e.categoriaId !== anterior.categoriaId || e.nombre !== anterior.nombre)) e.cambiarRuta(await rutaCategoriaMenu(tx, e.menuId, e.categoriaId), ctx.cuando)
      let lista = await hermanos(tx, e.menuId)
      if (e.estado === 'eliminado') {
        if ((await tx.menuItem.updateMany({ where: { id: e.id, actualizadoEn: version, eliminadoEn: null }, data: datos(e) })).count !== 1) throw new Error('Ítem modificado por otra operación')
        lista = lista.filter(x => x.id !== e.id)
        await avanzarMenu(tx, e.menuId, ctx.cuando); await recolocar(tx, lista, ctx)
        await auditarCms(tx, ctx, 'items-menu', 'menu_item', e.id, anterior, e)
      } else {
        if (e.orden.value !== anterior.orden) {
          if (e.orden.value < 1 || e.orden.value > lista.length) throw new Error('Posición de ítem inválida')
          lista = lista.filter(x => x.id !== e.id); lista.splice(e.orden.value - 1, 0, anterior)
        }
        await avanzarMenu(tx, e.menuId, ctx.cuando); await recolocar(tx, lista, ctx, { entidad: e, anterior })
      }
    })
  }
}
