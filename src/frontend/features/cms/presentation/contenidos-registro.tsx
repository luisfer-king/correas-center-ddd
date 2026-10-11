import { useEffect, useRef, useState } from 'react'
import { ModalPortal } from '../../iam/presentation/modal-portal'
import { contenidos_registroApi as api } from '../api/cliente-contenidos-registro'
import type { ContenidoRegistroDto, CrearContenidoRegistro, EditarContenidoRegistro } from '../api/tipos-contenidos-registro'
import type { DatosFormularioCms } from './campos-cms'
import { FormularioContenidoRegistro } from './formulario-contenido-registro'
import { FormularioCms } from './formulario-cms'
type Edicion={tipo:'crear'}|{tipo:'editar';fila:ContenidoRegistroDto}|{tipo:'accion';fila:ContenidoRegistroDto;accion:'activar'|'inactivar'|'eliminar'|'reordenar'}
export function ContenidosRegistro({registroId,nombrePadre,gestionar,verEliminados,cerrar}:{registroId:string;nombrePadre:string;gestionar:boolean;verEliminados:boolean;cerrar:()=>void}){
 const [filas,setFilas]=useState<ContenidoRegistroDto[]>([]),[error,setError]=useState(''),[cargando,setCargando]=useState(true),[ocupado,setOcupado]=useState(false),[revision,setRevision]=useState(0),[edicion,setEdicion]=useState<Edicion>()
 const bloqueo=useRef(false),vivo=useRef(true)
 useEffect(()=>{vivo.current=true;return()=>{vivo.current=false}},[])
 useEffect(()=>{
  const c=new AbortController();setError('');setCargando(true)
  void(async()=>{const lista:ContenidoRegistroDto[]=[]
   for(let desplazamiento=0;desplazamiento<=1000000;desplazamiento+=200){
    const lote=await api.listar({registroId,limite:200,desplazamiento,incluirEliminados:verEliminados},c.signal)
    lista.push(...lote);if(lote.length<200){if(!c.signal.aborted)setFilas(lista);return}
   }throw new Error('El listado supera el límite de consulta')
  })().catch(e=>{if(!c.signal.aborted)setError(e instanceof Error?e.message:'No se pudieron cargar los contenidos')}).finally(()=>{if(!c.signal.aborted)setCargando(false)})
  return()=>c.abort()
 },[registroId,verEliminados,revision])
 async function guardar(datos:DatosFormularioCms){
  if(!edicion||bloqueo.current||!gestionar)return;bloqueo.current=true;setOcupado(true)
  try{
   if(edicion.tipo==='crear')await api.crear({...datos,registroId} as CrearContenidoRegistro)
   else if(edicion.tipo==='editar')await api.editar(edicion.fila.id,edicion.fila.actualizadoEn,datos as EditarContenidoRegistro)
   else if(edicion.accion==='reordenar')await api.reordenar(edicion.fila.id,edicion.fila.actualizadoEn,Number(datos.orden))
   else await api[edicion.accion](edicion.fila.id,edicion.fila.actualizadoEn)
   if(vivo.current){setEdicion(undefined);setRevision(r=>r+1)}
  }finally{bloqueo.current=false;if(vivo.current)setOcupado(false)}
 }
 return <ModalPortal titulo={`Contenidos · ${nombrePadre}`} cerrar={cerrar} bloqueado={ocupado}><div className="cms-dialog">
  <p>Registro padre #{registroId}</p><div className="cms-actions"><button disabled={ocupado||cargando} onClick={()=>{setEdicion(undefined);setRevision(r=>r+1)}}>Actualizar</button>{gestionar&&<button disabled={ocupado||cargando} className="cms-primary" onClick={()=>setEdicion({tipo:'crear'})}>Agregar contenido</button>}</div>
  {error&&<p role="alert" className="cms-error">{error}</p>}{cargando?<p role="status">Cargando contenidos…</p>:<div className="cms-table-wrap"><table><thead><tr><th>Título</th><th>Subtítulo</th><th>Empresa</th><th>Estado</th><th>Orden</th><th>Acciones</th></tr></thead><tbody>{filas.map(f=><tr key={f.id}><td>{f.campos.titulo??`Contenido #${f.id}`}</td><td>{f.campos.subtitulo??'Sin definir'}</td><td>{f.empresaId}</td><td>{f.estado}</td><td>{f.orden}</td><td>{gestionar&&f.estado!=='eliminado'&&<div className="cms-row-actions"><button disabled={ocupado} onClick={()=>setEdicion({tipo:'editar',fila:f})}>Editar</button><button disabled={ocupado} onClick={()=>setEdicion({tipo:'accion',fila:f,accion:f.estado==='activo'?'inactivar':'activar'})}>{f.estado==='activo'?'Inactivar':'Activar'}</button><button disabled={ocupado} onClick={()=>setEdicion({tipo:'accion',fila:f,accion:'reordenar'})}>Orden</button><button disabled={ocupado} onClick={()=>setEdicion({tipo:'accion',fila:f,accion:'eliminar'})}>Eliminar</button></div>}</td></tr>)}</tbody></table>{!filas.length&&<p>No hay contenidos para este registro.</p>}</div>}
  {edicion&&<><h3>{edicion.tipo==='crear'?'Agregar contenido':edicion.tipo==='editar'?'Editar contenido':`Confirmar ${edicion.accion}`}</h3>{edicion.tipo==='accion'?<FormularioCms campos={edicion.accion==='reordenar'?[{clave:'orden',etiqueta:'Orden',tipo:'numero'}]:[]} datos={edicion.fila} guardar={guardar} ocupado={ocupado} cancelar={()=>setEdicion(undefined)}/>:<FormularioContenidoRegistro key={edicion.tipo==='editar'?edicion.fila.id:'nuevo'} registroId={registroId} nombrePadre={nombrePadre} editar={edicion.tipo==='editar'} datos={edicion.tipo==='editar'?edicion.fila:undefined} guardar={guardar} ocupado={ocupado} cancelar={()=>setEdicion(undefined)}/>}</>}
 </div></ModalPortal>
}
