import { createContext, useContext, useState, type ReactNode } from 'react';

type Tema = 'claro' | 'oscuro'
const ContextoTema = createContext<{ tema: Tema; alternar: () => void } | null>(null)

function temaInicial(): Tema {
    try {
        const guardado = window.localStorage.getItem('cc_portal_tema')
        if (guardado === 'claro' || guardado === 'oscuro') return guardado
    } catch { /* almacenamiento deshabilitado */ }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
}

export function TemaPortal({ children }: { children: ReactNode }) {
    const [tema, setTema] = useState<Tema>(temaInicial())
    const alternar = () => setTema((actual) => {
        const nuevo = actual === 'claro' ? 'oscuro' : 'claro'
        try { window.localStorage.setItem('cc_portal_tema', nuevo) } catch { /* preferencia temporal */ }
        return nuevo
    })
    return <ContextoTema.Provider value={{ tema, alternar }}>
        <div className="portal-admin min-h-screen w-full" data-portal-theme={tema}>{children}</div>
    </ContextoTema.Provider>
}

export function usarTemaPortal() {
    const contexto = useContext(ContextoTema)
    if (!contexto) throw new Error('TemaPortal ausente')
    return contexto
}