import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { VistaPublica } from '../features/publico/presentation/entrada-publica'
const Portal = lazy(()=>import('./rutas-portal').then(m=>({default:m.RutasPortal})))
export function Rutas() {
  return <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Routes>
    {/* // CMS público: vista inicial v1 */}
    <Route path="/" element={<VistaPublica />} />
    <Route path="/products" element={<VistaPublica />} />
    <Route path="/products/:slug" element={<VistaPublica />} />
    <Route path="/products/:slug/:categoria" element={<VistaPublica />} />
    <Route path="/applications" element={<VistaPublica />} />
    <Route path="/applications/:slug" element={<VistaPublica />} />
    <Route path="/services" element={<VistaPublica />} />
    <Route path="/services/:slug" element={<VistaPublica />} />
    <Route path="/contact" element={<VistaPublica />} />
    <Route path="/about" element={<VistaPublica />} />
    {/* Fase 4, entrega 2: marco público y rutas institucionales */}
    <Route path="/branches" element={<VistaPublica />} />
    <Route path="/privacy" element={<VistaPublica />} />
    <Route path="/terms" element={<VistaPublica />} />
    <Route path="/search" element={<VistaPublica />} />
    <Route path="/portal/*" element={<Suspense fallback={<p role="status">Cargando administración…</p>}><Portal /></Suspense>} />
    <Route path="*" element={<VistaPublica />} />
  </Routes></BrowserRouter>
}
