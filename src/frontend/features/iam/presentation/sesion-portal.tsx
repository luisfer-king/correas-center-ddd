import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { ErrorApi } from '../../../shared/api/cliente-http';
import { iamApi } from '../api/cliente-iam';

type EstadoSesion =
    | { tipo: 'comprobando' }
    | { tipo: 'autenticado'; usuarioId: string }
    | { tipo: 'anonimo' }
    | { tipo: 'error' }

interface ContextoSesion {
    estado: EstadoSesion
    comprobar: () => Promise<void>
    iniciar: (email: string, password: string) => Promise<void>
    cerrar: () => Promise<void>
}

const SesionContexto = createContext<ContextoSesion | null>(null)

export function ProveedorSesion({ children }: { children: ReactNode }) {
    const [estado, setEstado] = useState<EstadoSesion>({ tipo: 'comprobando' })

    const comprobar = useCallback(async (signal?: AbortSignal) => {
        setEstado({ tipo: 'comprobando' })
        try {
            const sesion = await iamApi.comprobarSesion({ signal })
            if (!signal?.aborted) setEstado({ tipo: 'autenticado', usuarioId: sesion.usuarioId })
        } catch (error) {
            if (signal?.aborted) return
            setEstado(error instanceof ErrorApi && error.estado === 401 ? { tipo: 'anonimo' } : { tipo: 'error' })
        }
    }, [])

    useEffect(() => {
        const abortar = new AbortController()
        void comprobar(abortar.signal)
        const caducada = () => setEstado({ tipo: 'anonimo' })
        window.addEventListener('iam:sesion-caducada', caducada)
        return () => {
            abortar.abort()
            window.removeEventListener('iam:sesion-caducada', caducada)
        }
    }, [comprobar])

    useEffect(() => {
        if (estado.tipo !== 'autenticado') return
        const abortar = new AbortController()
        const verificar = () => {
            void iamApi.comprobarSesion({ signal: abortar.signal }).catch((error: unknown) => {
                if (!abortar.signal.aborted && error instanceof ErrorApi && error.estado === 401) setEstado({ tipo: 'anonimo' })
            })
        }
        const intervalo = window.setInterval(verificar, 60_000)
        window.addEventListener('focus', verificar)
        return () => {
            abortar.abort()
            window.clearInterval(intervalo)
            window.removeEventListener('focus', verificar)
        }
    }, [estado.tipo])

    const iniciar = async (email: string, password: string) => {
        await iamApi.iniciarSesion(email, password)
        const sesion = await iamApi.comprobarSesion()
        setEstado({ tipo: 'autenticado', usuarioId: sesion.usuarioId })
    }

    const cerrar = async () => {
        try {
            await iamApi.cerrarSesion()
            setEstado({ tipo: 'anonimo' })
        } catch (error) {
            if (error instanceof ErrorApi && error.estado === 401) {
                setEstado({ tipo: 'anonimo' })
                return
            }
            throw error
        }
    }

    return <SesionContexto.Provider value={{ estado, comprobar: () => comprobar(), iniciar, cerrar }}>
        {children}
    </SesionContexto.Provider>
}

export function usarSesion() {
    const sesion = useContext(SesionContexto)
    if (!sesion) throw new Error('Proveedor de sesión ausente')
    return sesion
}