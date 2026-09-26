import { Link } from 'react-router-dom'
import { usarSesion } from './sesion-portal'

export function PortalBase() {
    const { estado } = usarSesion()
    return <main className="w-full px-6 py-12 sm:px-10" aria-labelledby="portal-titulo">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-700">Portal administrativo</p>
        <h1 id="portal-titulo" className="mt-3 text-3xl font-semibold">Bienvenido</h1>
        <p className="mt-4 text-neutral-700">Tu sesión está activa. Ya puedes consultar los roles.</p>
        {estado.tipo === 'autenticado' && <p className="mt-5 text-sm text-neutral-600">Usuario: {estado.usuarioId}</p>}
        <Link to="/portal/roles" className="mt-7 inline-block rounded-md bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800">Consultar roles</Link>
    </main>
}