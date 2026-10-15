import { SuscripcionPublica } from './suscripcion-publica'
import { IconoRedSocial } from './icono-red-social'
import { SucursalesFooter } from './sucursales-footer'
import { Link } from 'react-router-dom'
import { ArrowUp, ArrowRight, RefreshCw } from 'lucide-react'
import type { DatosMarcoPublico } from '../api/cliente-marco-publico'
import type { FooterPublicado } from '../../../../shared/publico/cms'
import { enlacePublico } from '../../../../shared/publico/rutas'
function destino(datos: DatosMarcoPublico, i: FooterPublicado) {
 const m = datos.menus.find(m => m.tipoRegistro === i.tipoRegistro && m.registroId === i.registroId)
 const c = datos.menus.flatMap(m => m.items).find(c => i.tipoRegistro === 'categoria' && c.categoriaId === i.registroId)
 return enlacePublico(i.url, true) || enlacePublico(m?.ruta || c?.ruta)
}
function EnlaceFooter({ item, datos }: { item: FooterPublicado; datos: DatosMarcoPublico }) {
 const url = destino(datos, item), texto = <span>{item.titulo || 'Más información'}</span>
 return url ? url.startsWith('/') ? <Link to={url}>{texto}</Link> : <a href={url} {...(url.startsWith('https:') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{texto}</a> : texto
}
export function FooterPublico({ datos, actualizar, cargando }: { datos: DatosMarcoPublico; actualizar: () => void; cargando: boolean }) {
 const delTipo = (tipo: string) => datos.footer.filter(i => (i.tipoRegistro || i.tipo).toLowerCase() === tipo)
 const redes = datos.footer.filter(i => i.tipo.toLowerCase() === 'red_social')
 const extras = datos.footer.filter(i => !['producto','industria','servicio','red_social'].includes((i.tipoRegistro || i.tipo).toLowerCase()))
 return <footer className="publico-footer publico-footer-aprobado" translate="no">
  <section className="publico-newsletter"><div className="publico-footer-contenedor publico-newsletter-interior"><div><h2>Mantente Informado</h2><p>Conoce nuestras novedades, promociones y soluciones industriales.</p></div><SuscripcionPublica/></div></section>
  <div className="publico-footer-contenedor publico-footer-grid">
   <section className="publico-footer-empresa"><Link to="/"><h2>{datos.empresa.nombre}</h2></Link><p>Líderes en soluciones industriales, hidráulicas, neumáticas y transmisión de potencia en Bolivia. Más de 25 años brindando calidad y servicio técnico especializado.</p>
    <div className="publico-redes" aria-label="Redes sociales">{redes.map(i => { const url = destino(datos,i); return url ? <a key={i.id} href={url} target="_blank" rel="noopener noreferrer" aria-label={'Visitar ' + (i.titulo || 'red social')} title={i.titulo || undefined}><IconoRedSocial nombre={i.icono || i.titulo} /></a> : null })}</div>
    <span className="publico-sello"><span aria-hidden="true" className="publico-sello-punto" /><span>Fabricante Autorizado SKF Bolivia</span></span>
   </section>
   <section><h2 className="publico-footer-titulo">Productos</h2><ul>{delTipo('producto').slice(0,8).map(i => <li key={i.id}><EnlaceFooter item={i} datos={datos} /></li>)}</ul><Link className="publico-footer-ver" to="/products"><span>Ver todos</span><ArrowRight size={14} aria-hidden="true" /></Link></section>
   <section><h2 className="publico-footer-titulo">Aplicaciones</h2><ul>{delTipo('industria').slice(0,6).map(i => <li key={i.id}><EnlaceFooter item={i} datos={datos} /></li>)}</ul><Link className="publico-footer-ver" to="/applications"><span>Ver todas</span><ArrowRight size={14} aria-hidden="true" /></Link>
    <h2 className="publico-footer-titulo publico-footer-servicios">Servicios</h2><ul>{delTipo('servicio').slice(0,4).map(i => <li key={i.id}><EnlaceFooter item={i} datos={datos} /></li>)}</ul><Link className="publico-footer-ver" to="/services"><span>Ver todos</span><ArrowRight size={14} aria-hidden="true" /></Link></section>
   <section><h2 className="publico-footer-titulo">Nuestras Sucursales</h2><SucursalesFooter inicial={datos.sucursales} /><Link className="publico-footer-ver" to="/branches"><span>Ver sucursales</span><ArrowRight size={14} aria-hidden="true" /></Link></section>
  </div>
  {extras.length > 0 && <div className="publico-footer-contenedor publico-footer-extras">{extras.map(i => <EnlaceFooter key={i.id} item={i} datos={datos} />)}</div>}
  <div className="publico-footer-base"><div className="publico-footer-contenedor publico-footer-base-interior"><p><span>© {new Date().getFullYear()} </span><strong>{datos.empresa.nombre}</strong><span>. Todos los derechos reservados.</span></p><nav aria-label="Enlaces del footer"><Link to="/privacy">Política de Privacidad</Link><Link to="/terms">Términos y Condiciones</Link><Link to="/branches">Mapa del Sitio</Link></nav></div><div className="publico-footer-utilidades"><button disabled={cargando} onClick={actualizar}><RefreshCw size={14} aria-hidden="true" /><span>{cargando ? 'Actualizando…' : 'Actualizar contenido'}</span></button><button onClick={() => window.scrollTo({top:0,behavior:'smooth'})} aria-label="Volver arriba"><ArrowUp size={16} aria-hidden="true" /></button></div></div>
 </footer>
}
