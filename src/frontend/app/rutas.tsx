import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AccesoPortal } from '../features/iam/presentation/acceso-portal'
import { ListadoRoles } from '../features/iam/presentation/listado-roles'
import { MarcoPortal } from '../features/iam/presentation/marco-portal'
import { PortalBase } from '../features/iam/presentation/portal-base'
import { PortalProtegido } from '../features/iam/presentation/portal-protegido'
import { ProveedorSesion } from '../features/iam/presentation/sesion-portal'
import { TemaPortal } from '../features/iam/presentation/tema-portal'
import { PortadaTemporal } from './portada-temporal'

export function Rutas() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<PortadaTemporal />} />
    <Route path="/portal" element={<TemaPortal><ProveedorSesion><Outlet /></ProveedorSesion></TemaPortal>}>
      <Route path="acceso" element={<AccesoPortal />} />
      <Route element={<PortalProtegido />}>
        <Route element={<MarcoPortal />}>
          <Route index element={<PortalBase />} />
          <Route path="roles" element={<ListadoRoles />} />
          <Route path="roles/:id" element={<ListadoRoles />} />
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>
}