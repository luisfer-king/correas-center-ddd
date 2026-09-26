import { Link } from 'react-router-dom'

export function PortadaTemporal() {
    return <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6">
        <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-red-700">Correas Center</p>
            <h1 className="text-3xl font-semibold text-neutral-950">Proyecto en preparación</h1>
            <p className="mt-4 text-neutral-700">La estructura inicial está lista. El portal administrativo se desarrolla en la fase 2.</p>
            <Link className="mt-6 inline-block font-semibold text-red-700 underline" to="/portal">Ver la base del portal</Link>
        </div>
    </main>
}