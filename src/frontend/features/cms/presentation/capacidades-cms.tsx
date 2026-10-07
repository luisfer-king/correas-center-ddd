import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { capacidadesCmsApi } from '../api/cliente-capacidades'
import type { CapacidadesCms } from '../api/modelos-cms'
import { usarSesion } from '../../iam/presentation/sesion-portal'
export function usarCargaCapacidadesCms() {
 const { estado } = usarSesion(); const usuario = estado.tipo === 'autenticado' ? estado.usuarioId : ''
 const [resultado,setResultado] = useState<{ usuario: string; datos?: CapacidadesCms; error?: string }>({usuario:''}); const [intento,reintentar] = useState(0)
 useEffect(() => { const c = new AbortController(); setResultado({usuario}); if (usuario) void capacidadesCmsApi(c.signal).then(datos => { if (!c.signal.aborted) setResultado({usuario,datos}) }).catch(e => { if (!c.signal.aborted) setResultado({usuario,error: e instanceof Error ? e.message : 'No se pudieron consultar los permisos'}) }); return () => c.abort() },[usuario,intento])
 return { datos: resultado.usuario === usuario ? resultado.datos : undefined, error: resultado.usuario === usuario ? resultado.error : undefined, recargar: () => reintentar(i => i+1) }
}
const Contexto = createContext<CapacidadesCms | null>(null)
export function ProveedorCapacidadesCms({ datos,children }: {datos: CapacidadesCms; children: ReactNode}) { return <Contexto.Provider value={datos}>{children}</Contexto.Provider> }
export function usarCapacidadesCms() { const c = useContext(Contexto); if (!c) throw new Error('Capacidades CMS ausentes'); return c }
