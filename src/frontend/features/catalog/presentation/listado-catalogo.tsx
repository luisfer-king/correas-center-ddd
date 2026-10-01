import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorApi } from '../../../shared/api/cliente-http'
import { MiniaturaImagen } from '../../../shared/imagenes/miniatura-imagen'
import { ModalPortal } from '../../iam/presentation/modal-portal'
import { catalogoApi } from '../api/cliente-catalogo'
import type { BaseCatalogo, CapacidadesCatalogo } from '../api/tipos-catalogo'
import { presentarValor, valorCampo, type ConfiguracionCatalogo } from './configuracion-catalogo'
import { FormularioCatalogo } from './formulario-catalogo'
import { ModalMarcasProducto } from './modal-marcas-producto'
import { SelectorCatalogo } from './selector-catalogo'
type Consulta<T> = { tipo: 'cargando' } | { tipo: 'listo'; filas: T[] } | { tipo: 'error' | 'sin-permiso'; mensaje: string }
export function ListadoCatalogo<T extends BaseCatalogo>({ config }: { config: ConfiguracionCatalogo<T> }) {
  const { id } = useParams<{ id: string }>()
  const navegar = useNavigate()
  const [productoMarcas, setProductoMarcas] = useState<T | null>(null)
  const [pagina, setPagina] = useState(1)
  const [filtro, setFiltro] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState('todos')
  const [revision, setRevision] = useState(0)
  const [consulta, setConsulta] = useState<Consulta<T>>({ tipo: 'cargando' })
  const [capacidades, setCapacidades] = useState<CapacidadesCatalogo | null>(null)
  const [detalle, setDetalle] = useState<T | null>(null)
  const [errorDetalle, setErrorDetalle] = useState('')
  const [formulario, setFormulario] = useState<T | 'nuevo' | null>(null)
  const [accion, setAccion] = useState<{ registro: T; accion: 'activar' | 'inactivar' | 'eliminar' } | null>(null)
  const [orden, setOrden] = useState<T | null>(null)
  const [nuevoOrden, setNuevoOrden] = useState('0')
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const actualizar = () => setRevision(n => n + 1)
  useEffect(() => {
    if (config.filtro?.obligatorio && !filtro) { setConsulta({ tipo: 'listo', filas: [] }); return }
    const controlador = new AbortController()
    setConsulta({ tipo: 'cargando' })
    void config.listar(pagina, config.filtro && filtro ? { [config.filtro.clave]: filtro } : {}, { signal: controlador.signal })
      .then(filas => { if (!controlador.signal.aborted) setConsulta({ tipo: 'listo', filas }) })
      .catch((fallo: unknown) => {
        if (!controlador.signal.aborted) setConsulta({
          tipo: fallo instanceof ErrorApi && fallo.estado === 403 ? 'sin-permiso' : 'error',
          mensaje: fallo instanceof Error ? fallo.message : 'No se pudo cargar el listado.',
        })
      })
    return () => controlador.abort()
  }, [config, pagina, filtro, revision])
  useEffect(() => {
    const controlador = new AbortController()
    void catalogoApi.capacidades({ signal: controlador.signal }).then(datos => {
      if (!controlador.signal.aborted) setCapacidades(datos)
    }).catch(() => { if (!controlador.signal.aborted) setCapacidades(null) })
    return () => controlador.abort()
  }, [revision])
  useEffect(() => {
    if (!id) { setDetalle(null); setErrorDetalle(''); return }
    const controlador = new AbortController()
    setDetalle(null); setErrorDetalle('')
    void config.obtener(id, { signal: controlador.signal }).then(registro => {
      if (!controlador.signal.aborted) setDetalle(registro)
    }).catch((fallo: unknown) => { if (!controlador.signal.aborted) setErrorDetalle(fallo instanceof Error ? fallo.message : 'Detalle no disponible') })
    return () => controlador.abort()
  }, [config, id, revision])
  const filas = consulta.tipo === 'listo' ? consulta.filas : []
  const texto = busqueda.trim().toLocaleLowerCase('es')
  const visibles = filas.filter(fila => (estado === 'todos' || fila.estado === estado) &&
    (!texto || [fila.id, ...config.columnas.map(c => presentarValor(valorCampo(fila, c.clave)))].some(v => v.toLocaleLowerCase('es').includes(texto))))
  const gestionar = capacidades?.recursos[config.recurso]?.gestionar === true
  const base = `/portal/catalogo/${config.recurso}`
  async function confirmar() {
    if (!accion || ocupado) return
    setOcupado(true); setError('')
    try { await config.cambiar(accion.registro.id, accion.accion); setAccion(null); setMensaje('Estado actualizado.'); actualizar() }
    catch (fallo) { setError(fallo instanceof Error ? fallo.message : 'No se pudo actualizar.') }
    finally { setOcupado(false) }
  }
  async function guardarOrden() {
    if (!orden || !config.reordenar || ocupado) return
    setOcupado(true); setError('')
    try { await config.reordenar(orden.id, Number(nuevoOrden)); setOrden(null); setMensaje('Orden actualizado.'); actualizar() }
    catch (fallo) { setError(fallo instanceof Error ? fallo.message : 'No se pudo reordenar.') }
    finally { setOcupado(false) }
  }
  return <main className="w-full px-6 py-10 sm:px-10">
    <p className="text-sm font-semibold uppercase tracking-widest text-red-700">Catálogo</p>
    <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-3xl font-semibold">{config.titulo}</h1><p className="mt-2 text-neutral-600">{config.descripcion}</p></div>
      <div className="flex gap-2">{gestionar && <button type="button" onClick={() => setFormulario('nuevo')} className="rounded bg-red-700 px-4 py-2 text-white">Crear registro</button>}
        <button type="button" onClick={actualizar} className="rounded border bg-white px-4 py-2">Actualizar</button></div>
    </div>
    {mensaje && <p role="status" className="mt-4 rounded bg-green-50 p-3 text-green-800">{mensaje}</p>}
    {error && <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-red-800">{error}</p>}
    {errorDetalle && <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-red-800">{errorDetalle}</p>}
    <div className="mt-6 flex flex-wrap gap-3 rounded-lg border bg-white p-4">
      {config.filtro && <label className="min-w-64"><span className="mb-1 block text-sm">{config.filtro.etiqueta}</span>
        <SelectorCatalogo referencia={config.filtro.referencia} valor={filtro} actualizar={id => { setFiltro(id); setPagina(1) }} />
      </label>}
      <label><span className="mb-1 block text-sm">Buscar en esta página</span><input type="search" value={busqueda}
        onChange={e => setBusqueda(e.target.value)} className="rounded border p-2" /></label>
      <label><span className="mb-1 block text-sm">Estado</span><select value={estado} onChange={e => setEstado(e.target.value)} className="rounded border bg-white p-2">
        <option value="todos">Todos</option><option value="activo">Activo</option><option value="inactivo">Inactivo</option>
        {capacidades?.verEliminados && <option value="eliminado">Eliminado</option>}
      </select></label>
    </div>
    {config.filtro?.obligatorio && !filtro && <p className="mt-5">Selecciona {config.filtro.etiqueta.toLowerCase()} para ver sus asignaciones.</p>}
    {consulta.tipo === 'cargando' && <p role="status" className="mt-5">Cargando…</p>}
    {(consulta.tipo === 'error' || consulta.tipo === 'sin-permiso') && <p role="alert" className="mt-5">{consulta.mensaje}</p>}
    {consulta.tipo === 'listo' && (!config.filtro?.obligatorio || filtro) && <>
      <p role="status" className="mt-4 text-sm">{visibles.length} de {filas.length} registros en esta página</p>
      {visibles.length === 0 ? <p className="mt-5">No hay registros para mostrar.</p> :
        <div className="mt-4 overflow-x-auto rounded-lg border bg-white"><table className="w-full min-w-[750px] text-left text-sm">
          <caption className="sr-only">{config.titulo}</caption><thead className="bg-neutral-100"><tr><th className="p-3">ID</th>
            {config.columnas.map(c => <th scope="col" key={c.clave} className="p-3">{c.etiqueta}</th>)}<th className="p-3">Estado</th><th className="p-3">Acciones</th></tr></thead>
          <tbody>{visibles.map(fila => <tr key={fila.id} className="border-t"><th scope="row" className="p-3 font-normal">{fila.id}</th>
            {config.columnas.map(c => <td key={c.clave} className="max-w-72 truncate p-3" title={presentarValor(valorCampo(fila, c.clave))}>{['imagen', 'logo'].includes(c.clave) ? <MiniaturaImagen url={valorCampo(fila, c.clave)} nombre={String(valorCampo(fila, 'nombre') ?? 'Imagen')} /> : presentarValor(valorCampo(fila, c.clave))}</td>)}
            <td className="p-3 capitalize">{fila.estado}</td><td className="p-3"><div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => navegar(`${base}/${fila.id}`)} className="rounded border px-2 py-1">Detalle</button>
              {config.recurso === 'productos' &&
                <button type="button" disabled={fila.estado !== 'activo'}
                  aria-label={`Asignar marcas a ${String(valorCampo(fila, 'nombre') ?? fila.id)}`}
                  title={fila.estado === 'activo' ? 'Ver y asignar marcas del producto' : 'Activa el producto para gestionar sus marcas'}
                  onClick={() => setProductoMarcas(fila)} className="rounded border border-red-300 px-2 py-1 font-medium text-red-700 disabled:opacity-50">Asignar marcas</button>}
              {gestionar && fila.estado !== 'eliminado' && <>
                <button type="button" onClick={() => setFormulario(fila)} className="rounded border px-2 py-1">Editar</button>
                {config.reordenar && <button type="button" onClick={() => { setNuevoOrden(String(valorCampo(fila, 'orden') ?? 0)); setOrden(fila) }} className="rounded border px-2 py-1">Orden</button>}
                {(fila.estado === 'activo' ? ['inactivar', 'eliminar'] : ['activar', 'eliminar']).map(valor =>
                  <button key={valor} type="button" onClick={() => setAccion({ registro: fila, accion: valor as 'activar' | 'inactivar' | 'eliminar' })}
                    className="rounded border border-red-300 px-2 py-1 text-red-700">{valor}</button>)}
              </>}
            </div></td></tr>)}</tbody></table></div>}
      <div className="mt-5 flex items-center gap-3"><button type="button" disabled={pagina === 1} onClick={() => setPagina(p => p - 1)} className="rounded border px-3 py-2 disabled:opacity-50">Anterior</button>
        <span>Página {pagina}</span><button type="button" disabled={filas.length < 100 || pagina >= 10000} onClick={() => setPagina(p => p + 1)} className="rounded border px-3 py-2 disabled:opacity-50">Siguiente</button></div>
    </>}
    {id && detalle && <ModalPortal titulo={`Detalle · ${config.titulo}`} cerrar={() => navegar(base, { replace: true })}>
      <dl className="grid gap-3 sm:grid-cols-2">{Object.entries(detalle).map(([clave, valor]) => <div key={clave}><dt className="text-xs uppercase text-neutral-500">{clave}</dt>
        <dd className="break-words whitespace-pre-wrap">{['imagen', 'logo'].includes(clave) ? <MiniaturaImagen url={valor} grande /> : presentarValor(valor)}</dd></div>)}</dl>
    </ModalPortal>}
    {productoMarcas && <ModalMarcasProducto key={productoMarcas.id} puedeGestionar={capacidades?.recursos['asignaciones-marca']?.gestionar === true} permisosComprobados={capacidades !== null} productoId={productoMarcas.id} nombre={String(valorCampo(productoMarcas, 'nombre') ?? '')}
      cerrar={() => setProductoMarcas(null)} guardado={() => { setProductoMarcas(null); setMensaje('Marcas actualizadas.'); actualizar() }} />}
    {formulario && <FormularioCatalogo key={formulario === 'nuevo' ? 'nuevo' : formulario.id} config={config}
      registro={formulario === 'nuevo' ? null : formulario} cerrar={() => setFormulario(null)} guardado={() => { setFormulario(null); actualizar() }} />}
    {accion && <ModalPortal titulo="Confirmar cambio de estado" cerrar={() => setAccion(null)} bloqueado={ocupado}>
      <p>¿Confirmas «{accion.accion}» para el registro #{accion.registro.id}?</p>{accion.accion === 'eliminar' && <p className="mt-2 text-red-700">Se realizará una baja lógica.</p>}
      {error && <p role="alert" className="mt-2 text-red-700">{error}</p>}
      <div className="mt-5 flex justify-end gap-3"><button type="button" onClick={() => setAccion(null)} className="rounded border px-4 py-2">Cancelar</button>
        <button type="button" disabled={ocupado} onClick={() => void confirmar()} className="rounded bg-red-700 px-4 py-2 text-white">Confirmar</button></div>
    </ModalPortal>}
    {orden && <ModalPortal titulo="Cambiar orden" cerrar={() => setOrden(null)} bloqueado={ocupado}>
      <form onSubmit={e => { e.preventDefault(); void guardarOrden() }}><label>Orden <input type="number" min="0" step="1" required value={nuevoOrden}
        onChange={e => setNuevoOrden(e.target.value)} className="ml-2 rounded border p-2" /></label>
        {error && <p role="alert" className="mt-2 text-red-700">{error}</p>}
        <button type="submit" disabled={ocupado} className="mt-4 rounded bg-red-700 px-4 py-2 text-white">Guardar</button></form>
    </ModalPortal>}
  </main>
}
