import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ErrorApi } from '../../../shared/api/cliente-http'
import { usarSesion } from './sesion-portal'
import { usarTemaPortal } from './tema-portal'

export function AccesoPortal() {
    const { estado, iniciar, comprobar } = usarSesion()
    const { tema, alternar } = usarTemaPortal()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [error, setError] = useState('')
    const navegar = useNavigate()
    const ubicacion = useLocation()
    const destinoSolicitado: unknown = ubicacion.state?.desde
    const destino = typeof destinoSolicitado === 'string' && /^\/portal(?:\/|\?|$)/.test(destinoSolicitado)
        && !destinoSolicitado.startsWith('/portal/acceso') ? destinoSolicitado : '/portal'

    if (estado.tipo === 'autenticado') return <Navigate to={destino} replace />

    async function enviar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        if (enviando) return
        setError('')
        setEnviando(true)
        try {
            await iniciar(email.trim(), password)
            setPassword('')
            navegar(destino, { replace: true })
        } catch (fallo) {
            if (fallo instanceof ErrorApi) {
                setError(fallo.estado === 401 ? 'Correo o contraseña incorrectos.'
                    : fallo.estado === 429 ? 'Demasiados intentos. Espera un minuto y vuelve a intentar.'
                        : fallo.estado === 403 ? 'Solicitud rechazada por el origen. Comprueba la URL y el proxy del portal.'
                            : 'No se pudo iniciar sesión. Inténtalo de nuevo.')
            } else setError('No se pudo conectar con el servidor. Inténtalo de nuevo.')
        } finally {
            setEnviando(false)
        }
    }

    return <main className="grid min-h-screen w-full bg-neutral-100 lg:grid-cols-2">
        <section className="hidden bg-neutral-950 px-12 py-16 text-white lg:flex lg:flex-col lg:justify-between" aria-label="Correas Center">
            <p className="text-lg font-bold">Correas Center</p>
            <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-red-400">Portal administrativo</p>
                <h1 className="mt-5 max-w-lg text-5xl font-semibold leading-tight">Tu espacio de gestión.</h1>
            </div>
            <p className="text-sm text-neutral-400">Acceso reservado a usuarios autorizados.</p>
        </section>
        <section className="flex w-full items-center justify-center px-6 py-12 sm:px-12">
            <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-7 shadow-sm sm:p-10">
                <button type="button" onClick={alternar} className="float-right text-sm font-medium text-red-700 underline">
                    {tema === 'oscuro' ? 'Tema claro' : 'Tema oscuro'}
                </button>
                <p className="font-bold text-red-700 lg:hidden">Correas Center</p>
                <h2 className="mt-3 text-3xl font-semibold text-neutral-950">Iniciar sesión</h2>
                <p className="mt-2 text-sm text-neutral-600">Ingresa con tu cuenta del portal.</p>
                {estado.tipo === 'comprobando' && <p className="mt-4 text-sm" role="status">Comprobando sesión…</p>}
                {estado.tipo === 'error' && <div className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-900" role="alert">
                    No se pudo comprobar la sesión. <button type="button" onClick={() => void comprobar()} className="font-semibold underline">Reintentar</button>
                </div>}
                <form onSubmit={(evento) => void enviar(evento)} className="mt-8 space-y-5">
                    <div>
                        <label htmlFor="correo" className="mb-2 block text-sm font-medium">Correo electrónico</label>
                        <input id="correo" type="email" autoComplete="username" required maxLength={254} value={email}
                            onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-neutral-300 px-4 py-3 focus-visible:outline-2 focus-visible:outline-red-700" />
                    </div>
                    <div>
                        <label htmlFor="clave" className="mb-2 block text-sm font-medium">Contraseña</label>
                        <input id="clave" type="password" autoComplete="current-password" required value={password}
                            onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-neutral-300 px-4 py-3 focus-visible:outline-2 focus-visible:outline-red-700" />
                    </div>
                    {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
                    <button type="submit" disabled={enviando || estado.tipo === 'comprobando'}
                        className="w-full rounded-md bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-wait disabled:opacity-60">
                        {enviando ? 'Ingresando…' : 'Ingresar al portal'}
                    </button>
                </form>
                <Link to="/" className="mt-6 inline-block text-sm font-medium text-red-700 underline">Volver al inicio</Link>
            </div>
        </section>
    </main>
}