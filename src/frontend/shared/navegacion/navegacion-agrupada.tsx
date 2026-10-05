import { useEffect, useId, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export interface GrupoNavegacion {
    id: string; titulo: string; enlaces: readonly { etiqueta: string; ruta: string }[]
}
const coincide = (ruta: string, actual: string) => actual === ruta || actual.startsWith(`${ruta}/`)

// Disclosure con enlaces normales: Tab recorre botones/enlaces y Escape cierra el panel.
export function NavegacionAgrupada({ grupos }: { grupos: readonly GrupoNavegacion[] }) {
    const [abierto, setAbierto] = useState<string | null>(null)
    const [alinearDerecha, setAlinearDerecha] = useState<string | null>(null)
    const fijo = useRef<string | null>(null)
    const raiz = useRef<HTMLDivElement>(null)
    const botones = useRef(new Map<string, HTMLButtonElement>())
    const prefijo = useId()
    const { pathname } = useLocation()
    function cerrar() { fijo.current = null; setAbierto(null) }
    useEffect(() => { fijo.current = null; setAbierto(null) }, [pathname])
    useEffect(() => {
        function ajustar() {
            const caja = abierto ? botones.current.get(abierto)?.getBoundingClientRect() : null
            setAlinearDerecha(caja && caja.left + 320 > window.innerWidth - 16 ? abierto : null)
        }
        ajustar(); window.addEventListener('resize', ajustar)
        return () => window.removeEventListener('resize', ajustar)
    }, [abierto])
    useEffect(() => {
        function fuera(e: PointerEvent) {
            if (e.target instanceof Node && !raiz.current?.contains(e.target)) cerrar()
        }
        document.addEventListener('pointerdown', fuera)
        return () => document.removeEventListener('pointerdown', fuera)
    }, [])
    return <div ref={raiz} className="flex w-full flex-wrap gap-2 sm:w-auto" onKeyDown={e => {
        if (e.key !== 'Escape' || !abierto) return
        e.preventDefault(); botones.current.get(abierto)?.focus(); cerrar()
    }}>
        {grupos.filter(g => g.enlaces.length).map(grupo => {
            const expandido = abierto === grupo.id
            const activo = grupo.enlaces.some(e => coincide(e.ruta, pathname))
            const panelId = `${prefijo}-${grupo.id}`
            return <div key={grupo.id} className="relative w-full sm:w-auto" onPointerEnter={e => {
                if (e.pointerType === 'mouse' && !fijo.current) setAbierto(grupo.id)
            }} onPointerLeave={e => {
                if (e.pointerType === 'mouse' && !fijo.current && !e.currentTarget.contains(document.activeElement)) setAbierto(actual => actual === grupo.id ? null : actual)
            }} onBlur={e => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                    if (fijo.current === grupo.id) fijo.current = null
                    setAbierto(actual => actual === grupo.id ? null : actual)
                }
            }}>
                <button type="button" ref={nodo => { if (nodo) botones.current.set(grupo.id, nodo); else botones.current.delete(grupo.id) }}
                    aria-expanded={expandido} aria-controls={panelId}
                    onClick={() => {
                        if (fijo.current === grupo.id) cerrar()
                        else { fijo.current = grupo.id; setAbierto(grupo.id) }
                    }} onKeyDown={e => {
                        if (e.key === 'ArrowDown') {
                            e.preventDefault(); fijo.current = grupo.id; setAbierto(grupo.id)
                            requestAnimationFrame(() => { if (fijo.current === grupo.id) document.getElementById(panelId)?.querySelector<HTMLAnchorElement>('a')?.focus() })
                        }
                    }} className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-700 ${activo ? 'bg-red-700 text-white' : expandido ? 'bg-neutral-100 text-neutral-950' : 'text-neutral-700 hover:bg-neutral-100'}`}>
                    {grupo.titulo}<span aria-hidden="true" className={`text-xs transition-transform ${expandido ? 'rotate-180' : ''}`}>▾</span>
                </button>
                <div id={panelId} hidden={!expandido} className={`z-40 w-full pt-2 sm:absolute sm:top-full sm:w-80 sm:max-w-[calc(100vw-2rem)] ${alinearDerecha === grupo.id ? 'sm:right-0' : 'sm:left-0'}`}>
                    <div className="max-h-[min(65vh,28rem)] overflow-y-auto rounded-lg border border-neutral-200 bg-white p-2 shadow-xl">
                        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">{grupo.titulo}</p>
                        <ul className="space-y-1">{grupo.enlaces.map(enlace => <li key={enlace.ruta}>
                            <NavLink to={enlace.ruta} onClick={cerrar} className={() => `block rounded-md px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-700 ${coincide(enlace.ruta, pathname) ? 'bg-red-700 text-white' : 'text-neutral-700 hover:bg-neutral-100'}`}>
                                {enlace.etiqueta}
                            </NavLink>
                        </li>)}</ul>
                    </div>
                </div>
            </div>
        })}
    </div>
}
