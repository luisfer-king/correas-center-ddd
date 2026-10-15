import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { ConsultaPublica } from '../application/ports/consulta-publica-menus.js'
import type { ConsultaPaginaPublica } from '../../../../shared/publico/comun.js'
import { publicable, ordenPublico, paginar } from '../../../shared/infrastructure/paginacion-publica.js'
export class PrismaPublicoMenus implements ConsultaPublica {
 constructor(private readonly db: PrismaClient) {}
 async obtener(empresaId: bigint, p: ConsultaPaginaPublica) {
  const filas = await this.db.menu.findMany({ where: { empresaId, ...publicable, mostrar: true }, skip: p.desplazamiento, take: p.limite + 1, orderBy: ordenPublico,
   select: { id: true, grupo: true, tipoRegistro: true, registroId: true, ruta: true, icono: true, orden: true, cargarSubmenu: true,
    relMenuItem: { where: publicable, orderBy: ordenPublico, select: { id: true, nombre: true, categoriaId: true, ruta: true, orden: true } } },
  })
  return paginar(filas.map(f => ({ id: String(f.id), grupo: f.grupo, tipoRegistro: f.tipoRegistro, registroId: String(f.registroId), ruta: f.ruta, icono: f.icono, orden: f.orden,
   cargarSubmenu: f.cargarSubmenu === 'activo', items: f.relMenuItem.map(i => ({ id: String(i.id), nombre: i.nombre, categoriaId: i.categoriaId === null ? null : String(i.categoriaId), ruta: i.ruta, orden: i.orden })) })), p)
 }
}
