import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AccesoTemporal } from '../features/iam/presentation/acceso-temporal'
import { PortalBase } from '../features/iam/presentation/portal-base'
import { PortadaTemporal } from './portada-temporal'

export function Rutas() {
    return <BrowserRouter><Routes>
        <Route path="/" element={<PortadaTemporal />} />
        <Route path="/portal" element={<PortalBase />} />
        <Route path="/portal/acceso" element={<AccesoTemporal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes></BrowserRouter>
}