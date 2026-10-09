import { lazy, Suspense } from 'react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
const componentes = new Map<string, ReturnType<typeof lazy>>()
export function IconoPublico({ nombre }: { nombre: string | null }) {
 const clave = (nombre ?? '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase().replace(/^lucide-/, '')
 if (!Object.hasOwn(dynamicIconImports, clave)) return null
 let Componente = componentes.get(clave)
 if (!Componente) { Componente = lazy(dynamicIconImports[clave as keyof typeof dynamicIconImports]); componentes.set(clave, Componente) }
 return <Suspense fallback={<span className="publico-icono" />}><Componente size={20} aria-hidden="true" /></Suspense>
}
