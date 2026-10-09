import { lazy, Suspense } from 'react'
const PaginaPublica = lazy(() => import('./vista-publica').then(modulo => ({ default: modulo.VistaPublica })))
export function VistaPublica() { return <Suspense fallback={<p role="status">Cargando Correas Center…</p>}><PaginaPublica /></Suspense> }
