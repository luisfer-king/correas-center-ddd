import { Link } from 'react-router-dom'
import { usarSesion } from './sesion-portal'

export function PortalBase() {
    const { estado } = usarSesion()
    return <main className="w-full px-6 py-12 sm:px-10" aria-labelledby="portal-titulo">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-700">Portal administrativo</p>
        <h1 id="portal-titulo" className="mt-3 text-3xl font-semibold">Bienvenido</h1>
        <p className="mt-4 text-neutral-700">Tu sesión está activa. Consulta roles, usuarios y la auditoría según los permisos de tu cuenta.</p>
        {estado.tipo === 'autenticado' && <p className="mt-5 text-sm text-neutral-600">Usuario: {estado.usuarioId}</p>}
        <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/portal/roles" className="inline-block rounded-md bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800">Consultar roles</Link>
            <Link to="/portal/usuarios" className="inline-block rounded-md border border-neutral-300 bg-white px-5 py-3 font-semibold">Consultar usuarios</Link>
        </div>
    </main>
}