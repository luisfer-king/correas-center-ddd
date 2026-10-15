import type { DatosMarcoPublico } from '../api/cliente-marco-publico'
import type { GrupoPublico, VistaPublica } from '../../../../shared/vista-publica'
import { enlacePublico } from '../../../../shared/publico/rutas'
export function normalizarRutaPublica(ruta: string) { return ruta.split(/[?#]/)[0].replace(/\/+$/, '') || '/' }
export const paginasPublicas = [
 { ruta: '/', nombre: 'Inicio' }, { ruta: '/products', nombre: 'Productos' }, { ruta: '/applications', nombre: 'Industrias' },
 { ruta: '/services', nombre: 'Servicios' }, { ruta: '/about', nombre: 'Nosotros' }, { ruta: '/branches', nombre: 'Sucursales' },
 { ruta: '/contact', nombre: 'Contacto' }, { ruta: '/privacy', nombre: 'Privacidad' }, { ruta: '/terms', nombre: 'Términos y condiciones' }, { ruta: '/search', nombre: 'Buscar' },
]
export function vistaParaNavigation(datos: DatosMarcoPublico): VistaPublica {
 const menus: VistaPublica['menus'] = { Producto: [], Aplicacion: [], Servicio: [] }
 for (const m of datos.menus) {
  const clave = m.grupo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
  const grupo = ({ producto: 'Producto', productos: 'Producto', aplicacion: 'Aplicacion', aplicaciones: 'Aplicacion', industria: 'Aplicacion', industrias: 'Aplicacion', servicio: 'Servicio', servicios: 'Servicio' } as Record<string, GrupoPublico>)[clave]
  const ruta = enlacePublico(m.ruta)
  if (!grupo || !ruta) continue
  menus[grupo].push({ id: m.id, nombre: m.nombre, grupo, ruta, orden: m.orden, icono: m.icono, cargarSubmenu:m.cargarSubmenu, items: m.items.flatMap(i => {
   const destino = enlacePublico(i.ruta)
   return destino ? [{ id: i.id, nombre: i.nombre, ruta: destino, orden: i.orden }] : []
  }) })
 }
 return { empresa: datos.empresa, menus, secciones: datos.secciones }
}
export function destinoPublico(ruta: string, datos: DatosMarcoPublico): { nombre: string; padre?: { nombre: string; ruta: string } } | null {
 const actual = normalizarRutaPublica(ruta)
 const vista = vistaParaNavigation(datos)
 for (const m of Object.values(vista.menus).flat()) {
  if (normalizarRutaPublica(m.ruta) === actual) return { nombre: m.nombre }
  const i = m.items.find(i => normalizarRutaPublica(i.ruta) === actual)
  if (i) return { nombre: i.nombre, padre: { nombre: m.nombre, ruta: m.ruta } }
 }
 const pagina = paginasPublicas.find(p => p.ruta === actual)
 if (pagina) return { nombre: pagina.nombre }
 const f = datos.footer.find(f => f.url && normalizarRutaPublica(f.url) === actual && enlacePublico(f.url))
 return f ? { nombre: f.titulo || 'Información' } : null
}
export function enlaceWhatsApp(config: DatosMarcoPublico['configuracion']['whatsapp']): string | null {
 const numero = config.numero.replace(/[ +().-]/g, '')
 if (!config.activo || !/^[1-9][0-9]{7,14}$/.test(numero)) return null
 return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(config.mensaje)
}
