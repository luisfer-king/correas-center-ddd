import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usarSesion } from './sesion-portal'

export function PortalBase() {
    const { estado, cerrar } = usarSesion()
    const [error, setError] = useState('')
    const [cerrando, setCerrando] = useState(false)

    async function salir() {
        if (cerrando) return
        setError('')
        setCerrando(true)
        try { await cerrar() }
        catch { setError('No se pudo cerrar la sesión. Verifica la conexión e inténtalo de nuevo.') }
        finally { setCerrando(false) }
    }

    return <main className="min-h-screen w-full bg-neutral-100 text-neutral-950">
        <header className="border-b border-neutral-200 bg-white px-6 py-5">
            <div className="flex w-full flex-wrap items-center justify-between gap-4">
                <span className="font-bold tracking-wide">Correas Center · Portal</span>
                <div className="flex items-center gap-5">
                    <Link to="/" className="text-sm text-red-700 underline">Volver al inicio</Link>
                    <button type="button" onClick={() => void salir()} disabled={cerrando}
                        className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-semibold hover:bg-neutral-100 disabled:opacity-60">{cerrando ? 'Saliendo…' : 'Cerrar sesión'}</button>
                </div>
            </div>
        </header>
        <section className="w-full px-6 py-12 sm:px-10" aria-labelledby="portal-titulo">
            <p className="text-sm font-semibold uppercase tracking-widest text-red-700">Portal administrativo</p>
            <h1 id="portal-titulo" className="mt-3 text-3xl font-semibold">Bienvenido</h1>
            <p className="mt-4 text-neutral-700">Tu sesión está activa. La gestión de roles se incorporará en la siguiente entrega.</p>
            {estado.tipo === 'autenticado' && <p className="mt-5 text-sm text-neutral-600">Usuario: {estado.usuarioId}</p>}
            {error && <p role="alert" className="mt-5 rounded-md bg-red-50 p-4 text-red-800">{error}</p>}
        </section>
    </main>
}