import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import type { ConfiguracionPublica } from '../../../../shared/publico/cms'

type Ventana = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; Tawk_API?: { onLoad?: () => void; showWidget?: () => void; hideWidget?: () => void; shutdown?: () => void; start?: (options: {showWidget: boolean}) => void; switchWidget?: (options: {propertyId: string; widgetId: string}, callback: (error?: unknown) => void) => void; autoStart?: boolean }; Tawk_LoadStart?: Date }
export const idAnalyticsValido = (id: string) => /^G-[A-Z0-9]{4,32}$/.test(id)
export const idsChatValidos = (property: string, widget: string) => /^[a-f0-9]{24}$/.test(property) && /^[a-zA-Z0-9]{1,40}$/.test(widget)
export function IntegracionesPublicas({ configuracion }: { configuracion: ConfiguracionPublica }) {
 const { pathname } = useLocation()
 const ultima = useRef('')
 const analytics = configuracion.analytics.activo && idAnalyticsValido(configuracion.analytics.id) ? configuracion.analytics.id : ''
 const { propertyId, widgetId, activo } = configuracion.chat
 useEffect(() => {
  if (!analytics) return
  const w = window as Ventana
  const flags = window as unknown as Record<string, unknown>
  flags['ga-disable-' + analytics] = false
  w.dataLayer ??= []
  w.gtag ??= function () { w.dataLayer!.push(arguments) }
  if (!document.getElementById('cc-google-analytics')) {
   w.gtag('js', new Date())
   w.gtag('config', analytics, { send_page_view: false, allow_google_signals: false, page_location: window.location.origin + window.location.pathname, page_referrer: '' })
   const script = document.createElement('script')
   script.id = 'cc-google-analytics'; script.async = true
   script.src = 'https://www.googletagmanager.com/gtag/js?id=' + analytics
   document.head.append(script)
  }
  return () => { flags['ga-disable-' + analytics] = true; document.getElementById('cc-google-analytics')?.remove(); ultima.current = '' }
 }, [analytics])
 useEffect(() => {
  if (!analytics) return
  // No registrar query/hash: pueden contener búsquedas o datos del formulario.
  const timer = window.setTimeout(() => {
   const clave = analytics + pathname
   if (ultima.current === clave) return
   ultima.current = clave
   ;(window as Ventana).gtag?.('event', 'page_view', { send_to: analytics, page_location: window.location.origin + pathname, page_title: document.title, page_referrer: '' })
  }, 300)
  return () => window.clearTimeout(timer)
 }, [analytics, pathname])
 useEffect(() => {
  if (!activo || !idsChatValidos(propertyId, widgetId)) return
  const w = window as Ventana
  let vigente = true
  w.Tawk_API ??= {}
  w.Tawk_API.autoStart = false
  const mostrar = () => { if (vigente) w.Tawk_API?.start?.({showWidget: true}); else { w.Tawk_API?.hideWidget?.(); w.Tawk_API?.shutdown?.() } }
  const clave = propertyId + '/' + widgetId
  let script = document.getElementById('cc-tawk') as HTMLScriptElement | null
  const conectar = () => {
   if (script?.dataset.widget !== clave && w.Tawk_API?.switchWidget) {
    w.Tawk_API.switchWidget({propertyId, widgetId}, error => { if (!error && vigente) { if (script) script.dataset.widget = clave; mostrar() } })
   } else mostrar()
  }
  w.Tawk_API.onLoad = conectar
  if (w.Tawk_API.start) conectar()
  else if (!script) {
   w.Tawk_LoadStart = new Date()
   script = document.createElement('script')
   script.id = 'cc-tawk'; script.async = true; script.charset = 'UTF-8'; script.dataset.widget = clave
   script.src = 'https://embed.tawk.to/' + clave
   script.setAttribute('crossorigin', '*')
   script.onerror = () => script?.remove()
   document.head.append(script)
  }
  // Conservar el loader evita duplicar iframes en StrictMode y al volver del portal.
  return () => { vigente = false; w.Tawk_API?.hideWidget?.(); w.Tawk_API?.shutdown?.() }

 }, [activo, propertyId, widgetId])
 return null
}
