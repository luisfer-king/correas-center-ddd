import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { iamApi } from '../api/cliente-iam'
import { usarSesion } from './sesion-portal'
import { usarTemaPortal } from './tema-portal'

const estiloEnlace = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-red-700 text-white' : 'text-neutral-700 hover:bg-neutral-100'}`

export function MarcoPortal() {
    const { cerrar } = usarSesion()
    const { tema, alternar } = usarTemaPortal()
    const [cerrando, setCerrando] = useState(false)
    const [error, setError] = useState('')
    const [leerAuditoria, setLeerAuditoria] = useState(false)

    useEffect(() => {
        const controlador = new AbortController()
        void iamApi.capacidadesRoles({ signal: controlador.signal }).then((capacidades) => {
            if (!controlador.signal.aborted) setLeerAuditoria(capacidades.leerAuditoria)
        }).catch(() => { if (!controlador.signal.aborted) setLeerAuditoria(false) })
        return () => controlador.abort()
    }, [])

    async function salir() {
        if (cerrando) return
        setError('')
        setCerrando(true)
        try { await cerrar() }
        catch { setError('No se pudo cerrar la sesión. Verifica la conexión e inténtalo de nuevo.') }
        finally { setCerrando(false) }
    }

    return <div className="min-h-screen w-full bg-neutral-100 text-neutral-950">
        <header className="w-full border-b border-neutral-200 bg-white px-6 py-4 sm:px-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="font-bold tracking-wide">Correas Center · Portal</span>
                <nav aria-label="Navegación del portal" className="flex flex-wrap items-center gap-2">
                    <NavLink to="/portal" end className={estiloEnlace}>Inicio</NavLink>
                    <NavLink to="/portal/roles" className={estiloEnlace}>Roles</NavLink>
                    <NavLink to="/portal/usuarios" className={estiloEnlace}>Usuarios</NavLink>
                    <NavLink to="/portal/mi-perfil" className={estiloEnlace}>Mi perfil y seguridad</NavLink>
                    {leerAuditoria && <NavLink to="/portal/auditoria" className={estiloEnlace}>Auditoría</NavLink>}
                    <button type="button" onClick={alternar} aria-label={tema === 'oscuro' ? 'Activar tema claro' : 'Activar tema oscuro'}
                        className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-semibold hover:bg-neutral-100">
                        {tema === 'oscuro' ? '☀ Tema claro' : '◐ Tema oscuro'}
                    </button>
                    <button type="button" onClick={() => void salir()} disabled={cerrando}
                        className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-semibold hover:bg-neutral-100 disabled:opacity-60">
                        {cerrando ? 'Saliendo…' : 'Cerrar sesión'}
                    </button>
                </nav>
            </div>
            {error && <p role="alert" className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        </header>
        <Outlet />
    </div>
}
