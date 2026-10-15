import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
export function textoMetadatos(valor: string): string { return valor.replace(/\s+/g, ' ').trim().slice(0, 160) }
/** Sincroniza contenido visible, incluso después de consultas asíncronas del catálogo. */
export function MetadatosPublicos({ empresa }: { empresa: string }) {
 const { pathname } = useLocation()
 useEffect(() => {
  const creados: Element[] = []
  const anteriores = new Map<Element, string | null>()
  const meta = (clave: string, valor: string, propiedad = false) => {
   const atributo = propiedad ? 'property' : 'name'
   let elemento = document.head.querySelector<HTMLMetaElement>(`meta[${atributo}="${clave}"]`)
   if (!elemento) { elemento = document.createElement('meta'); elemento.setAttribute(atributo, clave); document.head.append(elemento); creados.push(elemento) }
   else if (!anteriores.has(elemento)) anteriores.set(elemento, elemento.getAttribute('content'))
   if (elemento.content !== valor) elemento.content = valor
  }
  const canonical = document.createElement('link'); canonical.rel = 'canonical'
  canonical.href = window.location.origin + pathname; document.head.append(canonical)
  const actualizar = () => {
   const main = document.getElementById('contenido-publico')
   const titulo = main?.querySelector('h1')?.textContent?.trim() || main?.querySelector('.catalogo-vacio h2')?.textContent?.trim() || empresa
   const descripcion = textoMetadatos(main?.querySelector('p')?.textContent || `Productos, servicios y soluciones industriales de ${empresa}.`)
   meta('description', descripcion); meta('og:title', titulo + (titulo === empresa ? '' : ' | ' + empresa), true)
   meta('og:description', descripcion, true); meta('og:type', 'website', true); meta('og:locale', 'es_BO', true)
   meta('og:url', canonical.href, true); meta('twitter:card', 'summary')
   const ausente = /^(Página no encontrada|Recurso no disponible)$/.test(titulo)
   meta('robots', ausente || pathname === '/search' ? 'noindex,follow' : 'index,follow')
  }
  actualizar()
  const observer = new MutationObserver(actualizar)
  const main = document.getElementById('contenido-publico')
  if (main) observer.observe(main, { childList: true, subtree: true, characterData: true })
  return () => { observer.disconnect(); canonical.remove(); creados.forEach(e => e.remove()); anteriores.forEach((v,e) => { if (v === null) e.removeAttribute('content'); else e.setAttribute('content',v) }) }
 }, [pathname, empresa])
 return null
}
