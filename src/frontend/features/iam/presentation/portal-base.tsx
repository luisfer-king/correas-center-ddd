import { Link } from 'react-router-dom'

export function PortalBase() {
    return <main className="min-h-screen bg-neutral-100 text-neutral-950">
        <header className="border-b border-neutral-200 bg-white px-6 py-5">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
                <span className="font-bold tracking-wide">Correas Center · Portal</span>
                <Link to="/" className="text-sm text-red-700 underline">Volver al inicio</Link>
            </div>
        </header>
        <section className="mx-auto max-w-5xl px-6 py-12" aria-labelledby="portal-titulo">
            <p className="text-sm font-semibold uppercase tracking-widest text-red-700">Fase 2 · Entrega 1 de 8</p>
            <h1 id="portal-titulo" className="mt-3 text-3xl font-semibold">Base del portal IAM</h1>
            <p className="mt-4 max-w-2xl text-neutral-700">La estructura de rutas y el cliente de la API están preparados. El acceso protegido y el formulario de inicio de sesión se incorporarán en la entrega 2.</p>
            <Link to="/portal/acceso" className="mt-7 inline-block rounded-md bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700">Ver estado del acceso</Link>
        </section>
    </main>
}