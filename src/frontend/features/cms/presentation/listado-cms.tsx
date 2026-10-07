import { SubenlacesMenu } from './subenlaces-menu'
import { FormularioMenu } from './formulario-menu'
import { FormularioContenidoSeccion } from './formulario-contenido-seccion'
import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { ConsultaCms, RegistroBaseCms, RecursoCms, VersionCms } from '../api/modelos-cms'
import type { CampoCms, DatosFormularioCms } from './campos-cms'
import { leerCampoCms } from './campos-cms'
import { FormularioCms } from './formulario-cms'
import { usarCapacidadesCms } from './capacidades-cms'
import { ModalPortal } from '../../iam/presentation/modal-portal'
import { MetadataSeccion } from './metadata-seccion'
type RegistroVista = RegistroBaseCms & Record<string,unknown>
export type ConfiguracionVistaCms = {
 recurso: RecursoCms; ruta: string; titulo: string; crear: CampoCms[]; editar: CampoCms[]; filtros: string[];
 api: { listar: (consulta?: ConsultaCms, signal?: AbortSignal) => Promise<RegistroVista[]>; obtener: (id: string | number, signal?: AbortSignal) => Promise<RegistroVista>;
 crear: (datos: DatosFormularioCms) => Promise<RegistroVista>; editar: (id: string | number, version: VersionCms, datos: DatosFormularioCms) => Promise<RegistroVista>;
 accion: (id: string | number, version: VersionCms, accion: string, datos?: object) => Promise<RegistroVista> }
}
type Dialogo = { tipo: 'crear' } | { tipo: 'editar' | 'detalle' | 'metadata' | 'subenlaces'; fila: RegistroVista } | { tipo: 'accion'; fila: RegistroVista; accion: string; titulo: string; campos: CampoCms[]; datos: DatosFormularioCms }
const etiqueta = (r: RegistroVista) => String(r.nombre ?? r.grupo ?? r.titulo ?? r.clave ?? r.identificador ?? (r.campos as DatosFormularioCms | undefined)?.titulo ?? r.ruta ?? `Registro #${r.id}`)
function mensajeError(e: unknown) { return e instanceof Error && /versión|conflicto/i.test(e.message) ? `${e.message}. Cierra el formulario y vuelve a cargar el registro antes de intentarlo de nuevo.` : e instanceof Error ? e.message : 'No se pudo completar la operación' }
export function ListadoCms({ configuracion: c }: { configuracion: ConfiguracionVistaCms }) {
 const capacidades = usarCapacidadesCms(); const permisos = capacidades.recursos[c.recurso]; const config = c.ruta === 'configuracion-sitio'
 const [params,setParams] = useSearchParams(); const [pagina,setPagina] = useState(0); const [estado,setEstado] = useState(''); const [eliminados,setEliminados] = useState(false)
 const [busqueda,setBusqueda] = useState(''); const [filas,setFilas] = useState<RegistroVista[]>([]); const [cargando,setCargando] = useState(true); const [error,setError] = useState(''); const [aviso,setAviso] = useState(''); const [revision,setRevision] = useState(0)
 const [dialogo,setDialogo] = useState<Dialogo>(); const [ocupado,setOcupado] = useState(false); const bloqueo = useRef(false); const vivo = useRef(true); const peticionDetalle = useRef<AbortController | null>(null)
 useEffect(() => { vivo.current = true; return () => { vivo.current = false; peticionDetalle.current?.abort() } },[])
 const filtros = c.filtros.map(k => `${k}=${params.get(k) ?? ''}`).join('&')
 useEffect(() => {
  const abortar = new AbortController(); setError(''); setFilas([]); setCargando(true)
  if (!permisos.leer) { setCargando(false); return () => abortar.abort() }
  const consulta: ConsultaCms = { limite: 25, desplazamiento: pagina*25 }
  for (const k of c.filtros) { const valor = params.get(k); if (valor) (consulta as Record<string,unknown>)[k] = valor }
  if (config && estado) consulta.activo = estado === 'sin-definir' ? 'sin-definir' : estado === 'activo'
  if (!config) { if (estado) consulta.estado = estado; if (capacidades.verEliminados && (eliminados || estado === 'eliminado')) consulta.incluirEliminados = true }
  void c.api.listar(consulta,abortar.signal).then(datos => { if (!abortar.signal.aborted) setFilas(datos) }).catch(e => { if (!abortar.signal.aborted) setError(mensajeError(e)) }).finally(() => { if (!abortar.signal.aborted) setCargando(false) })
  return () => abortar.abort()
 // params is represented by filtros; API/configurations are module constants.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[c,pagina,estado,eliminados,revision,filtros,permisos.leer,capacidades.verEliminados])
 async function abrir(fila: RegistroVista, tipo: 'editar' | 'detalle' | 'metadata' | 'subenlaces', accion?: string) {
  if (bloqueo.current) return; bloqueo.current = true; setOcupado(true); setError(''); peticionDetalle.current?.abort(); const abortar = new AbortController(); peticionDetalle.current = abortar
  try { const actual = await c.api.obtener(fila.id,abortar.signal); if (abortar.signal.aborted) return
   if (!accion) setDialogo({tipo,fila:actual})
   else {
    const titulos: Record<string,string> = { activar:'Activar',inactivar:'Inactivar',eliminar:'Eliminar',visibilidad:actual.mostrar ? 'Ocultar' : 'Mostrar',actividad:actual.activo ? 'Desactivar' : 'Activar',reordenar:'Cambiar orden',claves:'Cambiar claves' }
    const campos: CampoCms[] = accion === 'reordenar' ? [{clave:'orden',etiqueta:'Orden',tipo:'numero'}] : accion === 'claves' ? [{clave:'claves',etiqueta:'Claves permitidas',tipo:'claves',ayuda:'Claves separadas por comas. Los contenidos existentes deben seguir siendo válidos.'}] : []
    setDialogo({tipo:'accion',fila:actual,accion,titulo:titulos[accion] ?? accion,campos,datos:accion === 'reordenar' ? {orden:actual.orden} : accion === 'claves' ? {claves:actual.camposMetadata} : {}})
   }
  } catch(e) { if (!abortar.signal.aborted && vivo.current) setError(mensajeError(e)) } finally { if (vivo.current) setOcupado(false); bloqueo.current = false }
 }
 async function guardar(datos: DatosFormularioCms) {
  if (!dialogo || bloqueo.current) return; bloqueo.current = true; setOcupado(true)
  try {
   if (dialogo.tipo === 'crear') await c.api.crear(datos)
   else if (dialogo.tipo === 'editar') await c.api.editar(dialogo.fila.id,dialogo.fila.actualizadoEn,datos)
   else if (dialogo.tipo === 'accion') {
    const cuerpo = dialogo.accion === 'visibilidad' ? {mostrar:!dialogo.fila.mostrar} : dialogo.accion === 'actividad' ? {activo:!dialogo.fila.activo} : datos
    await c.api.accion(dialogo.fila.id,dialogo.fila.actualizadoEn,dialogo.accion,cuerpo)
   }
   if (vivo.current) { setDialogo(undefined); setAviso('Cambios guardados.'); setRevision(i=>i+1) }
  } catch(e) { throw new Error(mensajeError(e)) } finally { bloqueo.current = false; if (vivo.current) setOcupado(false) }
 }
 if (!permisos.leer) return <section className="cms-panel"><h1>{c.titulo}</h1><p role="alert">No tienes permiso para consultar este recurso.</p></section>
 const visibles = filas.filter(f => etiqueta(f).toLocaleLowerCase().includes(busqueda.toLocaleLowerCase()) || String(f.id).includes(busqueda))
 return <section className="cms-panel"><div className="cms-heading"><div><p className="cms-eyebrow">Administración de contenido</p><h1>{c.titulo}</h1><p>Consulta y administra los elementos del sitio.</p></div>{permisos.gestionar && <button className="cms-primary" disabled={ocupado} onClick={() => {setAviso('');setDialogo({tipo:'crear'})}}>Crear nuevo</button>}</div>
 <div className="cms-filters"><label>Buscar en esta página<input type="search" value={busqueda} onChange={e=>setBusqueda(e.target.value)} placeholder="Nombre o ID" /></label><label>{config ? 'Actividad' : 'Estado'}<select value={estado} onChange={e=>{setPagina(0);setEstado(e.target.value)}}><option value="">Todos</option><option value="activo">Activo</option><option value="inactivo">Inactivo</option>{config ? <option value="sin-definir">Sin definir</option> : capacidades.verEliminados && <option value="eliminado">Eliminado</option>}</select></label>
 {c.filtros.map(k=><label key={k}>{c.crear.find(f=>f.clave===k)?.etiqueta ?? k}<input value={params.get(k) ?? ''} placeholder={config && k==='empresaId' ? 'ID o global' : ''} onChange={e=>{setPagina(0);const p=new URLSearchParams(params); if(e.target.value)p.set(k,e.target.value);else p.delete(k);setParams(p,{replace:true})}} /></label>)}
 {!config && capacidades.verEliminados && <label className="cms-check"><input type="checkbox" checked={eliminados} onChange={e=>{setPagina(0);setEliminados(e.target.checked);if(!e.target.checked && estado==='eliminado')setEstado('')}} />Incluir eliminados</label>}<button disabled={cargando||ocupado} onClick={()=>setRevision(i=>i+1)}>Actualizar</button></div>
 {error && <p role="alert" className="cms-error">{error}</p>}{aviso && <p role="status" className="cms-success">{aviso}</p>}
 {cargando ? <p role="status" className="cms-empty">Cargando registros…</p> : <><div className="cms-table-wrap"><table><caption className="cms-sr">{c.titulo}, página {pagina+1}</caption><thead><tr><th>Elemento</th><th>{config ? 'Actividad' : 'Estado'}</th>{!config && <th>Orden</th>}<th>Actualizado</th><th>Acciones</th></tr></thead><tbody>{visibles.map(fila=><tr key={fila.id}><td><strong>{etiqueta(fila)}</strong><small>#{fila.id}{fila.empresaId ? ` · Empresa ${String(fila.empresaId)}` : ''}</small></td><td><span className={`cms-badge ${fila.estado ?? (fila.activo ? 'activo' : 'inactivo')}`}>{fila.estado ?? (fila.activo===null?'Sin definir':fila.activo?'Activo':'Inactivo')}</span>{typeof fila.mostrar==='boolean' && <small>{fila.mostrar?'Visible':'Oculto'}</small>}</td>{!config && <td>{fila.orden}</td>}<td>{fila.actualizadoEn ? new Date(fila.actualizadoEn).toLocaleString('es') : 'Sin fecha'}</td><td><div className="cms-row-actions">
 <button disabled={ocupado} onClick={()=>void abrir(fila,'detalle')}>Ver</button>
 {fila.estado!=='eliminado' && permisos.gestionar && <><button disabled={ocupado} onClick={()=>void abrir(fila,'editar')}>Editar</button>{config ? <button disabled={ocupado} onClick={()=>void abrir(fila,'detalle','actividad')}>{fila.activo?'Desactivar':'Activar'}</button> : <><button disabled={ocupado} onClick={()=>void abrir(fila,'detalle',fila.estado==='activo'?'inactivar':'activar')}>{fila.estado==='activo'?'Inactivar':'Activar'}</button>{c.ruta !== 'menus' && <button disabled={ocupado} onClick={()=>void abrir(fila,'detalle','reordenar')}>Orden</button>}{typeof fila.mostrar==='boolean' && <button disabled={ocupado} onClick={()=>void abrir(fila,'detalle','visibilidad')}>{fila.mostrar?'Ocultar':'Mostrar'}</button>}{c.ruta==='tipos-seccion' && <button disabled={ocupado} onClick={()=>void abrir(fila,'detalle','claves')}>Claves</button>}<button className="cms-danger" disabled={ocupado} onClick={()=>void abrir(fila,'detalle','eliminar')}>Eliminar</button></>}</>}
 {c.ruta==='menus' && capacidades.recursos.items_menu.leer && <button disabled={ocupado} onClick={()=>void abrir(fila,'subenlaces')}>Subenlaces</button>}{c.ruta==='registros-cms' && capacidades.recursos.contenidos_registro.leer && <Link to={`/portal/cms/contenidos-registro?registroId=${fila.id}`}>Contenidos</Link>}{c.ruta==='tipos-seccion' && capacidades.recursos.contenidos_seccion.leer && <Link to={`/portal/cms/contenidos-seccion?tipoSeccionId=${fila.id}`}>Secciones</Link>}{c.ruta==='contenidos-seccion' && capacidades.recursos.metadata_seccion.leer && <button disabled={ocupado} onClick={()=>void abrir(fila,'metadata')}>Metadata</button>}
 </div></td></tr>)}</tbody></table>{!visibles.length && <p className="cms-empty">{error?'No se pudo cargar el listado.':'No hay registros para estos filtros.'}</p>}</div><div className="cms-pagination"><span>Página {pagina+1} · {filas.length} registros</span><button disabled={!pagina||ocupado} onClick={()=>setPagina(p=>p-1)}>Anterior</button><button disabled={filas.length<25||ocupado} onClick={()=>setPagina(p=>p+1)}>Siguiente</button></div></>}
 {dialogo?.tipo==='metadata' && <MetadataSeccion id={String(dialogo.fila.id)} gestionar={capacidades.recursos.metadata_seccion.gestionar && dialogo.fila.estado!=='eliminado'} cerrar={()=>setDialogo(undefined)} actualizado={()=>setRevision(i=>i+1)} />}
 {dialogo?.tipo==='subenlaces' && <SubenlacesMenu menuId={String(dialogo.fila.id)} rutaPadre={String(dialogo.fila.ruta)} cargarSubmenu={dialogo.fila.cargarSubmenu == null ? null : String(dialogo.fila.cargarSubmenu)} gestionar={capacidades.recursos.items_menu.gestionar && dialogo.fila.estado==='activo'} verEliminados={capacidades.verEliminados} cerrar={()=>setDialogo(undefined)} />}
 {dialogo && dialogo.tipo!=='subenlaces' && dialogo.tipo!=='metadata' && <ModalPortal titulo={dialogo.tipo==='crear'?'Crear nuevo':dialogo.tipo==='editar'?`Editar ${etiqueta(dialogo.fila)}`:dialogo.tipo==='accion'?`${dialogo.titulo} · ${etiqueta(dialogo.fila)}`:etiqueta(dialogo.fila)} cerrar={()=>setDialogo(undefined)} bloqueado={ocupado}><div className="cms-dialog">
 {dialogo.tipo==='detalle' ? <dl className="cms-detail">{c.crear.map(campo=><div key={campo.clave}><dt>{campo.etiqueta}</dt><dd>{(()=>{const v=leerCampoCms(dialogo.fila,campo.clave);return v===null||v===undefined?'Sin definir':typeof v==='object'?<pre>{JSON.stringify(v,null,2)}</pre>:typeof v==='boolean'?v?'Sí':'No':String(v)})()}</dd></div>)}</dl> : <>{dialogo.tipo==='accion' && <p>{dialogo.accion==='eliminar'?'Se marcará como eliminado. Sus dependencias deben permitir esta operación.':'Confirma la operación para este registro.'}</p>}{c.ruta === 'contenidos-seccion' && (dialogo.tipo === 'crear' || dialogo.tipo === 'editar') ? <FormularioContenidoSeccion editar={dialogo.tipo === 'editar'} datos={dialogo.tipo === 'editar' ? dialogo.fila : Object.fromEntries(c.filtros.map(k => [k, params.get(k) ?? undefined]))} guardar={guardar} ocupado={ocupado} cancelar={() => setDialogo(undefined)} /> : c.ruta === 'menus' && (dialogo.tipo === 'crear' || dialogo.tipo === 'editar') ? <FormularioMenu editar={dialogo.tipo === 'editar'} datos={dialogo.tipo === 'editar' ? dialogo.fila : Object.fromEntries(c.filtros.map(k => [k, params.get(k) ?? undefined]))} guardar={guardar} ocupado={ocupado} cancelar={() => setDialogo(undefined)} /> : <FormularioCms campos={dialogo.tipo==='crear'?c.crear:dialogo.tipo==='editar'?c.editar:dialogo.tipo==='accion'?dialogo.campos:[]} datos={dialogo.tipo==='crear'?Object.fromEntries(c.filtros.map(k=>[k,params.get(k)??undefined])):dialogo.tipo==='editar'?dialogo.fila:dialogo.tipo==='accion'?dialogo.datos:{}} guardar={guardar} ocupado={ocupado} cancelar={()=>setDialogo(undefined)} />}</>}
 </div></ModalPortal>}
 </section>
}
