import { rutaDestinoSubenlace } from './datos-menu-formulario'
import { useEffect, useRef, useState } from 'react'
import { ModalPortal } from '../../iam/presentation/modal-portal'
import { items_menuApi } from '../api/cliente-items-menu'
import type { MenuItemDto } from '../api/tipos-items-menu'
import { FormularioCms } from './formulario-cms'
import type { DatosFormularioCms } from './campos-cms'
type Edicion = {tipo:'crear'} | {tipo:'editar';fila:MenuItemDto} | {tipo:'accion';fila:MenuItemDto;accion:'activar'|'inactivar'|'eliminar'|'reordenar'}
export function SubenlacesMenu({menuId,rutaPadre,cargarSubmenu,gestionar,verEliminados,cerrar}:{menuId:string;rutaPadre:string;cargarSubmenu:string|null;gestionar:boolean;verEliminados:boolean;cerrar:()=>void}) {
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
      if(edicion.tipo==='crear')await items_menuApi.crear({menuId,ruta:String(datos.ruta),orden:Number(datos.orden)})
      else if(edicion.tipo==='editar')await items_menuApi.editar(edicion.fila.id,edicion.fila.actualizadoEn,{ruta:String(datos.ruta)})
      else if(edicion.accion==='reordenar')await items_menuApi.reordenar(edicion.fila.id,edicion.fila.actualizadoEn,Number(datos.orden))
      else await items_menuApi[edicion.accion](edicion.fila.id,edicion.fila.actualizadoEn)
      if(vivo.current){setEdicion(undefined);setRevision(r=>r+1)}
    }catch(e){throw new Error(`${e instanceof Error?e.message:'No se pudo guardar'}. Si hay un conflicto, actualiza el listado antes de volver a intentar.`)}
    finally{bloqueo.current=false;if(vivo.current)setOcupado(false)}
  }
  return <ModalPortal titulo={`Subenlaces del menú #${menuId}`} cerrar={cerrar} bloqueado={ocupado}><div className="cms-dialog">
    <p>Ruta del padre: {rutaPadre}</p><div className="cms-actions"><button disabled={ocupado||cargando} onClick={()=>{setEdicion(undefined);setRevision(r=>r+1)}}>Actualizar</button>{gestionar&&<button className="cms-primary" disabled={ocupado||cargando} onClick={()=>setEdicion({tipo:'crear'})}>Agregar subenlace</button>}</div>
    {error&&<p role="alert" className="cms-error">{error}</p>}{cargando?<p role="status">Cargando subenlaces…</p>:<div className="cms-table-wrap"><table><thead><tr><th>Ruta</th><th>Destino público</th><th>Estado</th><th>Orden</th><th>Acciones</th></tr></thead><tbody>{filas.map(f=><tr key={f.id}><td>{f.ruta}</td><td>{rutaDestinoSubenlace(cargarSubmenu,rutaPadre,f.ruta)}</td><td>{f.estado}</td><td>{f.orden}</td><td>{gestionar&&f.estado!=='eliminado'&&<div className="cms-row-actions"><button disabled={ocupado} onClick={()=>setEdicion({tipo:'editar',fila:f})}>Editar</button><button disabled={ocupado} onClick={()=>setEdicion({tipo:'accion',fila:f,accion:f.estado==='activo'?'inactivar':'activar'})}>{f.estado==='activo'?'Inactivar':'Activar'}</button><button disabled={ocupado} onClick={()=>setEdicion({tipo:'accion',fila:f,accion:'reordenar'})}>Orden</button><button disabled={ocupado} onClick={()=>setEdicion({tipo:'accion',fila:f,accion:'eliminar'})}>Eliminar</button></div>}</td></tr>)}</tbody></table>{!filas.length&&<p>No hay subenlaces registrados.</p>}</div>}
    {edicion&&<><h3>{edicion.tipo==='crear'?'Agregar subenlace':edicion.tipo==='editar'?'Editar subenlace':`Confirmar ${edicion.accion}`}</h3>{edicion.tipo==='accion'&&<p>{edicion.fila.ruta}{edicion.accion==='eliminar'?' se marcará como eliminado.':''}</p>}<FormularioCms campos={edicion.tipo==='accion'?(edicion.accion==='reordenar'?[{clave:'orden',etiqueta:'Orden vertical',tipo:'numero'}]:[]):edicion.tipo==='crear'?[{clave:'ruta',etiqueta:'Ruta del subenlace',tipo:'texto'},{clave:'orden',etiqueta:'Orden vertical',tipo:'numero'}]:[{clave:'ruta',etiqueta:'Ruta del subenlace',tipo:'texto'}]} datos={edicion.tipo==='crear'?{ruta:rutaPadre,orden:Math.max(0,...filas.filter(f=>f.estado!=='eliminado').map(f=>f.orden))+1}:edicion.fila} guardar={guardar} ocupado={ocupado} cancelar={()=>setEdicion(undefined)}/></>}
  </div></ModalPortal>
}
