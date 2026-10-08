import { rutaDestinoSubenlace } from './datos-menu-formulario'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ModalPortal } from '../../iam/presentation/modal-portal'
import { items_menuApi } from '../api/cliente-items-menu'
import type { MenuItemDto } from '../api/tipos-items-menu'
import { FormularioItemMenu, type PadreItemMenu } from './formulario-item-menu'
import { FormularioCms } from './formulario-cms'
import type { DatosFormularioCms } from './campos-cms'
type Edicion = {tipo:'crear'} | {tipo:'editar';fila:MenuItemDto} | {tipo:'accion';fila:MenuItemDto;accion:'activar'|'inactivar'|'eliminar'|'reordenar'}
export function SubenlacesMenu({menuId,rutaPadre,cargarSubmenu,gestionar,verEliminados,cerrar,padre}:{menuId:string;rutaPadre:string;cargarSubmenu:string|null;gestionar:boolean;verEliminados:boolean;cerrar:()=>void;padre:PadreItemMenu}) {
  const [filas,setFilas]=useState<MenuItemDto[]>([]),[error,setError]=useState(''),[cargando,setCargando]=useState(true),[ocupado,setOcupado]=useState(false),[revision,setRevision]=useState(0),[edicion,setEdicion]=useState<Edicion>()
  const bloqueo=useRef(false),vivo=useRef(true)
  useEffect(()=>{vivo.current=true;return()=>{vivo.current=false}},[])
  useEffect(()=>{
    const c=new AbortController();setError('');setCargando(true)
    void(async()=>{
      const lista:MenuItemDto[]=[]
      for(let desplazamiento=0;desplazamiento<=1000000;desplazamiento+=200){
        const lote=await items_menuApi.listar({menuId,limite:200,desplazamiento,incluirEliminados:verEliminados},c.signal)
        lista.push(...lote);if(lote.length<200){if(!c.signal.aborted)setFilas(lista);return}
      }
      throw new Error('El listado supera el límite de consulta')
    })().catch(e=>{if(!c.signal.aborted)setError(e instanceof Error?e.message:'No se pudieron cargar los subenlaces')}).finally(()=>{if(!c.signal.aborted)setCargando(false)})
    return()=>c.abort()
  },[menuId,revision,verEliminados])
  async function guardar(datos:DatosFormularioCms){
    if(!edicion||bloqueo.current||!gestionar)return;bloqueo.current=true;setOcupado(true)
    try {
      if(edicion.tipo==='crear')await items_menuApi.crear({menuId,nombre:String(datos.nombre),categoriaId:String(datos.categoriaId)})
      else if(edicion.tipo==='editar')await items_menuApi.editar(edicion.fila.id,edicion.fila.actualizadoEn,{nombre:String(datos.nombre),categoriaId:String(datos.categoriaId)})
      else if(edicion.accion==='reordenar')await items_menuApi.reordenar(edicion.fila.id,edicion.fila.actualizadoEn,Number(datos.orden))
      else await items_menuApi[edicion.accion](edicion.fila.id,edicion.fila.actualizadoEn)
      if(vivo.current){setEdicion(undefined);setRevision(r=>r+1)}
    }catch(e){throw new Error(`${e instanceof Error?e.message:'No se pudo guardar'}. Si hay un conflicto, actualiza el listado antes de volver a intentar.`)}
    finally{bloqueo.current=false;if(vivo.current)setOcupado(false)}
  }
  return <ModalPortal titulo={`Subenlaces del menú #${menuId}`} cerrar={cerrar} bloqueado={ocupado}><div className="cms-dialog">
    <p>Ruta del padre: {rutaPadre}</p><div className="cms-actions"><button disabled={ocupado||cargando} onClick={()=>{setEdicion(undefined);setRevision(r=>r+1)}}>Actualizar</button>{gestionar&&<button className="cms-primary" disabled={ocupado||cargando} onClick={()=>setEdicion({tipo:'crear'})}>Agregar subenlace</button>}</div>
    {error&&<p role="alert" className="cms-error">{error}</p>}{cargando?<p role="status">Cargando subenlaces…</p>:<div className="cms-table-wrap"><table><thead><tr><th>Nombre</th><th>Ruta</th><th>Destino público</th><th>Estado</th><th>Orden</th><th>Acciones</th></tr></thead><tbody>{filas.map(f=><tr key={f.id}><td>{f.nombre}</td><td>{f.ruta}</td><td>{rutaDestinoSubenlace(cargarSubmenu,rutaPadre,f.ruta)}</td><td>{f.estado} {gestionar&&f.estado!=='eliminado'&&<button disabled={ocupado} onClick={()=>{if(bloqueo.current)return;bloqueo.current=true;setOcupado(true);setError('');void items_menuApi[f.estado==='activo'?'inactivar':'activar'](f.id,f.actualizadoEn).then(()=>{if(vivo.current)setRevision(r=>r+1)}).catch(e=>{if(vivo.current)setError(e instanceof Error?e.message:'No se pudo cambiar el estado')}).finally(()=>{bloqueo.current=false;if(vivo.current)setOcupado(false)})}}>{f.estado==='activo'?'Inactivar':'Activar'}</button>}</td><td>{f.orden}</td><td>{gestionar&&f.estado!=='eliminado'&&<div className="cms-row-actions"><button disabled={ocupado} onClick={()=>setEdicion({tipo:'editar',fila:f})}>Editar</button><button disabled={ocupado} onClick={()=>setEdicion({tipo:'accion',fila:f,accion:'reordenar'})}>Orden</button><button disabled={ocupado} onClick={()=>setEdicion({tipo:'accion',fila:f,accion:'eliminar'})}>Eliminar</button></div>}</td></tr>)}</tbody></table>{!filas.length&&<p>No hay subenlaces registrados.</p>}</div>}
    {edicion&&<><h3>{edicion.tipo==='crear'?'Agregar subenlace':edicion.tipo==='editar'?'Editar subenlace':`Confirmar ${edicion.accion}`}</h3>{edicion.tipo==='accion'&&<p>{edicion.fila.ruta}{edicion.accion==='eliminar'?' se marcará como eliminado.':''}</p>}{edicion.tipo==='accion'&&edicion.accion==='reordenar'?<FormularioOrdenItem key={edicion.fila.id} inicial={edicion.fila.orden} cantidad={filas.filter(f=>f.estado!=='eliminado').length} guardar={guardar} ocupado={ocupado} cancelar={()=>setEdicion(undefined)}/>:edicion.tipo==='accion'?<FormularioCms campos={[]} datos={edicion.fila} guardar={guardar} ocupado={ocupado} cancelar={()=>setEdicion(undefined)}/>:<FormularioItemMenu key={edicion.tipo==='editar'?edicion.fila.id:'nuevo'} padre={padre} datos={edicion.tipo==='editar'?edicion.fila:undefined} guardar={guardar} ocupado={ocupado} cancelar={()=>setEdicion(undefined)}/>}</>}
  </div></ModalPortal>
}

function FormularioOrdenItem({inicial,cantidad,guardar,ocupado,cancelar}:{inicial:number;cantidad:number;guardar:(d:DatosFormularioCms)=>Promise<void>;ocupado:boolean;cancelar:()=>void}){
  const [orden,setOrden]=useState(String(inicial)),[error,setError]=useState('')
  async function enviar(e:FormEvent){e.preventDefault();if(ocupado)return;setError('');try{const valor=Number(orden);if(!Number.isSafeInteger(valor)||valor<1||valor>cantidad)throw new Error(`Selecciona una posición entre 1 y ${cantidad}`);await guardar({orden:valor})}catch(e){setError(e instanceof Error?e.message:'No se pudo reordenar')}}
  return <form className="cms-form" onSubmit={e=>void enviar(e)}><label>Posición<input type="number" min={1} max={cantidad} step={1} required value={orden} disabled={ocupado} onChange={e=>setOrden(e.target.value)}/></label><small>Los demás ítems se desplazan para mantener una numeración consecutiva.</small>{error&&<p role="alert">{error}</p>}<div className="cms-actions"><button type="button" disabled={ocupado} onClick={cancelar}>Cancelar</button><button type="submit" disabled={ocupado}>Guardar orden</button></div></form>
}
