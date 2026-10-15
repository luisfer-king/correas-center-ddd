import { useEffect, useState } from 'react'
import { ModalPortal } from '../../iam/presentation/modal-portal'
import { productosApi } from '../api/productos'
import { categoriasApi } from '../api/categorias'
import { serviciosApi } from '../api/servicios'
import { asignaciones_industriaApi as asignacionesApi } from '../api/asignaciones-industria'
import type { ProductoCatalogo, CategoriaCatalogo, ServicioCatalogo, AsignacionIndustriaCatalogo } from '../api/tipos-catalogo'
import { invalidarCachePublica } from '../../publico/api/cache-publica'

async function todas<T>(leer: (pagina: number) => Promise<T[]>, signal: AbortSignal) {
 const filas: T[] = []
 for (let pagina = 1; pagina <= 10000; pagina++) {
  signal.throwIfAborted()
  const lote = await leer(pagina)
  signal.throwIfAborted()
  filas.push(...lote)
  if (lote.length < 100) return filas
 }
 throw new Error('Se superó el límite de registros. Reduce la selección.')
}
export function ModalSolucionesIndustria({ industriaId, empresaId, nombre, puedeGestionar, cerrar }: {
 industriaId: string; empresaId: string; nombre: string; puedeGestionar: boolean; cerrar: () => void
}) {
 const [productos, setProductos] = useState<ProductoCatalogo[]>([])
 const [categorias, setCategorias] = useState<CategoriaCatalogo[]>([])
 const [servicios, setServicios] = useState<ServicioCatalogo[]>([])
 const [asignaciones, setAsignaciones] = useState<AsignacionIndustriaCatalogo[]>([])
 const [tipo, setTipo] = useState<'categoria' | 'servicio'>('categoria')
 const [productoId, setProductoId] = useState(''), [destinoId, setDestinoId] = useState('')
 const [orden, setOrden] = useState(0), [ordenes, setOrdenes] = useState<Record<string, number>>({})
 const [revision, setRevision] = useState(0), [cargando, setCargando] = useState(true)
 const [errorCarga, setErrorCarga] = useState(false)
 const [ocupado, setOcupado] = useState(false), [error, setError] = useState(''), [mensaje, setMensaje] = useState('')
 useEffect(() => {
  const control = new AbortController(), { signal } = control
  setCargando(true); setError(''); setErrorCarga(false)
  void Promise.all([
   todas(p => productosApi.listar(p, { empresaId }, { signal }), signal),
   todas(p => categoriasApi.listar(p, {}, { signal }), signal),
   todas(p => serviciosApi.listar(p, { empresaId }, { signal }), signal),
   todas(p => asignacionesApi.listar(p, { industriaId }, { signal }), signal),
  ]).then(([ps, cs, ss, relaciones]) => {
   if (signal.aborted) return
   const propios = ps.filter(p => p.empresaId === empresaId)
   setProductos(propios)
   setCategorias(cs.filter(c => propios.some(p => p.id === c.productoId)))
   setServicios(ss.filter(s => s.empresaId === empresaId))
   setAsignaciones(relaciones)
   setOrdenes(Object.fromEntries(relaciones.map(a => [a.id, a.orden])))
  }).catch(e => { if (!signal.aborted) { setErrorCarga(true); setError(e instanceof Error ? e.message : 'No se pudieron cargar las asignaciones.') } })
   .finally(() => { if (!signal.aborted) setCargando(false) })
  return () => control.abort()
 }, [industriaId, empresaId, revision])
 const bloqueado = ocupado || cargando || errorCarga || !puedeGestionar
 const opciones = tipo === 'servicio' ? servicios.filter(s => s.estado === 'activo') : categorias.filter(c => c.productoId === productoId && c.estado === 'activo' && productos.some(p => p.id === c.productoId && p.estado === 'activo'))
 const existente = asignaciones.find(a => a.destino.tipo === tipo && a.destino.id === destinoId)
 async function ejecutar(accion: () => Promise<unknown>, texto: string) {
  if (bloqueado) return
  setOcupado(true); setError(''); setMensaje('')
  try { await accion(); invalidarCachePublica(); setMensaje(texto); setDestinoId(''); setRevision(r => r + 1) }
  catch (e) { setError(e instanceof Error ? e.message : 'No se pudo guardar.'); }
  finally { setOcupado(false) }
 }
 function etiqueta(a: AsignacionIndustriaCatalogo) {
  if (a.destino.tipo === 'servicio') return servicios.find(s => s.id === a.destino.id)?.nombre || `Servicio no disponible #${a.destino.id}`
  const c = categorias.find(c => c.id === a.destino.id)
  return c ? `${productos.find(p => p.id === c.productoId)?.nombre ?? 'Producto'} · ${c.nombre}` : `Categoría no disponible #${a.destino.id}`
 }
 return <ModalPortal titulo={`Productos y servicios · ${nombre}`} cerrar={cerrar} bloqueado={ocupado}>
  <p>Selecciona un producto y su categoría, o un servicio. Cada cambio se guarda al confirmar la acción.</p>
  {!puedeGestionar && <p className="mt-3 text-amber-700">Solo consulta. Necesitas permiso de gestión de asignaciones de industrias para modificar las relaciones.</p>}
  {cargando ? <p role="status">Cargando productos, categorías y servicios…</p> : <>
   <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={e => {
    e.preventDefault()
    if (!destinoId || !opciones.some(o => o.id === destinoId) || existente?.estado === 'activo' || existente?.estado === 'eliminado') return
    void ejecutar(() => existente ? asignacionesApi.cambiar(existente.id, 'activar') : asignacionesApi.crear({ industriaId, destino: { tipo, id: destinoId }, orden }), 'Asignación guardada.')
   }}>
    <label>Tipo<select className="block w-full rounded border bg-white p-2" value={tipo} disabled={bloqueado} onChange={e => { setTipo(e.target.value as typeof tipo); setDestinoId('') }}><option value="categoria">Categoría de producto</option><option value="servicio">Servicio</option></select></label>
    {tipo === 'categoria' && <label>Producto<select className="block w-full rounded border bg-white p-2" value={productoId} disabled={bloqueado} required onChange={e => { setProductoId(e.target.value); setDestinoId('') }}><option value="">Seleccionar producto…</option>{productos.filter(p => p.estado === 'activo').map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select></label>}
    <label>{tipo === 'categoria' ? 'Categoría' : 'Servicio'}<select className="block w-full rounded border bg-white p-2" value={destinoId} disabled={bloqueado || (tipo === 'categoria' && !productoId)} required onChange={e => setDestinoId(e.target.value)}><option value="">Seleccionar…</option>{opciones.map(o => <option key={o.id} value={o.id}>{o.nombre}</option>)}</select></label>
    <label>Orden<input className="block w-full rounded border p-2" type="number" min={0} max={2147483647} step={1} required value={orden} disabled={bloqueado || !!existente} onChange={e => setOrden(Number(e.target.value))}/></label>
    <button type="submit" disabled={bloqueado || !destinoId || existente?.estado === 'activo' || existente?.estado === 'eliminado'} className="rounded bg-red-700 px-4 py-2 text-white disabled:opacity-50">{existente?.estado === 'inactivo' ? 'Reactivar asignación' : 'Asignar'}</button>
    {existente?.estado === 'activo' && <p>Ya está asignado a esta industria.</p>}
    {existente?.estado === 'eliminado' && <p>Esta relación tiene una baja definitiva. No se puede reactivar desde este formulario.</p>}
   </form>
   <h3 className="mt-6 font-semibold">Asignaciones actuales</h3>
   <div className="mt-3 max-h-80 overflow-auto"><table className="w-full text-left text-sm"><thead><tr><th>Producto / servicio</th><th>Estado</th><th>Orden</th><th>Acciones</th></tr></thead><tbody>{asignaciones.filter(a => a.estado !== 'eliminado').map(a => <tr key={a.id} className="border-t"><td className="p-2">{etiqueta(a)}</td><td className="p-2">{a.estado}</td><td className="p-2"><input aria-label={`Orden de ${etiqueta(a)}`} className="w-20 rounded border p-1" type="number" min={0} max={2147483647} step={1} value={ordenes[a.id] ?? a.orden} disabled={bloqueado} onChange={e => setOrdenes(o => ({ ...o, [a.id]: Number(e.target.value) }))}/></td><td className="p-2"><div className="flex gap-2"><button type="button" disabled={bloqueado || !Number.isInteger(ordenes[a.id]) || ordenes[a.id] < 0 || ordenes[a.id] > 2147483647 || ordenes[a.id] === a.orden} className="rounded border px-2 py-1 disabled:opacity-50" onClick={() => void ejecutar(() => asignacionesApi.editar(a.id, { orden: ordenes[a.id] }), 'Orden guardado.')}>Guardar orden</button><button type="button" disabled={bloqueado} className="rounded border px-2 py-1 disabled:opacity-50" onClick={() => void ejecutar(() => asignacionesApi.cambiar(a.id, a.estado === 'activo' ? 'inactivar' : 'activar'), a.estado === 'activo' ? 'Asignación retirada.' : 'Asignación reactivada.')}>{a.estado === 'activo' ? 'Retirar' : 'Reactivar'}</button></div></td></tr>)}</tbody></table></div>
   {!asignaciones.some(a => a.estado !== 'eliminado') && <p className="mt-3">Esta industria todavía no tiene asignaciones.</p>}
  </>}
  {mensaje && <p role="status" className="mt-3 text-green-700">{mensaje}</p>}
  {error && <p role="alert" className="mt-3 text-red-700">{error}</p>}
  <div className="mt-5 flex justify-end gap-3"><button type="button" disabled={ocupado || cargando} onClick={() => setRevision(r => r + 1)} className="rounded border px-4 py-2">Actualizar</button><button type="button" disabled={ocupado} onClick={cerrar} className="rounded border px-4 py-2">Cerrar</button></div>
 </ModalPortal>
}
