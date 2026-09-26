import { Link } from 'react-router-dom'

export function AccesoTemporal() {
    return <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
        <p className="font-semibold text-red-700">Correas Center · Portal</p>
        <h1 className="mt-3 text-3xl font-semibold">Acceso en preparación</h1>
        <p className="mt-4 text-neutral-700">El formulario y la protección de sesión se implementarán en la entrega 2.</p>
        <Link className="mt-6 font-semibold text-red-700 underline" to="/portal">Volver al portal</Link>
    </main>
}