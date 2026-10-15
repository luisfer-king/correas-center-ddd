import { MapPin, Phone, Clock } from 'lucide-react'
import { sucursalesPublicas } from '../api/cliente-contenido-publico'
import { useRecursoPublico } from './use-recurso-publico'
import type { SucursalPublica } from '../../../../shared/publico/comun'
export function SucursalesFooter({inicial}:{inicial?:SucursalPublica[]}) {
 const {datos,cargando,error,elemento,reintentar}=useRecursoPublico(sucursalesPublicas,inicial||[])
 const filas=inicial||datos
 return <div ref={elemento as React.RefObject<HTMLDivElement>}>
  {!filas.length&&cargando&&<p role="status">Cargando sucursales…</p>}{error&&!filas.length&&<button onClick={reintentar}>Volver a consultar sucursales</button>}
  {filas.map(s=><div className="publico-sucursal-footer" key={s.id}><h3>{s.nombre}</h3><p><MapPin size={12} aria-hidden="true" /><span>{s.direccion}</span></p><p><Phone size={12} aria-hidden="true" /><a href={'tel:'+s.telefono.replace(/[^+0-9]/g,'')}><span>{s.telefono}</span></a></p>{s.horarios&&<p><Clock size={12} aria-hidden="true" /><span>{s.horarios}</span></p>}</div>)}
 </div>
}
