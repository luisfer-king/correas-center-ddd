import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { usarSesion } from './sesion-portal'

export function PortalProtegido() {
    const { estado, comprobar } = usarSesion()
    const ubicacion = useLocation()
    if (estado.tipo === 'comprobando') {
        return <main className="flex min-h-screen w-full items-center justify-center bg-neutral-100 px-6" role="status">Comprobando sesión…</main>
    }
    if (estado.tipo === 'error') {
        return <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-neutral-100 px-6">
            <p role="alert">No se pudo comprobar la sesión. Verifica tu conexión e inténtalo de nuevo.</p>
            <button type="button" onClick={() => void comprobar()} className="rounded-md bg-red-700 px-5 py-3 font-semibold text-white">Reintentar</button>
        </main>
    }
    if (estado.tipo === 'anonimo') {
        return <Navigate to="/portal/acceso" state={{ desde: ubicacion.pathname + ubicacion.search }} replace />
    }
    return <Outlet />
}