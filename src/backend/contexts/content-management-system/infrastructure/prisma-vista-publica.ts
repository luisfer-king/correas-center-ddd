import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { ConsultaVistaPublica } from '../application/ports/consulta-vista-publica.js'
import type { GrupoPublico, VistaPublica } from '../../../../shared/vista-publica.js'
import { nombreRuta, rutaPublica } from '../../../../shared/vista-publica.js'
const activo = { estado: 'activo' as const, eliminadoEn: null }
const orden = [{ orden: 'asc' as const }, { id: 'asc' as const }]
export class PrismaVistaPublica implements ConsultaVistaPublica {
 constructor(private readonly db: PrismaClient) {}
 async obtener(empresaId: bigint): Promise<VistaPublica | null> {
  return this.db.$transaction(async tx => {
   const empresa = await tx.empresa.findFirst({ where: { id: empresaId, ...activo }, select: { id: true, nombre: true, logo: true } })
   if (!empresa) return null
   const [menus, productos, industrias, servicios, tipos, secciones] = await Promise.all([
    tx.menu.findMany({ where: { empresaId, ...activo, mostrar: true }, orderBy: orden, select: { id: true, grupo: true, tipoRegistro: true, registroId: true, ruta: true, icono: true, orden: true, cargarSubmenu: true, relMenuItem: { where: activo, orderBy: orden, select: { id: true, ruta: true, orden: true } } } }),
    tx.producto.findMany({ where: { empresaId, ...activo }, select: { id: true, nombre: true } }),
    tx.industria.findMany({ where: { empresaId, ...activo }, select: { id: true, nombre: true } }),
    tx.servicio.findMany({ where: { empresaId, ...activo }, select: { id: true, nombre: true } }),
    tx.tipoSeccion.findMany({ where: activo, orderBy: orden, select: { id: true, slug: true, orden: true } }),
    tx.contenidoSeccion.findMany({ where: { empresaId, ...activo, mostrar: true }, orderBy: orden, select: { id: true, tipoSeccionId: true, titulo: true, subtitulo: true, descripcion: true, imagen: true, metadata: true, orden: true } }),
   ])
   const resultado: VistaPublica = { empresa: { ...empresa, id: String(empresa.id) }, menus: { Producto: [], Aplicacion: [], Servicio: [] }, secciones: [] }
   const fuentes = { producto: new Map(productos.map(p => [String(p.id), p.nombre])), industria: new Map(industrias.map(p => [String(p.id), p.nombre])), servicio: new Map(servicios.map(p => [String(p.id), p.nombre])) }
   for (const menu of menus) {
    const grupo = ({ producto: 'Producto', productos: 'Producto', aplicacion: 'Aplicacion', aplicaciones: 'Aplicacion', industria: 'Aplicacion', servicio: 'Servicio', servicios: 'Servicio' } as Record<string, GrupoPublico>)[menu.grupo.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()]
    const tipo = grupo === 'Producto' ? 'producto' : grupo === 'Aplicacion' ? 'industria' : 'servicio'
    const nombre = fuentes[tipo].get(String(menu.registroId)), ruta = rutaPublica(menu.ruta)
    if (!grupo || menu.tipoRegistro !== tipo || !nombre || !ruta) continue
    resultado.menus[grupo].push({ id: String(menu.id), nombre, grupo, ruta, orden: menu.orden, icono: menu.icono, items: menu.relMenuItem.flatMap(item => {
     const destino = rutaPublica(item.ruta)
     return destino ? [{ id: String(item.id), nombre: nombreRuta(destino), ruta: menu.cargarSubmenu === 'activo' ? destino : ruta, orden: item.orden }] : []
    }) })
   }
   for (const tipo of tipos) for (const s of secciones.filter(s => s.tipoSeccionId === tipo.id)) {
    const metadata = s.metadata && typeof s.metadata === 'object' && !Array.isArray(s.metadata) ? s.metadata as Record<string, unknown> : {}
    resultado.secciones.push({ id: String(s.id), tipo: tipo.slug, titulo: s.titulo, subtitulo: s.subtitulo, descripcion: s.descripcion, imagen: s.imagen, metadata, orden: s.orden })
   }
   return resultado
  }, { isolationLevel: 'RepeatableRead' })
 }
}
