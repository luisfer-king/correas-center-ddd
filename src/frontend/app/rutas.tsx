import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AccesoPortal } from '../features/iam/presentation/acceso-portal'
import { PortalBase } from '../features/iam/presentation/portal-base'
import { PortalProtegido } from '../features/iam/presentation/portal-protegido'
import { ProveedorSesion } from '../features/iam/presentation/sesion-portal'
import { PortadaTemporal } from './portada-temporal'

export function Rutas() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<PortadaTemporal />} />
    <Route path="/portal" element={<ProveedorSesion><Outlet /></ProveedorSesion>}>
      <Route path="acceso" element={<AccesoPortal />} />
      <Route element={<PortalProtegido />}>
        <Route index element={<PortalBase />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>
}