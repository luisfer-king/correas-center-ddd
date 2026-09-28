import { useEffect, useState, type FormEvent } from 'react'
import { ErrorApi } from '../../../shared/api/cliente-http'
import { iamApi } from '../api/cliente-iam'
import type { UsuarioIam } from '../api/tipos-iam'
import { usarSesion } from './sesion-portal'

export function VistaMiPerfil() {
    const { cerrar } = usarSesion()
    const [perfil, setPerfil] = useState<UsuarioIam | null>(null)
    const [nombre, setNombre] = useState('')
    const [telefono, setTelefono] = useState('')
    const [actual, setActual] = useState('')
    const [nueva, setNueva] = useState('')
    const [confirmacion, setConfirmacion] = useState('')
    const [mostrar, setMostrar] = useState(false)
    const [ocupado, setOcupado] = useState(false)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [mensaje, setMensaje] = useState('')

    useEffect(() => {
        const controlador = new AbortController()
        void iamApi.miPerfil({ signal: controlador.signal }).then((datos) => {
            if (controlador.signal.aborted) return
            setPerfil(datos); setNombre(datos.nombreCompleto); setTelefono(datos.telefono ?? '')
        }).catch(() => { if (!controlador.signal.aborted) setError('No se pudo consultar tu perfil.') })
            .finally(() => { if (!controlador.signal.aborted) setCargando(false) })
        return () => controlador.abort()
    }, [])

    async function guardarDatos(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (ocupado) return
        setOcupado(true); setError(''); setMensaje('')
        try {
            const datos = await iamApi.editarMiPerfil({ nombreCompleto: nombre.trim(), telefono: telefono.trim() || null })
            setPerfil(datos); setMensaje('Tus datos se actualizaron correctamente.')
        } catch (fallo) {
            setError(fallo instanceof ErrorApi && fallo.estado === 409
                ? 'Tu perfil cambió en otra ventana. Recarga la página y vuelve a intentarlo.' : 'No se pudieron guardar tus datos.')
        } finally { setOcupado(false) }
    }

    async function guardarClave(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (ocupado) return
        setError(''); setMensaje('')
        if (nueva !== confirmacion) { setError('La confirmación no coincide con la contraseña nueva.'); return }
        setOcupado(true)
        try {
            await iamApi.cambiarMiClave(actual, nueva)
            setActual(''); setNueva(''); setConfirmacion('')
            // El cambio revoca la sesión actual; el proveedor redirige al inicio de sesión.
            try { await cerrar() }
            catch { window.location.assign('/portal/acceso') }
        } catch (fallo) {
            setError(fallo instanceof ErrorApi && fallo.estado === 403
                ? 'La contraseña actual es incorrecta.' : 'No se pudo cambiar la contraseña. Inténtalo de nuevo.')
        } finally { setOcupado(false) }
    }

    return <main className="w-full px-6 py-10 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-700">Cuenta personal</p>
        <h1 className="mt-2 text-3xl font-semibold">Mi perfil y seguridad</h1>
        <p className="mt-2 text-neutral-600">Actualiza tus datos y cambia tu contraseña cuando lo necesites.</p>
        {cargando && <p role="status" className="mt-6">Cargando perfil…</p>}
        {error && <p role="alert" className="mt-6 rounded-md bg-red-50 p-4 text-red-800">{error}</p>}
        {mensaje && <p role="status" className="mt-6 rounded-md bg-green-50 p-4 text-green-900">{mensaje}</p>}
        {perfil && <div className="mt-8 grid max-w-5xl gap-6 lg:grid-cols-2">
            <section className="rounded-lg border border-neutral-200 bg-white p-6">
                <h2 className="text-xl font-semibold">Datos personales</h2>
                <p className="mt-2 text-sm text-neutral-600">Correo de acceso: <span className="font-medium">{perfil.email}</span></p>
                <form onSubmit={(e) => void guardarDatos(e)} className="mt-5 space-y-4">
                    <label className="block text-sm font-medium">Nombre completo
                        <input required maxLength={160} autoComplete="name" value={nombre} onChange={(e) => setNombre(e.target.value)}
                            className="mt-2 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2" />
                    </label>
                    <label className="block text-sm font-medium">Teléfono (opcional)
                        <input type="tel" maxLength={40} autoComplete="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)}
                            className="mt-2 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2" />
                    </label>
                    <button disabled={ocupado} type="submit" className="rounded-md bg-red-700 px-4 py-2 font-semibold text-white disabled:opacity-60">Guardar datos</button>
                </form>
            </section>
            <section className="rounded-lg border border-neutral-200 bg-white p-6">
                <h2 className="text-xl font-semibold">Cambiar contraseña</h2>
                <p className="mt-2 text-sm text-neutral-600">Necesitarás tu contraseña actual. Al guardar, iniciarás sesión de nuevo.</p>
                <form onSubmit={(e) => void guardarClave(e)} className="mt-5 space-y-4">
                    <label className="block text-sm font-medium">Contraseña actual
                        <input type={mostrar ? 'text' : 'password'} required autoComplete="current-password" value={actual}
                            onChange={(e) => setActual(e.target.value)} className="mt-2 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2" />
                    </label>
                    <label className="block text-sm font-medium">Contraseña nueva (mínimo 12 caracteres)
                        <input type={mostrar ? 'text' : 'password'} required minLength={12} maxLength={256} autoComplete="new-password"
                            value={nueva} onChange={(e) => setNueva(e.target.value)} className="mt-2 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2" />
                    </label>
                    <label className="block text-sm font-medium">Confirmar contraseña nueva
                        <input type={mostrar ? 'text' : 'password'} required minLength={12} maxLength={256} autoComplete="new-password"
                            value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} className="mt-2 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2" />
                    </label>
                    <button type="button" onClick={() => setMostrar((valor) => !valor)} className="text-sm font-semibold text-red-700 underline">
                        {mostrar ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}
                    </button>
                    <div><button disabled={ocupado} type="submit" className="rounded-md bg-red-700 px-4 py-2 font-semibold text-white disabled:opacity-60">Cambiar contraseña</button></div>
                </form>
            </section>
        </div>}
    </main>
}
